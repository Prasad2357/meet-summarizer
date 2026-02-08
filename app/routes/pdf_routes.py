from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session
import json

from app.database import get_db
from app.models import MeetingRecord
from app.dependencies.auth import get_current_user
from app.services.file_utils import generate_summary_pdf

router = APIRouter()

@router.get("/records/{record_id}/export")
def export_pdf(
    record_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    record = db.query(MeetingRecord).filter(
        MeetingRecord.id == record_id,
        MeetingRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Record not found")

    summary = json.loads(record.summary_json)

    pdf_bytes = generate_summary_pdf(summary)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=meeting_{record_id}.pdf"
        },
    )
