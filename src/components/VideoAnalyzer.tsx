'use client';

import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Upload, Play, Pause, AlertTriangle, CheckCircle, X, Activity, Zap, Clock } from 'lucide-react';
import { useDetection } from '@/context/DetectionContext';
import { motion, AnimatePresence } from 'framer-motion';

interface PerformanceMetrics {
    fps: number;
    latency: number;
    totalFrames: number;
    modelLoadTime: number;
}

export default function VideoAnalyzer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const lastFrameTime = useRef<number>(0);
    const frameCount = useRef<number>(0);

    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [objectDetectionModel, setObjectDetectionModel] = useState<cocoSsd.ObjectDetection | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>('/demo_video.mp4');
    const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
    const [detectedObjects, setDetectedObjects] = useState<cocoSsd.DetectedObject[]>([]);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [modelError, setModelError] = useState<string | null>(null);
    const [showAccidentAlert, setShowAccidentAlert] = useState(false);
    const [alertDetails, setAlertDetails] = useState<{ confidence: number } | null>(null);
    const [accidentDetected, setAccidentDetected] = useState(false);
    const lastNotificationTime = useRef<number>(0); // Track last notification time for cooldown
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        latency: 0,
        totalFrames: 0,
        modelLoadTime: 0
    });

    const { setHighConfidence, setCurrentDetection, setConfidenceLevel } = useDetection();

    // Load both models
    useEffect(() => {
        const loadModels = async () => {
            const startTime = performance.now();
            try {
                // Load Teachable Machine model
                const modelURL = '/my_model/model.json';
                const metadataURL = '/my_model/metadata.json';
                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);

                // Load COCO-SSD model
                const cocoModel = await cocoSsd.load();
                setObjectDetectionModel(cocoModel);

                const loadTime = performance.now() - startTime;
                setMetrics(prev => ({ ...prev, modelLoadTime: loadTime }));
                setIsModelLoading(false);

                // Auto-start analysis when models load and video is ready
                if (videoSrc && videoRef.current) {
                    setTimeout(() => {
                        if (videoRef.current && !videoRef.current.paused) {
                            setIsPlaying(true);
                        }
                    }, 500);
                }
            } catch (error) {
                console.error("Failed to load models:", error);
                setModelError("Failed to load ML models. Please check console for details.");
                setIsModelLoading(false);
            }
        };

        loadModels();
    }, [videoSrc]);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setIsPlaying(true);

            // Auto-play the video after it loads
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.play().catch(err => console.log('Autoplay prevented:', err));
                }
            }, 100);
        }
    };

    const drawBoundingBoxes = (objects: cocoSsd.DetectedObject[]) => {
        const canvas = canvasRef.current;
        const video = videoRef.current;

        if (!canvas || !video) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Clear previous drawings
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw bounding boxes
        objects.forEach((obj) => {
            const [x, y, width, height] = obj.bbox;

            // Different colors for different object types
            let color = '#00ff00';
            if (obj.class === 'person') color = '#ff00ff';
            else if (obj.class === 'car' || obj.class === 'truck' || obj.class === 'bus') color = '#00ffff';

            // Draw box
            ctx.strokeStyle = color;
            ctx.lineWidth = 3;
            ctx.strokeRect(x, y, width, height);

            // Draw label background
            ctx.fillStyle = color;
            const label = `${obj.class} ${Math.round(obj.score * 100)}%`;
            const textWidth = ctx.measureText(label).width;
            ctx.fillRect(x, y - 25, textWidth + 10, 25);

            // Draw label text
            ctx.fillStyle = '#000000';
            ctx.font = 'bold 14px Arial';
            ctx.fillText(label, x + 5, y - 7);
        });
    };

    const predict = async () => {
        if (model && objectDetectionModel && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
            const predictionStartTime = performance.now();

            // Run both models
            const [tmPrediction, cocoDetections] = await Promise.all([
                model.predict(videoRef.current),
                objectDetectionModel.detect(videoRef.current)
            ]);

            const predictionEndTime = performance.now();
            const latency = predictionEndTime - predictionStartTime;

            // Update predictions
            setPredictions(tmPrediction);
            setDetectedObjects(cocoDetections);

            // Draw bounding boxes
            drawBoundingBoxes(cocoDetections);

            // Calculate FPS
            frameCount.current++;
            const currentTime = performance.now();
            if (currentTime - lastFrameTime.current >= 1000) {
                const fps = frameCount.current;
                setMetrics(prev => ({
                    ...prev,
                    fps,
                    latency,
                    totalFrames: prev.totalFrames + frameCount.current
                }));
                frameCount.current = 0;
                lastFrameTime.current = currentTime;
            }

            // Check for accident detection with smart cooldown
            const accidentPrediction = tmPrediction.find(p =>
                p.className.toLowerCase().includes('accident')
            );

            if (accidentPrediction && accidentPrediction.probability > 0.7) {
                const currentTime = Date.now();
                const timeSinceLastNotification = currentTime - lastNotificationTime.current;

                // Cooldown logic: Show notification only if:
                // 1. First time detecting OR
                // 2. At least 4 seconds passed since last notification (2.5s display + 1.5s cooldown)
                const COOLDOWN_PERIOD = 4000; // 4 seconds total (2.5s show + 1.5s wait)

                if (!showAccidentAlert && timeSinceLastNotification > COOLDOWN_PERIOD) {
                    setShowAccidentAlert(true);
                    setAlertDetails({ confidence: accidentPrediction.probability });
                    lastNotificationTime.current = currentTime;
                }

                setAccidentDetected(true);
                setHighConfidence(true);
                setCurrentDetection('Accident');
                setConfidenceLevel(accidentPrediction.probability);
            } else {
                setAccidentDetected(false);
                const topPrediction = tmPrediction.reduce((prev, current) =>
                    (prev.probability > current.probability) ? prev : current
                );
                if (topPrediction.probability > 0.7) {
                    setHighConfidence(true);
                    setCurrentDetection(topPrediction.className);
                    setConfidenceLevel(topPrediction.probability);
                } else {
                    setHighConfidence(false);
                }
            }

            requestRef.current = requestAnimationFrame(predict);
        }
    };

    useEffect(() => {
        if (isPlaying && model && objectDetectionModel) {
            lastFrameTime.current = performance.now();
            requestRef.current = requestAnimationFrame(predict);
        } else if (requestRef.current !== null) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, model, objectDetectionModel]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <>
            {/* Accident Alert Notification */}
            {/* CRITICAL ALERT MODAL - Perplexity Style */}
            <AnimatePresence>
                {showAccidentAlert && alertDetails && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowAccidentAlert(false)}
                        />

                        {/* Modal Content - Perplexity Style (Dark Theme) */}
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 10 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", duration: 0.3 }}
                            className="relative z-[10000] bg-[#121212] border border-white/10 rounded-2xl w-full max-w-lg shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-hidden"
                            style={{ margin: 'auto' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/5">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="text-xl">⚠️</span>
                                    <h3 className="font-semibold tracking-wide uppercase text-sm">Critical Alert</h3>
                                </div>
                                <button
                                    onClick={() => setShowAccidentAlert(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Body */}
                            <div className="p-8 text-center">
                                <div className="mb-6">
                                    <h2 className="text-3xl font-medium text-white mb-2">Accident Detected</h2>
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        <span className="font-mono font-bold ml-2">{(alertDetails.confidence * 100).toFixed(1)}% CONFIDENCE</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-left">
                                        <div className="text-gray-400 text-xs uppercase mb-1 font-semibold">Source</div>
                                        <div className="text-white font-medium">Video Analysis</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-left">
                                        <div className="text-gray-400 text-xs uppercase mb-1 font-semibold">Status</div>
                                        <div className="text-red-400 font-medium flex items-center gap-1">
                                            <span>!</span> Incident Logged
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowAccidentAlert(false)}
                                        className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            {/* Footer / Progress bar visual */}
                            <div className="h-1 w-full bg-white/5">
                                <div className="h-full bg-red-600 w-full animate-[shrink_60s_linear_forwards]"></div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Test Trigger (Hidden) */}
            <div className="fixed bottom-4 right-4 z-40 opacity-0 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => {
                        setShowAccidentAlert(true);
                        setAlertDetails({ confidence: 0.94 });
                    }}
                    className="px-3 py-1 bg-gray-800 text-xs text-gray-500 rounded border border-gray-700"
                >
                    Test Alert
                </button>
            </div>

            <div className="glass-card rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player with Canvas Overlay - Left Side (2 columns) */}
                    <div className="lg:col-span-2" >
                        <div className="relative bg-black/50 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                            {videoSrc ? (
                                <>
                                    <video
                                        ref={videoRef}
                                        src={videoSrc}
                                        className="w-full h-full object-contain"
                                        loop
                                        muted
                                        playsInline
                                        autoPlay
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                    />
                                    {/* Canvas overlay for bounding boxes */}
                                    <canvas
                                        ref={canvasRef}
                                        className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                    />
                                </>
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Upload Demo Video</h3>
                                    <p className="text-text-secondary mb-6">Upload a traffic video to analyze with ML models</p>
                                    <label className="bg-accent-teal hover:bg-accent-teal/80 text-black font-bold py-2 px-6 rounded-lg cursor-pointer transition-colors">
                                        Select Video
                                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                                    </label>
                                </div>
                            )}

                            {/* Overlay Controls */}
                            {videoSrc && (
                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                                    <button
                                        onClick={togglePlay}
                                        className="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full backdrop-blur-sm transition-colors"
                                    >
                                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                    </button>
                                    <label className="bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm cursor-pointer text-sm transition-colors">
                                        Change Video
                                        <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Analysis Panel - Right Side (1 column) */}
                    <div className="space-y-6">
                        {/* Performance Metrics */}
                        <div className="glass-card rounded-xl p-4">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-accent-teal" />
                                Performance Metrics
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">FPS:</span>
                                    <span className="font-mono font-bold text-green-500">{metrics.fps}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Latency:</span>
                                    <span className="font-mono font-bold text-yellow-500">{metrics.latency.toFixed(1)}ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Total Frames:</span>
                                    <span className="font-mono font-bold text-blue-500">{metrics.totalFrames}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Load Time:</span>
                                    <span className="font-mono font-bold text-purple-500">{(metrics.modelLoadTime / 1000).toFixed(2)}s</span>
                                </div>
                            </div>
                        </div>

                        {/* Classification Results */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold">Classification</h3>
                                {isModelLoading ? (
                                    <span className="text-yellow-500 text-sm animate-pulse">Loading...</span>
                                ) : modelError ? (
                                    <span className="text-red-500 text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                    </span>
                                ) : (
                                    <span className="text-green-500 text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Active
                                    </span>
                                )}
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-4">
                                {predictions.length > 0 ? (
                                    predictions.map((pred, idx) => {
                                        const isAccident = pred.className.toLowerCase().includes('accident');
                                        const isHighConf = pred.probability > 0.7;

                                        return (
                                            <div key={idx} className={isAccident && isHighConf ? 'animate-pulse' : ''}>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span className="capitalize font-medium">{pred.className}</span>
                                                    <span className={`font-mono ${isAccident && isHighConf ? 'text-red-500 font-bold' : ''}`}>
                                                        {(pred.probability * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-300 ${isAccident && isHighConf
                                                            ? 'bg-red-500'
                                                            : pred.probability > 0.7
                                                                ? 'bg-green-500'
                                                                : 'bg-accent-teal'
                                                            }`}
                                                        style={{ width: `${pred.probability * 100}%` }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-text-secondary text-sm text-center py-4">
                                        {videoSrc ? (isPlaying ? "Analyzing frames..." : "Play video to start") : "Upload video"}
                                    </p>
                                )}
                            </div>
                        </div>

                        {modelError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <p className="text-red-500 text-xs">{modelError}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
