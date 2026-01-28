# app/config.py
import os
from dotenv import load_dotenv

# Load environment variables from .env file if it exists
load_dotenv()

DATABASE_URL = "sqlite:///./meeting_records.db"  # For local dev
UPLOAD_DIR = "uploads"

# ---------------------- LLM Configuration ----------------------
# Gemini API Configuration
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")  # Set this in .env file or environment
USE_GEMINI = os.getenv("USE_GEMINI", "true").lower() == "true"  # Set to "false" to use Ollama

# Gemini Models (Recommended: gemini-1.5-flash for speed, gemini-1.5-pro for quality)
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")  # Options: gemini-1.5-flash, gemini-1.5-pro

# Ollama Configuration (Fallback)
OLLAMA_MODEL = "mistral:7b"  # Can be changed to mistral, llama3, etc.
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")

# ---------------------- Whisper Configuration ----------------------
WHISPER_MODEL_SIZE = "tiny"  # Can be tiny, base, small, medium, large

# ---------------------- Security ----------------------
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
