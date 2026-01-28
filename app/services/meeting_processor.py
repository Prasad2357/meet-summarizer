import json
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import transcription, summarizer
from app.models import MeetingRecord
from app.config import OLLAMA_MODEL, WHISPER_MODEL_SIZE
import logging


def process_meeting(record_id: int, file_path: str, meeting_type: str):
    db: Session = SessionLocal()
    record = None

    try:
        record = db.query(MeetingRecord).filter(MeetingRecord.id == record_id).first()
        if not record:
            logging.error(f"Record {record_id} not found")
            return

        # Initial setup - 0-10%
        record.status = "PROCESSING"
        record.progress = 5
        db.commit()

        # 1. Transcribe - 10-40%
        record.progress = 10
        db.commit()
        
        if record.source_type == "audio":
            transcript_text = transcription.transcribe_audio(
                file_path, model_size=WHISPER_MODEL_SIZE
            )
        else:
            # text file → just read
            with open(file_path, "r", encoding="utf-8") as f:
                transcript_text = f.read()
        
        record.progress = 40
        db.commit()
        logging.info(f"Transcript text: {transcript_text}")

        # 2. Auto-detect meeting type - 40-60%
        record.progress = 45
        db.commit()
        
        if meeting_type == "auto":
            meeting_type = summarizer.classify_meeting_type(
                transcript_text, OLLAMA_MODEL
            )
        
        record.progress = 60
        db.commit()

        # 3. Summarize - 60-100%
        record.progress = 65
        db.commit()
        
        summary_data = summarizer.generate_summary_for_large_transcript(
            OLLAMA_MODEL, transcript_text, meeting_type
        )
        
        record.progress = 95
        db.commit()
        logging.info(f"Summary data: {summary_data}")

        # 4. Update record with results
        record.transcript = transcript_text
        record.summary_json = json.dumps(summary_data)
        record.meeting_type = meeting_type
        record.action_items_count = len(summary_data.get("action_items", []))
        record.has_blockers = len(summary_data.get("blockers_and_risks", [])) > 0
        record.has_red_flags = len(summary_data.get("red_flags", [])) > 0
        record.status = "DONE"
        record.progress = 100

        db.commit()
        logging.info(f"Successfully processed meeting {record_id}")

    except Exception as e:
        logging.error(f"Error processing meeting {record_id}: {str(e)}")
        if record:
            try:
                record.transcript = f"ERROR: {str(e)}"
                record.status = "FAILED"
                db.commit()
            except Exception as commit_error:
                logging.error(f"Error updating failed status: {str(commit_error)}")
                db.rollback()
    finally:
        db.close()

