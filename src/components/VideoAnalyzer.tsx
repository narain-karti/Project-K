'use client';

import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tmImage from '@teachablemachine/image';
import { Upload, Play, Pause, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useDetection } from '@/context/DetectionContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoAnalyzer() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const requestRef = useRef<number | null>(null);
    const [model, setModel] = useState<tmImage.CustomMobileNet | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoSrc, setVideoSrc] = useState<string | null>('/demo_video.mp4');
    const [predictions, setPredictions] = useState<{ className: string; probability: number }[]>([]);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [modelError, setModelError] = useState<string | null>(null);
    const [showAccidentAlert, setShowAccidentAlert] = useState(false);
    const [accidentDetected, setAccidentDetected] = useState(false);

    const { setHighConfidence, setCurrentDetection, setConfidenceLevel } = useDetection();

    // Load the model
    useEffect(() => {
        const loadModel = async () => {
            try {
                const modelURL = '/my_model/model.json';
                const metadataURL = '/my_model/metadata.json';

                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);
                setIsModelLoading(false);

                // Auto-start analysis when model loads and video is ready
                if (videoSrc && videoRef.current) {
                    // Give the video a moment to start playing
                    setTimeout(() => {
                        if (videoRef.current && !videoRef.current.paused) {
                            setIsPlaying(true);
                        }
                    }, 500);
                }
            } catch (error) {
                console.error("Failed to load model:", error);
                setModelError("Model files not found. Please place 'model.json' and 'metadata.json' in 'public/my_model/' folder.");
                setIsModelLoading(false);
            }
        };

        loadModel();
    }, [videoSrc]);

    const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideoSrc(url);
            setIsPlaying(true);
        }
    };

    const predict = async () => {
        if (model && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
            const prediction = await model.predict(videoRef.current);
            setPredictions(prediction);

            // Check for accident detection
            const accidentPrediction = prediction.find(p =>
                p.className.toLowerCase().includes('accident')
            );

            if (accidentPrediction && accidentPrediction.probability > 0.7) {
                if (!accidentDetected) {
                    setShowAccidentAlert(true);
                    setAccidentDetected(true);

                    // Auto-hide after 5 seconds
                    setTimeout(() => setShowAccidentAlert(false), 5000);
                }

                setHighConfidence(true);
                setCurrentDetection('Accident');
                setConfidenceLevel(accidentPrediction.probability);
            } else {
                setAccidentDetected(false);

                // Update global context with top prediction
                const topPrediction = prediction.reduce((prev, current) =>
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
        if (isPlaying && model) {
            requestRef.current = requestAnimationFrame(predict);
        } else if (requestRef.current !== null) {
            cancelAnimationFrame(requestRef.current);
        }
        return () => {
            if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
        };
    }, [isPlaying, model]);

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
            <AnimatePresence>
                {showAccidentAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        className="fixed top-24 right-8 z-50 bg-red-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md"
                    >
                        <div className="flex items-center gap-3 flex-1">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">⚠️ ACCIDENT DETECTED!</h4>
                                <p className="text-sm text-red-100">High confidence detection - Immediate response required</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowAccidentAlert(false)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="glass-card rounded-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video Player - Left Side (2 columns) */}
                    <div className="lg:col-span-2">
                        <div className="relative bg-black/50 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                            {videoSrc ? (
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
                            ) : (
                                <div className="text-center p-8">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Upload className="w-8 h-8 text-text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">Upload Demo Video</h3>
                                    <p className="text-text-secondary mb-6">Upload a traffic video to analyze with your ML model</p>
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
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Real-time Analysis</h3>
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
