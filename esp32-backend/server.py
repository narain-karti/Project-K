"""
ESP32-CAM Detection Server for Project K
=========================================
Receives video stream from ESP32-CAM, runs ML detection for incidents
(accidents, floods, fire, congestion), and sends results via WebSocket.

Usage:
    python server.py

Endpoints:
    GET  /              - Health check
    GET  /esp32/status  - Check ESP32 connection
    GET  /esp32/stream  - Proxy ESP32 video stream
    WS   /ws/detection  - WebSocket for real-time detection results
"""

import asyncio
import base64
import json
import time
from datetime import datetime
from io import BytesIO
from typing import List, Dict, Any
import cv2
import numpy as np
from PIL import Image
import requests
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse

app = FastAPI(
    title="Project K - ESP32 Detection Server",
    description="ML-powered incident detection from ESP32-CAM feed",
    version="1.0.0"
)

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================
# CONFIGURATION
# ============================================
ESP32_IP = "192.168.1.100"  # ⚠️ CHANGE THIS to your ESP32's IP address
ESP32_STREAM_URL = f"http://{ESP32_IP}/stream"
ESP32_CAPTURE_URL = f"http://{ESP32_IP}/capture"

# Email Configuration
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587
SENDER_EMAIL = "dineshkuttan78@gmail.com"  # ⚠️ PROJECT K: Replace with your Gmail
SENDER_PASSWORD = "tebc irmm pbjv bxzp"  # ⚠️ PROJECT K: Replace with App Password
RECIPIENT_EMAIL = SENDER_EMAIL

# Detection classes
CLASSES = [
    {"id": 0, "name": "normal", "color": "#10b981", "severity": "low"},
    {"id": 1, "name": "accident", "color": "#ef4444", "severity": "critical"},
    {"id": 2, "name": "flood", "color": "#3b82f6", "severity": "high"},
    {"id": 3, "name": "fire", "color": "#f97316", "severity": "critical"},
    {"id": 4, "name": "congestion", "color": "#eab308", "severity": "medium"},
]

# Connected WebSocket clients
connected_clients: List[WebSocket] = []

# Detection history
detection_history: List[Dict] = []

