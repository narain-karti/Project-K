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

interface Incident {
    id: string;
    type: string;
    confidence: number;
    timestamp: number;
    location: string;
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
    const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [accidentDetected, setAccidentDetected] = useState(false);
    const lastNotificationTime = useRef<number>(0); // Track last notification time for cooldown
    const lastEmailSentTime = useRef<number>(0); // 5-minute email cooldown
    const EMAIL_COOLDOWN = 300000; // 5 minutes in ms
    const [emailCooldownRemaining, setEmailCooldownRemaining] = useState(0);
    const [incidentLogs, setIncidentLogs] = useState<Incident[]>([]);
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fps: 0,
        latency: 0,
        totalFrames: 0,
        modelLoadTime: 0
    });

    // Email cooldown countdown timer
    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = Math.max(0, EMAIL_COOLDOWN - (Date.now() - lastEmailSentTime.current));
            setEmailCooldownRemaining(remaining);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const { setHighConfidence, setCurrentDetection, setConfidenceLevel } = useDetection();

    const sendEmailAlert = async (confidence: number, force: boolean = false) => {
        // Check 5-minute cooldown (unless forced via test button)
        const timeSinceLastEmail = Date.now() - lastEmailSentTime.current;
        if (!force && timeSinceLastEmail < EMAIL_COOLDOWN) {
            console.log(`📧 Email skipped: ${Math.ceil((EMAIL_COOLDOWN - timeSinceLastEmail) / 1000)}s cooldown remaining`);
            return;
        }

        setEmailStatus('sending');
        try {
            const response = await fetch('http://localhost:8000/api/send-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'accident',
                    confidence: confidence,
                    location: 'Video Analysis Feed',
                    force: force
                })
            });
            if (response.ok) {
                setEmailStatus('success');
                lastEmailSentTime.current = Date.now();
                console.log('📧 Alert email sent successfully');
            } else {
                setEmailStatus('error');
                console.error(`Failed to send email: ${response.status}`);
            }
        } catch (error) {
            setEmailStatus('error');
            console.error('Failed to send alert email:', error);
        }
    };

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

            // Check for accident detection — threshold raised to 80%
            const accidentPrediction = tmPrediction.find(p =>
                p.className.toLowerCase().includes('accident')
            );

            if (accidentPrediction && accidentPrediction.probability > 0.8) {
                const currentTime = Date.now();
                const timeSinceLastNotification = currentTime - lastNotificationTime.current;
                const ALERT_COOLDOWN = 4000; // 4 seconds between UI alerts

                if (!showAccidentAlert && timeSinceLastNotification > ALERT_COOLDOWN) {
                    setShowAccidentAlert(true);
                    setAlertDetails({ confidence: accidentPrediction.probability });
                    sendEmailAlert(accidentPrediction.probability); // subject to 5-min cooldown
                    lastNotificationTime.current = currentTime;

                    // ADD TO INCIDENT LOG with 5-minute cooldown check
                    const lastLog = incidentLogs.find(log => log.type === 'Accident');
                    const LOG_COOLDOWN = 300000; // 5 minutes

                    if (!lastLog || (currentTime - lastLog.timestamp) > LOG_COOLDOWN) {
                        const newIncident: Incident = {
                            id: Math.random().toString(36).substr(2, 9),
                            type: 'Accident',
                            confidence: accidentPrediction.probability,
                            timestamp: currentTime,
                            location: 'Video Analysis Feed'
                        };
                        setIncidentLogs(prev => [newIncident, ...prev].slice(0, 50));
                    }
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

            // Control processing rate (throttle to ~15-20 FPS)
            const PROCESSING_INTERVAL = 50; // ms between frames
            setTimeout(() => {
                requestRef.current = requestAnimationFrame(predict);
            }, PROCESSING_INTERVAL);
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
            <div className="glass-card gpu-optimize rounded-2xl p-6 bg-black/40 border-white/5">
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
                        <div className="glass-card gpu-optimize rounded-xl p-4 bg-black/40 border-white/5">
                            <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-accent-teal" />
                                Performance Metrics
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">FPS:</span>
                                    <span className="font-mono font-bold text-accent-teal">{metrics.fps}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Latency:</span>
                                    <span className="font-mono font-bold text-accent-orange">{metrics.latency.toFixed(1)}ms</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Total Frames:</span>
                                    <span className="font-mono font-bold text-white">{metrics.totalFrames}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Load Time:</span>
                                    <span className="font-mono font-bold text-accent-purple">{(metrics.modelLoadTime / 1000).toFixed(2)}s</span>
                                </div>
                            </div>
                        </div>

                        {/* Classification Results */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-lg font-bold">Classification</h3>
                                {isModelLoading ? (
                                    <span className="text-accent-orange text-sm animate-pulse">Loading...</span>
                                ) : modelError ? (
                                    <span className="text-red-500 text-sm flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4" />
                                    </span>
                                ) : (
                                    <span className="text-accent-teal text-sm flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" /> Active
                                    </span>
                                )}
                            </div>

                            {/* Progress Bars */}
                            <div className="space-y-4">
                                {predictions.length > 0 ? (
                                    predictions.map((pred, idx) => {
                                        const isAccident = pred.className.toLowerCase().includes('accident');
                                        const isHighConf = pred.probability > 0.8;

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
                                                                ? 'bg-accent-teal'
                                                                : 'bg-accent-orange'
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

                        {/* INLINE ACCIDENT ALERT — below progress bars */}
                        <AnimatePresence>
                            {showAccidentAlert && alertDetails && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                    animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
                                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className="relative flex h-2.5 w-2.5">
                                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                                                </span>
                                                <span className="text-red-500 font-bold text-sm uppercase tracking-wide">Accident Detected</span>
                                            </div>
                                            <button
                                                onClick={() => setShowAccidentAlert(false)}
                                                className="text-gray-400 hover:text-white transition-colors p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="font-mono text-2xl font-bold text-red-500">
                                                {(alertDetails.confidence * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-text-secondary text-sm">confidence</span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowAccidentAlert(false)}
                                                className="flex-1 py-2 px-3 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Test Email Button + Cooldown Status */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowAccidentAlert(true);
                                    setAlertDetails({ confidence: 0.94 });
                                    sendEmailAlert(0.94, true); // force=true bypasses cooldown
                                }}
                                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-accent-teal/10 hover:bg-accent-teal/20 text-accent-teal border border-accent-teal/20 rounded-lg text-sm font-medium transition-colors"
                            >
                                📧 mailtest
                            </button>
                            {emailCooldownRemaining > 0 && (
                                <span className="text-xs text-text-secondary font-mono">
                                    Next auto-email: {Math.ceil(emailCooldownRemaining / 1000)}s
                                </span>
                            )}
                        </div>


                        {/* Email Status */}
                        {emailStatus !== 'idle' && (
                            <div className={`text-xs font-medium px-3 py-1.5 rounded-lg text-center ${emailStatus === 'sending' ? 'bg-accent-orange/10 text-accent-orange' :
                                emailStatus === 'success' ? 'bg-accent-teal/10 text-accent-teal' :
                                    'bg-red-500/10 text-red-500'
                                }`}>
                                {emailStatus === 'sending' ? '⏳ Sending email...' :
                                    emailStatus === 'success' ? '✅ Email sent successfully' :
                                        '❌ Email failed to send'}
                            </div>
                        )}
                        {modelError && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                                <p className="text-red-500 text-xs">{modelError}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* INCIDENT LOGS SECTION */}
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-5 h-5 text-accent-teal" />
                        <h3 className="text-xl font-bold">Incident Activity Log</h3>
                    </div>

                    <div className="glass-card overflow-hidden border-white/10">
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                            {incidentLogs.length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-white/10">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Timestamp</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Incident Type</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Confidence</th>
                                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-text-secondary">Location</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {incidentLogs.map((log) => (
                                            <motion.tr
                                                key={log.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="hover:bg-white/5 transition-colors group"
                                            >
                                                <td className="px-6 py-4 text-sm font-mono text-text-secondary">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="flex items-center gap-2 text-red-500 font-bold">
                                                        <AlertTriangle className="w-4 h-4" />
                                                        {log.type}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-sm">
                                                    {(log.confidence * 100).toFixed(1)}%
                                                </td>
                                                <td className="px-6 py-4 text-sm text-text-secondary">
                                                    {log.location}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-text-secondary">
                                    <div className="mb-4 flex justify-center opacity-20">
                                        <Activity className="w-12 h-12" />
                                    </div>
                                    <p>No critical incidents detected in this session</p>
                                    <p className="text-xs mt-1">Logs will appear here in real-time when incidents are detected</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
