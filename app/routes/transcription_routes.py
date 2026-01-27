from fastapi import APIRouter, UploadFile, File, Depends, Form, HTTPException, BackgroundTasks
from typing import Optional
from sqlalchemy.orm import Session
import shutil, os, json
from app.database import get_db
from app import transcription, summarizer
from app import models
from app.config import UPLOAD_DIR, OLLAMA_MODEL, WHISPER_MODEL_SIZE
from app.schemas import TranscriptInput
from app.models import User
from app.dependencies.auth import get_current_user
from app.services.meeting_processor import process_meeting

router = APIRouter()

os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/audio")
async def process_audio(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    meeting_type: Optional[str] = Form("auto"),  # NEW: Allow user to specify or auto-detect
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Process audio file and generate intelligent summary.
    
    Args:
        file: Audio file (mp3, wav, m4a, etc.)
        meeting_type: Type of meeting - "auto", "standup", "planning", "retro", "client_call", "general"
    
    Returns:
        Meeting record ID, summary, and metadata
    """

    # user = db.query(User).filter(User.id == current_user.id).first()
    # if not user:
    #     raise HTTPException(status_code=404, detail="User not found")

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        # Create placeholder record
    record = models.MeetingRecord(
        user_id=current_user.id,
        file_name=file.filename,
        source_type="audio",
        transcript="PROCESSING",
        summary_json="{}",
        meeting_type=meeting_type
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    # Run async processing
    background_tasks.add_task(
        process_meeting,
        record.id,
        file_path,
        meeting_type
    )

    return {
        "id": record.id,
        "status": "processing"
    }


@router.post("/text")
async def process_text(
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    file: UploadFile = File(...),
    meeting_type: Optional[str] = Form("auto"),  # NEW: Allow user to specify or auto-detect
    db: Session = Depends(get_db)
):
    """
    Process text transcript file and generate intelligent summary.
    
    Args:
        user_id: ID of the user
        file: Text file containing meeting transcript (.txt, .md)
        meeting_type: Type of meeting - "auto", "standup", "planning", "retro", "client_call", "general"
    
    Returns:
        Meeting record ID, summary, and metadata
    """
    # user = db.query(User).filter(User.id == current_user.id).first()
    # if not user:
    #     raise HTTPException(status_code=404, detail="User not found")

    # Save uploaded file
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

        record = models.MeetingRecord(
        user_id=current_user.id,
        file_name=file.filename,
        source_type="text",
        transcript="PROCESSING",
        summary_json="{}",
        meeting_type=meeting_type
    )

    db.add(record)
    db.commit()
    db.refresh(record)

    background_tasks.add_task(
        process_meeting,
        record.id,
        file_path,
        meeting_type
    )

    return {
        "id": record.id,
        "status": "processing"
    }