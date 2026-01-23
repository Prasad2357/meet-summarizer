from fastapi import FastAPI
from app.routes import transcription_routes, summarization_routes, user_routes
from app.database import Base, engine
from fastapi.middleware.cors import CORSMiddleware
from app.models import User  # IMPORTANT: ensure User is imported
from app.models import Base
from sqlalchemy import create_engine

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Meeting Summarizer API",
    description="Transcribes meeting audio or reads transcript text, then generates structured summaries.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to ["http://127.0.0.1:8000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(transcription_routes.router, prefix="/process", tags=["Processing"])
app.include_router(summarization_routes.router, prefix="/records", tags=["Records"])
app.include_router(summarization_routes.router, prefix="/users", tags=["Users"])
