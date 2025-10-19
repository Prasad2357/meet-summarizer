# app/services/transcription.py
import os
import whisper

def transcribe_audio(file_path: str, model_size: str = "tiny") -> str:
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Audio file not found: {file_path}")
    model = whisper.load_model(model_size)
    result = model.transcribe(file_path)
    return result.get("text", "").strip()
