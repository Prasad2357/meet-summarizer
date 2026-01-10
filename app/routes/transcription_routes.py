from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException
from typing import Optional
from sqlalchemy.orm import Session
import shutil, os, json
from app.database import get_db
from app import transcription, summarizer
from app import models
from app.config import UPLOAD_DIR, OLLAMA_MODEL, WHISPER_MODEL_SIZE
from app.schemas import TranscriptInput


router = APIRouter()

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/audio")
async def process_audio(
    file: UploadFile = File(...),
    meeting_type: Optional[str] = Form("auto"),  # NEW: Allow user to specify or auto-detect
    db: Session = Depends(get_db)
):
    """
    Process audio file and generate intelligent summary.
    
    Args:
        file: Audio file (mp3, wav, m4a, etc.)
        meeting_type: Type of meeting - "auto", "standup", "planning", "retro", "client_call", "general"
    
    Returns:
        Meeting record ID, summary, and metadata
    """
    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Transcribe audio using Whisper
    transcript_text = transcription.transcribe_audio(file_path, model_size=WHISPER_MODEL_SIZE)
    
    # Auto-classify meeting type if requested
    if meeting_type == "auto":
        meeting_type = summarizer.classify_meeting_type(transcript_text, OLLAMA_MODEL)
    
    # Generate enhanced summary with context-aware prompt
    summary_data = summarizer.generate_summary_for_large_transcript(OLLAMA_MODEL, transcript_text, meeting_type)
    
    # Extract metadata for quick filtering and statistics
    action_items_count = len(summary_data.get("action_items", []))
    has_blockers = len(summary_data.get("blockers_and_risks", [])) > 0
    has_red_flags = len(summary_data.get("red_flags", [])) > 0

    # Save to database with enhanced fields
    record = models.MeetingRecord(
        file_name=file.filename,
        transcript=transcript_text,
        summary_json=json.dumps(summary_data),
        meeting_type=meeting_type,
        action_items_count=action_items_count,
        has_blockers=has_blockers,
        has_red_flags=has_red_flags
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    
    # Return enhanced response with metadata
    return {
        "id": record.id,
        "file_name": file.filename,  # Add this line
        "meeting_type": meeting_type,
        "summary": summary_data,
        "metadata": {
            "action_items": action_items_count,
            "blockers": len(summary_data.get("blockers_and_risks", [])),
            "red_flags": len(summary_data.get("red_flags", [])),
            "key_decisions": len(summary_data.get("key_decisions", [])),
            "questions_raised": len(summary_data.get("questions_raised", []))
        }
    }


@router.post("/text")
async def process_text(
    file: UploadFile = File(...),
    meeting_type: Optional[str] = Form("auto"),  # NEW: Allow user to specify or auto-detect
    db: Session = Depends(get_db)
):
    """
    Process text transcript file and generate intelligent summary.
    
    Args:
        file: Text file containing meeting transcript (.txt, .md)
        meeting_type: Type of meeting - "auto", "standup", "planning", "retro", "client_call", "general"
    
    Returns:
        Meeting record ID, summary, and metadata
    """
    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Read transcript text
    with open(file_path, "r", encoding="utf-8") as f:
        transcript_text = f.read()

    # Validate transcript is not empty
    if not transcript_text.strip():
        raise HTTPException(status_code=400, detail="Transcript file is empty")

    # Auto-classify meeting type if requested
    if meeting_type == "auto":
        meeting_type = summarizer.classify_meeting_type(transcript_text, OLLAMA_MODEL)

    # Generate enhanced summary with context-aware prompt
    summary_data = summarizer.generate_summary_for_large_transcript(OLLAMA_MODEL, transcript_text, meeting_type)
    
    # Extract metadata for quick filtering and statistics
    action_items_count = len(summary_data.get("action_items", []))
    has_blockers = len(summary_data.get("blockers_and_risks", [])) > 0
    has_red_flags = len(summary_data.get("red_flags", [])) > 0

    # Save to database with enhanced fields
    record = models.MeetingRecord(
        file_name=file.filename,
        transcript=transcript_text,
        summary_json=json.dumps(summary_data),
        meeting_type=meeting_type,
        action_items_count=action_items_count,
        has_blockers=has_blockers,
        has_red_flags=has_red_flags
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    # Return enhanced response with metadata
    return {
        "id": record.id,
        "file_name": file.filename,  # Add this line
        "meeting_type": meeting_type,
        "summary": summary_data,
        "metadata": {
            "action_items": action_items_count,
            "blockers": len(summary_data.get("blockers_and_risks", [])),
            "red_flags": len(summary_data.get("red_flags", [])),
            "key_decisions": len(summary_data.get("key_decisions", [])),
            "questions_raised": len(summary_data.get("questions_raised", []))
        }
    }