# ============================================
# ML DETECTION (Replace with your actual model)
# ============================================
class IncidentDetector:
    """
    ML-based incident detection.
    Replace the detect() method with your actual model inference.
    """
    
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Load your trained model here"""
        # Example: TensorFlow Lite
        # self.model = tf.lite.Interpreter(model_path="model/incident_model.tflite")
        # self.model.allocate_tensors()
        print("ML Model initialized (using demo detector)")
    
    def preprocess(self, frame: np.ndarray) -> np.ndarray:
        """Preprocess frame for model input"""
        # Resize to model input size
        resized = cv2.resize(frame, (224, 224))
        # Normalize to 0-1
        normalized = resized.astype(np.float32) / 255.0
        # Add batch dimension
        batched = np.expand_dims(normalized, axis=0)
        return batched
    
    def detect(self, frame: np.ndarray) -> Dict[str, Any]:
        """
        Run detection on frame.
        
        Returns:
            {
                "status": "normal" | "alert",
                "detections": [
                    {
                        "class": "accident",
                        "confidence": 0.95,
                        "bbox": [x, y, w, h],
                        "severity": "critical"
                    }
                ],
                "timestamp": "2024-12-23T20:45:00"
            }
        """
        # ============================================
        # TODO: Replace this with your actual model inference
        # ============================================
        
        # Demo detection logic (random for demonstration)
        import random
        
        detections = []
        
        # Analyze frame characteristics for demo
        # In production, replace with actual model.predict()
        
        # Simulate detection with low probability
        if random.random() > 0.85:  # 15% chance per frame
            detected_class = random.choice([1, 2, 3, 4])  # Exclude "normal"
            class_info = CLASSES[detected_class]
            
            # Random bounding box
            h, w = frame.shape[:2]
            x = random.randint(50, w - 200)
            y = random.randint(50, h - 150)
            box_w = random.randint(100, 200)
            box_h = random.randint(80, 150)
            
            detections.append({
                "class": class_info["name"],
                "confidence": round(random.uniform(0.75, 0.98), 2),
                "bbox": [x, y, box_w, box_h],
                "severity": class_info["severity"],
                "color": class_info["color"]
            })
        
        return {
            "status": "alert" if detections else "normal",
            "detections": detections,
            "timestamp": datetime.now().isoformat(),
            "frame_size": {"width": frame.shape[1], "height": frame.shape[0]}
        }

# Global detector instance
detector = IncidentDetector()

# ============================================
# API ENDPOINTS
# ============================================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "running",
        "service": "Project K - ESP32 Detection Server",
        "esp32_ip": ESP32_IP,
        "connected_clients": len(connected_clients)
    }

@app.get("/config")
async def get_config():
    """Get current configuration"""
    return {
        "esp32_ip": ESP32_IP,
        "stream_url": ESP32_STREAM_URL,
        "capture_url": ESP32_CAPTURE_URL,
        "classes": CLASSES
    }

@app.post("/config/esp32")
async def set_esp32_ip(ip: str):
    """Update ESP32 IP address"""
    global ESP32_IP, ESP32_STREAM_URL, ESP32_CAPTURE_URL
    ESP32_IP = ip
    ESP32_STREAM_URL = f"http://{ip}/stream"
    ESP32_CAPTURE_URL = f"http://{ip}/capture"
    return {"status": "updated", "esp32_ip": ESP32_IP}

@app.get("/esp32/status")
async def esp32_status():
    """Check ESP32-CAM connection status"""
    try:
        response = requests.get(ESP32_CAPTURE_URL, timeout=3)
        if response.status_code == 200:
            return {
                "connected": True,
                "ip": ESP32_IP,
                "stream_url": ESP32_STREAM_URL,
                "capture_url": ESP32_CAPTURE_URL
            }
    except requests.exceptions.RequestException as e:
        pass
    
    return {
        "connected": False,
        "ip": ESP32_IP,
        "error": "Cannot reach ESP32-CAM. Check IP address and WiFi connection."
    }

@app.get("/esp32/capture")
async def capture_frame():
    """Capture single frame from ESP32 and return with detection"""
    try:
        response = requests.get(ESP32_CAPTURE_URL, timeout=5)
        if response.status_code == 200:
            # Decode image
            img_array = np.frombuffer(response.content, dtype=np.uint8)
            frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
            
            # Run detection
            result = detector.detect(frame)
            
            # Draw detections on frame
            for det in result["detections"]:
                x, y, w, h = det["bbox"]
                color = tuple(int(det["color"].lstrip('#')[i:i+2], 16) for i in (4, 2, 0))
                cv2.rectangle(frame, (x, y), (x + w, y + h), color, 2)
                label = f"{det['class']} {det['confidence']:.0%}"
                cv2.putText(frame, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
            
            # Encode as JPEG
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            
            result["frame"] = frame_base64
            return result
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"ESP32 capture failed: {str(e)}")

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from pydantic import BaseModel

# ... imports ...


@app.get("/detections/history")
async def get_detection_history():
    """Get recent detection history"""
    return {"detections": detection_history[-50:]}  # Last 50 detections

class AlertRequest(BaseModel):
    type: str
    confidence: float
    location: str = "Unknown Location"
    force: bool = False

# Server-side email cooldown tracking
last_email_sent_time = 0
EMAIL_COOLDOWN_SECONDS = 300  # 5 minutes

@app.post("/api/send-alert")
async def send_email_alert(alert: AlertRequest):
    """Send HTML email alert for critical incidents with 5-min cooldown"""
    global last_email_sent_time

    if SENDER_EMAIL == "your-email@gmail.com":
        print("[!] Email API skipped: Sender credentials not configured.")
        return {"status": "skipped", "message": "Email credentials missing"}

    # Check cooldown (unless force=True from test button)
    current_time = __import__('time').time()
    time_since_last = current_time - last_email_sent_time
    if not alert.force and time_since_last < EMAIL_COOLDOWN_SECONDS:
        remaining = int(EMAIL_COOLDOWN_SECONDS - time_since_last)
        print(f"[*] Email cooldown active: {remaining}s remaining")
        return {"status": "cooldown", "remaining_seconds": remaining}

    try:
        msg = MIMEMultipart("alternative")
        msg['From'] = SENDER_EMAIL
        msg['To'] = RECIPIENT_EMAIL
        msg['Subject'] = f"PROJECT K ALERT: {alert.type.upper()} Detected!"

        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        confidence_pct = f"{alert.confidence * 100:.1f}%"

        # HTML email template
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,Helvetica,sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 20px;">
                <tr><td align="center">
                    <table width="600" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:16px;overflow:hidden;border:1px solid #333;">
                        <!-- Header -->
                        <tr>
                            <td style="background:linear-gradient(135deg,#FF4D00,#CC3D00);padding:24px 32px;">
                                <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">\U0001f6a8 CRITICAL ALERT</h1>
                                <p style="margin:4px 0 0;color:rgba(255,255,255,0.8);font-size:13px;">Project K Incident Detection System</p>
                            </td>
                        </tr>
                        <!-- Body -->
                        <tr>
                            <td style="padding:32px;">
                                <h2 style="margin:0 0 16px;color:#FF4D00;font-size:28px;font-weight:700;">{alert.type.upper()} DETECTED</h2>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                    <tr>
                                        <td width="50%" style="padding:12px;background:#111;border-radius:8px;border:1px solid #333;">
                                            <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Confidence</div>
                                            <div style="color:#FF4D00;font-size:24px;font-weight:700;">{confidence_pct}</div>
                                        </td>
                                        <td width="8"></td>
                                        <td width="50%" style="padding:12px;background:#111;border-radius:8px;border:1px solid #333;">
                                            <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Timestamp</div>
                                            <div style="color:#fff;font-size:14px;font-weight:600;">{timestamp}</div>
                                        </td>
                                    </tr>
                                </table>
                                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                    <tr>
                                        <td style="padding:12px;background:#111;border-radius:8px;border:1px solid #333;">
                                            <div style="color:#888;font-size:11px;text-transform:uppercase;margin-bottom:4px;">Location</div>
                                            <div style="color:#fff;font-size:14px;">{alert.location}</div>
                                        </td>
                                    </tr>
                                </table>
                                <!-- Deploy Ambulance Button -->
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td align="center" style="padding:8px 0;">
                                            <a href="tel:9176257316" style="display:inline-block;background:linear-gradient(135deg,#dc2626,#b91c1c);color:#fff;font-size:18px;font-weight:700;padding:16px 48px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">
                                                \U0001f691 Deploy Ambulance
                                            </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding:8px 0 0;color:#888;font-size:11px;">
                                            Tapping this button will dial 9176257316
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td style="padding:16px 32px;background:#111;border-top:1px solid #333;">
                                <p style="margin:0;color:#666;font-size:11px;text-align:center;">Project K \u2022 Hybrid Traffic Intelligence System \u2022 Automated Alert</p>
                            </td>
                        </tr>
                    </table>
                </td></tr>
            </table>
        </body>
        </html>
        """

        # Plain text fallback
        text_body = f"""
        CRITICAL ALERT - PROJECT K

        Incident: {alert.type.upper()}
        Confidence: {confidence_pct}
        Location: {alert.location}
        Time: {timestamp}

        DEPLOY AMBULANCE: Call 9176257316

        Immediate attention required.
        """

        msg.attach(MIMEText(text_body, 'plain'))
        msg.attach(MIMEText(html_body, 'html'))

        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD.replace(' ', ''))
        server.sendmail(SENDER_EMAIL, RECIPIENT_EMAIL, msg.as_string())
        server.quit()

        last_email_sent_time = current_time
        print(f"\u2709\ufe0f  HTML alert email sent to {RECIPIENT_EMAIL}")
        return {"status": "sent", "recipient": RECIPIENT_EMAIL}

    except Exception as e:
        print(f"Failed to send email: {e}")
        return {"status": "error", "message": str(e)}


