from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import json
from app.database import get_db
from app.models import MeetingRecord
from app.schemas import MeetingRecordResponse, MeetingRecordListResponse, PaginatedMeetingRecordResponse
from app.dependencies.auth import get_current_user
from app.models import User

router = APIRouter()


@router.get("/", response_model=PaginatedMeetingRecordResponse)
def get_all_records(
    meeting_type: Optional[str] = Query(None, description="Filter by meeting type (standup, planning, retro, client_call, general)"),
    has_blockers: Optional[bool] = Query(None, description="Filter meetings with blockers"),
    has_red_flags: Optional[bool] = Query(None, description="Filter meetings with red flags"),
    limit: int = Query(50, le=200, description="Maximum number of records to return"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all meeting records with optional filtering.
    Returns a lightweight list view with summary information.
    """
    query = db.query(MeetingRecord).filter(MeetingRecord.user_id == current_user.id)

    # Apply filters

    if meeting_type:
        query = query.filter(MeetingRecord.meeting_type == meeting_type)
    if has_blockers is not None:
        query = query.filter(MeetingRecord.has_blockers == has_blockers)
    if has_red_flags is not None:
        query = query.filter(MeetingRecord.has_red_flags == has_red_flags)
    
    total = query.count()
    # Order by most recent first
    records = query.order_by(MeetingRecord.created_at.desc()).offset(skip).limit(limit).all()
    
    items = []
    for r in records:
        summary = json.loads(r.summary_json)
        items.append({
            "id": r.id,
            "file_name": r.file_name,
            "meeting_type": r.meeting_type,
            "status": r.status,
            "executive_summary": summary.get("executive_summary", "No summary available"),
            "action_items_count": r.action_items_count,
            "blockers_count": len(summary.get("blockers_and_risks", [])),
            "created_at": r.created_at,
        })

    return {
        "items": items,
        "total": total
}


@router.get("/{record_id}", response_model=MeetingRecordResponse)
def get_record_by_id(
    record_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    record = db.query(MeetingRecord).filter(
        MeetingRecord.id == record_id   ,
        MeetingRecord.user_id == current_user.id
    ).first()

    if not record:
        raise HTTPException(status_code=404, detail="Meeting not found")

    record.summary_json = json.loads(record.summary_json)
    return record

@router.get("/action-items/pending")
def get_pending_action_items(
    owner: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    records = db.query(MeetingRecord).filter(
        MeetingRecord.user_id == current_user.id,
        MeetingRecord.action_items_count > 0
    ).all()

    all_action_items = []

    for record in records:
        summary = json.loads(record.summary_json)
        for item in summary.get("action_items", []):
            if item.get("status") == "Completed":
                continue

            if owner and item.get("owner", "").lower() != owner.lower():
                continue
            if priority and item.get("priority", "").lower() != priority.lower():
                continue

            all_action_items.append({
                "meeting_id": record.id,
                "meeting_type": record.meeting_type,
                "file_name": record.file_name,
                **item
            })

    return {
        "total_pending": len(all_action_items),
        "action_items": all_action_items
    }


@router.get("/blockers/active")
def get_active_blockers(
    severity: Optional[str] = Query(None, description="Filter by severity (High, Medium, Low)"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all active blockers and risks across meetings for a specific user.
    Critical for identifying systemic issues.
    """
    records = db.query(MeetingRecord).filter(
        MeetingRecord.user_id == current_user.id,
        MeetingRecord.has_blockers == True
    ).all()
    
    all_blockers = []
    for record in records:
        summary = json.loads(record.summary_json)
        for blocker in summary.get("blockers_and_risks", []):
            blocker_item = {
                "meeting_id": record.id,
                "meeting_date": summary.get("meeting_date"),
                "meeting_type": record.meeting_type,
                "file_name": record.file_name,
                **blocker
            }
            
            # Apply severity filter
            if severity and blocker.get("severity", "").lower() != severity.lower():
                continue
                
            all_blockers.append(blocker_item)
    
    # Sort by severity (High -> Medium -> Low)
    severity_order = {"high": 0, "medium": 1, "low": 2}
    all_blockers.sort(key=lambda x: severity_order.get(x.get("severity", "").lower(), 3))
    
    return {
        "total_blockers": len(all_blockers),
        "high_severity_count": sum(1 for b in all_blockers if b.get("severity", "").lower() == "high"),
        "blockers": all_blockers
    }


@router.get("/red-flags/all")
def get_all_red_flags(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)):
    """
    Get all red flags across meetings for a specific user.
    These are critical issues that need immediate attention.
    """
    records = db.query(MeetingRecord).filter(
        MeetingRecord.user_id == current_user.id,
        MeetingRecord.has_red_flags == True
    ).all()
    
    all_red_flags = []
    for record in records:
        summary = json.loads(record.summary_json)
        for flag in summary.get("red_flags", []):
            all_red_flags.append({
                "meeting_id": record.id,
                "meeting_date": summary.get("meeting_date"),
                "meeting_type": record.meeting_type,
                "file_name": record.file_name,
                "red_flag": flag
            })
    
    return {
        "total_red_flags": len(all_red_flags),
        "red_flags": all_red_flags
    }


@router.get("/stats/overview")
def get_statistics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)):
    """
    Get overview statistics of all meetings for a specific user.
    Useful for dashboards and reports.
    """
    query = db.query(MeetingRecord).filter(MeetingRecord.user_id == current_user.id)
    
    total_meetings = query.count()
    meetings_with_blockers = query.filter(MeetingRecord.has_blockers == True).count()
    meetings_with_red_flags = query.filter(MeetingRecord.has_red_flags == True).count()
    
    # Total action items across all meetings for this user
    total_action_items = db.query(func.sum(MeetingRecord.action_items_count)).filter(MeetingRecord.user_id == current_user.id).scalar() or 0
    
    # Meeting type distribution for this user
    meeting_types = db.query(
        MeetingRecord.meeting_type,
        func.count(MeetingRecord.id)
    ).filter(MeetingRecord.user_id == current_user.id).group_by(MeetingRecord.meeting_type).all()
    
    # Recent meetings (last 7 days) for this user
    from datetime import datetime, timedelta
    week_ago = datetime.now() - timedelta(days=7)
    recent_meetings = db.query(MeetingRecord).filter(
        MeetingRecord.user_id == current_user.id,
        MeetingRecord.created_at >= week_ago
    ).count()
    
    return {
        "total_meetings": total_meetings,
        "recent_meetings_7days": recent_meetings,
        "total_action_items": total_action_items,
        "meetings_with_blockers": meetings_with_blockers,
        "meetings_with_red_flags": meetings_with_red_flags,
        "blocker_rate": round(meetings_with_blockers / total_meetings * 100, 2) if total_meetings > 0 else 0,
        "meeting_type_distribution": {mt[0]: mt[1] for mt in meeting_types}
    }


