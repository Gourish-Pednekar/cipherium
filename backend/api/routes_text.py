from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.threat_scanner import scan_text_for_threats
from services.ml_pipeline import analyze_intent
from services.language_utils import detect_language  # <-- NEW IMPORT

router = APIRouter()

class TextAnalyzeRequest(BaseModel):
    text: str

@router.post("/analyze-text")
async def analyze_text(request: TextAnalyzeRequest):
    if not request.text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")
        
    text = request.text
    
    # Run the engines
    detected_lang = detect_language(text)  # <-- RUN FASTTEXT
    flags = scan_text_for_threats(text)
    ai_risk_score = analyze_intent(text)
    
    # Calculate score
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
        "risk_level": risk_level,
        "risk_score": round(final_score, 2),
        "language_detected": detected_lang,  # <-- ADD TO PAYLOAD
        "original_text": text,
        "flags": flags
    }