# ============================================
# WEBSOCKET FOR REAL-TIME DETECTION
# ============================================

@app.websocket("/ws/detection")
async def detection_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time detection streaming.
    
    Sends JSON messages:
    {
        "type": "detection",
        "status": "normal" | "alert",
        "detections": [...],
        "frame": "base64_encoded_jpeg",
        "timestamp": "ISO8601"
    }
    """
    await websocket.accept()
    connected_clients.append(websocket)
    print(f"Client connected. Total clients: {len(connected_clients)}")
    
    try:
        while True:
            try:
                # Fetch frame from ESP32
                response = requests.get(ESP32_CAPTURE_URL, timeout=3)
                
                if response.status_code == 200:
                    # Decode image
                    img_array = np.frombuffer(response.content, dtype=np.uint8)
                    frame = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
                    
                    if frame is not None:
                        # Run ML detection
                        result = detector.detect(frame)
                        
                        # Draw detections on frame
                        for det in result["detections"]:
                            x, y, w, h = det["bbox"]
                            # Convert hex color to BGR
                            hex_color = det["color"].lstrip('#')
                            color = tuple(int(hex_color[i:i+2], 16) for i in (4, 2, 0))
                            cv2.rectangle(frame, (x, y), (x + w, y + h), color, 3)
                            label = f"{det['class'].upper()} {det['confidence']:.0%}"
                            cv2.putText(frame, label, (x, y - 10), 
                                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, color, 2)
                        
                        # Add timestamp overlay
                        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                        cv2.putText(frame, timestamp, (10, 25), 
                                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
                        
                        # Encode frame as base64
                        _, buffer = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
                        frame_base64 = base64.b64encode(buffer).decode('utf-8')
                        
                        # Store alert detections in history
                        if result["status"] == "alert":
                            detection_history.append({
                                **result,
                                "frame": None  # Don't store frame in history
                            })
                            # Keep only last 100
                            if len(detection_history) > 100:
                                detection_history.pop(0)
                        
                        # Send to client
                        await websocket.send_json({
                            "type": "detection",
                            "connected": True,
                            **result,
                            "frame": frame_base64
                        })
                    else:
                        await websocket.send_json({
                            "type": "error",
                            "connected": True,
                            "message": "Failed to decode frame"
                        })
                else:
                    await websocket.send_json({
                        "type": "error",
                        "connected": False,
                        "message": f"ESP32 returned status {response.status_code}"
                    })
                    
            except requests.exceptions.RequestException as e:
                await websocket.send_json({
                    "type": "error",
                    "connected": False,
                    "message": f"Cannot reach ESP32: {str(e)}"
                })
            
            # Control frame rate (~2-3 FPS for detection)
            await asyncio.sleep(0.4)
            
    except WebSocketDisconnect:
        print("Client disconnected normally")
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if websocket in connected_clients:
            connected_clients.remove(websocket)
        print(f"Client disconnected. Total clients: {len(connected_clients)}")

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    print("-" * 60)
    print("         PROJECT K - ESP32 Detection Server")
    print("-" * 60)
    print("  Endpoints:")
    print("    GET  /              - Health check")
    print("    GET  /esp32/status  - Check ESP32 connection")
    print("    GET  /esp32/capture - Capture frame with detection")
    print("    WS   /ws/detection  - Real-time detection stream")
    print("-" * 60)
    print("  Update ESP32_IP in this file with your camera's IP")
    print("-" * 60)
    
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
