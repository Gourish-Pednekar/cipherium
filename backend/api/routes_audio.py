from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid
from services.audio_utils import transcribe_audio
from services.threat_scanner import scan_text_for_threats
from services.ml_pipeline import analyze_intent

router = APIRouter()

# Create a temporary directory to hold audio files while processing
TEMP_DIR = "temp_audio"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/analyze-audio")
async def analyze_audio(file: UploadFile = File(...)):
    # 1. Validate file type (prevent weird uploads)
    if not file.filename.endswith(('.mp3', '.wav', '.ogg', '.m4a', '.flac')):
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    # 2. Save file temporarily with a unique name
    temp_file_path = os.path.join(TEMP_DIR, f"{uuid.uuid4()}_{file.filename}")
    with open(temp_file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # 3. Transcribe the audio using Whisper
        transcribed_text, audio_lang = transcribe_audio(temp_file_path)
        
        # 4. If the audio is silent or empty, stop here
        if not transcribed_text.strip():
            return {"status": "error", "message": "No speech detected in audio."}

        # 5. Recycle our existing Text ML Engines!
        flags = scan_text_for_threats(transcribed_text)
        ai_risk_score = analyze_intent(transcribed_text)
        
        # Calculate final score
        final_score = ai_risk_score
        if any(f["category"] in ["data_extraction", "suspicious_url"] for f in flags):
            final_score = min(1.0, final_score + 0.3)

        # Risk logic
        if final_score < 0.4:
            risk_level = "Safe"
        elif final_score < 0.7:
            risk_level = "Suspicious"
        else:
            risk_level = "High Risk"

        return {
            "status": "success",
            "type": "audio",
            "risk_level": risk_level,
            "risk_score": round(final_score, 2),
            "language_detected": audio_lang, 
            "original_text": transcribed_text, # We send the transcript to the frontend!
            "flags": flags
        }

    finally:
        # 6. ALWAYS clean up the temp file so your hard drive doesn't fill up
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)