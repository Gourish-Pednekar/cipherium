from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes_text import router as text_router
from api.routes_audio import router as audio_router   # audio routes

app = FastAPI(
title="Cipherium AI Phishing Shield",
description="Multilingual phishing detection API",
version="0.1.0"
)

# Runs once when the server starts

@app.on_event("startup")
async def startup_event():
  print("Starting Cipherium backend...")
print("System ready")

# Allow the frontend (React etc.) to communicate with the backend

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],   # development / hackathon
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

# Health check endpoint

@app.get("/")
def health_check():
  return {
"status": "Backend engine is live",
"service": "Cipherium Phishing Detection API"
}

# Register routers

app.include_router(text_router, prefix="/api", tags=["Text Analysis"])
app.include_router(audio_router, prefix="/api", tags=["Audio Analysis"])