@router.get("/stats/by-type/{meeting_type}")
def get_stats_by_type(
    meeting_type: str, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics for a specific meeting type for a specific user.
    Example: /stats/by-type/standup
    """
    meetings = db.query(MeetingRecord).filter(
        MeetingRecord.user_id == current_user.id,
        MeetingRecord.meeting_type == meeting_type
    ).all()
    
    if not meetings:
        raise HTTPException(status_code=404, detail=f"No meetings found of type '{meeting_type}' for this user")
    
    total_action_items = sum(m.action_items_count for m in meetings)
    total_blockers = sum(1 for m in meetings if m.has_blockers)
    
    return {
        "meeting_type": meeting_type,
        "total_meetings": len(meetings),
        "total_action_items": total_action_items,
        "avg_action_items_per_meeting": round(total_action_items / len(meetings), 2),
        "meetings_with_blockers": total_blockers,
        "blocker_rate": round(total_blockers / len(meetings) * 100, 2)
    }


@router.delete("/{record_id}")
def delete_record(
    record_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a meeting record for a specific user.
    """
    record = db.query(MeetingRecord).filter(
        MeetingRecord.id == record_id,
        MeetingRecord.user_id == current_user.id
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Meeting record {record_id} not found for this user")
    
    db.delete(record)
    db.commit()
    
    return {"message": f"Meeting record {record_id} deleted successfully"}