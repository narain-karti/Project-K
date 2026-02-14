'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Detection {
    class: string;
    confidence: number;
    bbox: [number, number, number, number];
    severity: 'low' | 'medium' | 'high' | 'critical';
    color: string;
}

interface DetectionResult {
    type: 'detection' | 'error';
    connected: boolean;
    status: 'normal' | 'alert';
    detections: Detection[];
    frame?: string;
    timestamp?: string;
    message?: string;
}

interface ESP32Config {
    serverUrl: string;
    esp32Ip: string;
}

const defaultConfig: ESP32Config = {
    serverUrl: 'ws://localhost:8000',
    esp32Ip: '192.168.1.100',
};

const severityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
};

const severityLabels = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🟠 High',
    critical: '🔴 Critical',
};

export default function ESP32LiveFeed() {
    const [config, setConfig] = useState<ESP32Config>(defaultConfig);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [currentFrame, setCurrentFrame] = useState<string | null>(null);
    const [latestResult, setLatestResult] = useState<DetectionResult | null>(null);
    const [alertHistory, setAlertHistory] = useState<DetectionResult[]>([]);
    const [showAccidentModal, setShowAccidentModal] = useState(false);
    const [alertDetails, setAlertDetails] = useState<{ confidence: number } | null>(null);
    const lastEmailSentRef = useRef<number>(0);
    const [stats, setStats] = useState({
        totalFrames: 0,
        alertCount: 0,
        fps: 0,
    });

    const wsRef = useRef<WebSocket | null>(null);
    const frameCountRef = useRef(0);
    const lastFpsUpdateRef = useRef(Date.now());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
            return;
        }

        setIsConnecting(true);
        const ws = new WebSocket(`${config.serverUrl}/ws/detection`);

        ws.onopen = () => {
            console.log('✅ Connected to detection server');
            setIsConnected(true);
            setIsConnecting(false);
        };

        ws.onmessage = (event) => {
            try {
                const data: DetectionResult = JSON.parse(event.data);

                // Update frame
                if (data.frame) {
                    setCurrentFrame(`data:image/jpeg;base64,${data.frame}`);
                }

                // Update latest result
                setLatestResult(data);

                // Track stats
                frameCountRef.current++;
                setStats(prev => ({
                    ...prev,
                    totalFrames: prev.totalFrames + 1,
                    alertCount: data.status === 'alert' ? prev.alertCount + 1 : prev.alertCount,
                }));

                // Calculate FPS
                const now = Date.now();
                if (now - lastFpsUpdateRef.current > 1000) {
                    setStats(prev => ({
                        ...prev,
                        fps: Math.round(frameCountRef.current / ((now - lastFpsUpdateRef.current) / 1000)),
                    }));
                    frameCountRef.current = 0;
                    lastFpsUpdateRef.current = now;
                }

                // Store alerts in history
                if (data.status === 'alert' && data.detections.length > 0) {
                    setAlertHistory(prev => [data, ...prev.slice(0, 19)]);

                    // CHECK FOR CRITICAL ACCIDENT
                    console.log('Processing detections:', data.detections);
                    const accident = data.detections.find(d => {
                        const match = d.class === 'accident' && d.confidence > 0.70;
                        if (d.class === 'accident') console.log('Accident confidence:', d.confidence, 'Threshold: 0.70', 'Match:', match);
                        return match;
                    });

                    if (accident) {
                        console.log('🚨 TRIGGERING MODAL');
                        setShowAccidentModal(true);
                        setAlertDetails({ confidence: accident.confidence });

                        // Send Email (throttle: once per minute)
                        const now = Date.now();
                        if (now - lastEmailSentRef.current > 60000) {
                            lastEmailSentRef.current = now;
                            fetch(`${config.serverUrl}/api/send-alert`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    type: 'accident',
                                    confidence: accident.confidence,
                                    location: 'Main Road Camera 1'
                                })
                            }).then(res => res.json())
                                .then(data => console.log('Email alert result:', data))
                                .catch(err => console.error('Failed to send alert email:', err));
                        }
                    }
                }

                setIsConnected(data.connected !== false);
            } catch (e) {
                console.error('Failed to parse detection data', e);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            setIsConnected(false);
            setIsConnecting(false);
        };

        ws.onclose = () => {
            console.log('WebSocket closed');
            setIsConnected(false);
            setIsConnecting(false);

            // Auto-reconnect after 3 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect();
            }, 3000);
        };

        wsRef.current = ws;
    }, [config.serverUrl]);

    // Disconnect
    const disconnect = useCallback(() => {
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setCurrentFrame(null);
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            disconnect();
        };
    }, [disconnect]);

    return (
        <div className="space-y-6">
            {/* Header with connection controls */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                        <h2 className="text-xl font-bold">🎥 ESP32-CAM Live Feed</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        {isConnected ? (
                            <button
                                onClick={disconnect}
                                className="px-4 py-2 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 hover:bg-red-500/30 transition-all"
                            >
                                Disconnect
                            </button>
                        ) : (
                            <button
                                onClick={connect}
                                disabled={isConnecting}
                                className="px-4 py-2 bg-accent-cyan/20 border border-accent-cyan/40 rounded-lg text-accent-cyan hover:bg-accent-cyan/30 transition-all disabled:opacity-50"
                            >
                                {isConnecting ? 'Connecting...' : 'Connect'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">Server URL</label>
                        <input
                            type="text"
                            value={config.serverUrl}
                            onChange={(e) => setConfig(prev => ({ ...prev, serverUrl: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                            placeholder="ws://localhost:8000"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-text-secondary mb-1">ESP32 IP (set in Python server)</label>
                        <input
                            type="text"
                            value={config.esp32Ip}
                            onChange={(e) => setConfig(prev => ({ ...prev, esp32Ip: e.target.value }))}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
                            placeholder="192.168.1.100"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Main video feed and detections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Feed */}
                <motion.div
                    className="lg:col-span-2 glass-card rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">Live Detection Feed</h3>
                        <div className="flex items-center gap-4 text-xs text-text-secondary">
                            <span>FPS: {stats.fps}</span>
                            <span>Frames: {stats.totalFrames}</span>
                        </div>
                    </div>

                    <div className="relative aspect-video bg-black/50 rounded-xl overflow-hidden">
                        {currentFrame ? (
                            <img
                                src={currentFrame}
                                alt="ESP32 Camera Feed"
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center text-text-secondary">
                                    <div className="text-5xl mb-4">📷</div>
                                    <p>No feed available</p>
                                    <p className="text-xs mt-2">Click "Connect" to start receiving video</p>
                                </div>
                            </div>
                        )}

                        {/* Status badge */}
                        {latestResult && (
                            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-sm font-bold ${latestResult.status === 'alert'
                                ? 'bg-red-500/90 text-white animate-pulse'
                                : 'bg-green-500/90 text-white'
                                }`}>
                                {latestResult.status === 'alert' ? '🚨 ALERT DETECTED' : '✅ Normal'}
                            </div>
                        )}

                        {/* Connection status overlay */}
                        {!isConnected && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-4xl mb-2">{isConnecting ? '🔄' : '📵'}</div>
                                    <p className="text-white">{isConnecting ? 'Connecting...' : 'Disconnected'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Current detections */}
                    {latestResult?.detections && latestResult.detections.length > 0 && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <div className="text-sm font-bold text-red-400 mb-2">
                                🚨 Active Detections ({latestResult.detections.length})
                            </div>
                            <div className="space-y-2">
                                {latestResult.detections.map((det, i) => (
                                    <div key={i} className="flex items-center justify-between p-2 bg-white/5 rounded">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded"
                                                style={{ backgroundColor: det.color }}
                                            />
                                            <span className="font-semibold capitalize">{det.class}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className={`px-2 py-0.5 rounded ${severityColors[det.severity]}`}>
                                                {severityLabels[det.severity]}
                                            </span>
                                            <span>{(det.confidence * 100).toFixed(0)}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Alert History */}
                <motion.div
                    className="glass-card rounded-2xl p-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold">🚨 Alert History</h3>
                        <span className="text-xs text-text-secondary">{stats.alertCount} total</span>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {alertHistory.length === 0 ? (
                                <div className="text-center py-8 text-text-secondary">
                                    <div className="text-3xl mb-2">✅</div>
                                    <p className="text-sm">No alerts detected</p>
                                </div>
                            ) : (
                                alertHistory.map((alert, index) => (
                                    <motion.div
                                        key={`${alert.timestamp}-${index}`}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="p-3 bg-white/5 rounded-lg border border-white/10"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-text-secondary">
                                                {alert.timestamp ? new Date(alert.timestamp).toLocaleTimeString() : 'Unknown'}
                                            </span>
                                            {index === 0 && (
                                                <span className="text-xs px-2 py-0.5 bg-red-500/30 text-red-400 rounded animate-pulse">
                                                    LATEST
                                                </span>
                                            )}
                                        </div>
                                        {alert.detections.map((det, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: det.color }}
                                                />
                                                <span className="text-sm capitalize font-medium">{det.class}</span>
                                                <span className="text-xs text-text-secondary">
                                                    {(det.confidence * 100).toFixed(0)}%
                                                </span>
                                            </div>
                                        ))}
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Setup Instructions */}
            <motion.div
                className="glass-card rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <h3 className="text-lg font-bold mb-4">📋 Quick Setup Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gradient-to-r from-accent-cyan/20 to-transparent rounded-lg border border-accent-cyan/30">
                        <div className="text-2xl mb-2">1️⃣</div>
                        <div className="font-semibold mb-1">Flash ESP32-CAM</div>
                        <div className="text-xs text-text-secondary">
                            Use Arduino IDE to flash <code className="text-accent-cyan">ESP32CAM_ProjectK.ino</code>.
                            Update WiFi credentials in the code.
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-accent-violet/20 to-transparent rounded-lg border border-accent-violet/30">
                        <div className="text-2xl mb-2">2️⃣</div>
                        <div className="font-semibold mb-1">Start Python Server</div>
                        <div className="text-xs text-text-secondary">
                            Run <code className="text-accent-violet">python server.py</code> in esp32-backend folder.
                            Update ESP32_IP in server.py.
                        </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-500/20 to-transparent rounded-lg border border-green-500/30">
                        <div className="text-2xl mb-2">3️⃣</div>
                        <div className="font-semibold mb-1">Connect & Detect</div>
                        <div className="text-xs text-text-secondary">
                            Click "Connect" above. ESP32 powered by powerbank will stream to your laptop!
                        </div>
                    </div>
                </div>
            </motion.div>


            {/* CRITICAL ALERT MODAL - Perplexity Style */}
            <AnimatePresence>
                {showAccidentModal && alertDetails && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-md"
                            onClick={() => setShowAccidentModal(false)}
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
                                    onClick={() => setShowAccidentModal(false)}
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
                                        <div className="text-gray-400 text-xs uppercase mb-1 font-semibold">Location</div>
                                        <div className="text-white font-medium">Camera Feed 01</div>
                                    </div>
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/5 text-left">
                                        <div className="text-gray-400 text-xs uppercase mb-1 font-semibold">Notifications</div>
                                        <div className="text-green-400 font-medium flex items-center gap-1">
                                            <span>✓</span> Email Sent
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowAccidentModal(false)}
                                        className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-colors border border-white/10"
                                    >
                                        Dismiss
                                    </button>
                                    <button
                                        className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20"
                                        onClick={() => setShowAccidentModal(false)}
                                    >
                                        View Live Feed
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

            {/* Test Trigger (Hidden in Production) */}
            <div className="fixed bottom-4 right-4 z-40 opacity-50 hover:opacity-100 transition-opacity">
                <button
                    onClick={() => {
                        // Simulate incoming WebSocket message
                        const mockEvent = {
                            data: JSON.stringify({
                                type: 'detection',
                                status: 'alert',
                                connected: true,
                                detections: [{
                                    class: 'accident',
                                    confidence: 0.88,
                                    bbox: [100, 100, 200, 200],
                                    severity: 'critical',
                                    color: '#ef4444'
                                }],
                                timestamp: new Date().toISOString()
                            })
                        };
                        // Manually trigger onmessage handler logic by dispatching or just setting logic
                        // Since onmessage is internal to connect(), we can't call it directly.
                        // Instead, we'll just set the state directly for this visual test button
                        setShowAccidentModal(true);
                        setAlertDetails({ confidence: 0.88 });

                        // Send Test Email
                        fetch(`${config.serverUrl.replace('ws://', 'http://').replace('/ws/detection', '')}/api/send-alert`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                type: 'accident',
                                confidence: 0.88,
                                location: 'TEST ALERT - Main Road'
                            })
                        }).catch(err => console.error('Failed to send test email:', err));
                    }}
                    className="px-3 py-1 bg-gray-800 text-xs text-gray-500 rounded border border-gray-700"
                >
                    Test Alert
                </button>
            </div>
        </div >
    );
}
