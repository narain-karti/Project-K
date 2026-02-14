try:
    import fastapi
    import uvicorn
    import cv2
    import numpy
    import PIL
    import requests
    import websockets
    import python_multipart
    print("All imports successful")
except ImportError as e:
    print(f"Import failed: {e}")
    exit(1)
