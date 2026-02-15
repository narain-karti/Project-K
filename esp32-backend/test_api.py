
import requests
import json

url = "http://localhost:8000/api/send-alert"
payload = {
    "type": "test_accident",
    "confidence": 0.99,
    "location": "API Test Scripts",
    "force": True
}

try:
    print(f"Sending POST to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"FAILED: {e}")
