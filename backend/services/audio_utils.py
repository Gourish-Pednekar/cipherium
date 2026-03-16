import whisper
import os

print("Loading Whisper 'small' model...")
whisper_model = whisper.load_model("small")

def transcribe_audio(file_path: str):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")
        
    # We pass fp16=False to avoid warnings on some Linux/CPU setups
    # We pass task="transcribe" to explicitly STOP it from translating to English
    result = whisper_model.transcribe(
        file_path, 
        task="transcribe",
        fp16=False
    )
    
    return result["text"], result["language"]