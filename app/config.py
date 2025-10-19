# app/config.py

DATABASE_URL = "sqlite:///./meeting_records.db"  # For local dev
UPLOAD_DIR = "uploads"
OLLAMA_MODEL = "mistral:7b"  # Can be changed to mistral, llama3, etc.
WHISPER_MODEL_SIZE = "tiny"  # Can be tiny, base, small, medium, large
