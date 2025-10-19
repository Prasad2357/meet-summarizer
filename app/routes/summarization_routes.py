from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
import json
from app.database import get_db
from app.models import MeetingRecord
from app.schemas import MeetingRecordResponse, MeetingRecordListResponse

router = APIRouter()


@router.get("/", response_model=List[MeetingRecordListResponse])
def get_all_records(
    meeting_type: Optional[str] = Query(None, description="Filter by meeting type (standup, planning, retro, client_call, general)"),
    has_blockers: Optional[bool] = Query(None, description="Filter meetings with blockers"),
    has_red_flags: Optional[bool] = Query(None, description="Filter meetings with red flags"),
    limit: int = Query(50, le=200, description="Maximum number of records to return"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    db: Session = Depends(get_db)
):
    """
    Get all meeting records with optional filtering.
    Returns a lightweight list view with summary information.
    """
    query = db.query(MeetingRecord)
    
    # Apply filters
    if meeting_type:
        query = query.filter(MeetingRecord.meeting_type == meeting_type)
    if has_blockers is not None:
        query = query.filter(MeetingRecord.has_blockers == has_blockers)
    if has_red_flags is not None:
        query = query.filter(MeetingRecord.has_red_flags == has_red_flags)
    
    # Order by most recent first
    records = query.order_by(MeetingRecord.created_at.desc()).offset(skip).limit(limit).all()
    
    # Transform to lightweight list response format
    result = []
    for r in records:
        summary = json.loads(r.summary_json)
        result.append({
            "id": r.id,
            "file_name": r.file_name,
            "meeting_type": r.meeting_type,
            "executive_summary": summary.get("executive_summary", "No summary available"),
            "action_items_count": r.action_items_count,
            "blockers_count": len(summary.get("blockers_and_risks", [])),
            "created_at": r.created_at
        })
    
    return result


@router.get("/{record_id}", response_model=MeetingRecordResponse)
def get_record_by_id(record_id: int, db: Session = Depends(get_db)):
    """
    Get detailed meeting record by ID.
    Returns full summary with all fields.
    """
    record = db.query(MeetingRecord).filter(MeetingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Meeting record {record_id} not found")
    
    # Parse JSON summary
    record.summary_json = json.loads(record.summary_json)
    return record


@router.get("/action-items/pending")
def get_pending_action_items(
    owner: Optional[str] = Query(None, description="Filter by action item owner"),
    priority: Optional[str] = Query(None, description="Filter by priority (High, Medium, Low)"),
    db: Session = Depends(get_db)
):
    """
    Get all pending action items across all meetings.
    Useful for tracking what needs to be done.
    """
    records = db.query(MeetingRecord).filter(MeetingRecord.action_items_count > 0).all()
    
    all_action_items = []
    for record in records:
        summary = json.loads(record.summary_json)
        for item in summary.get("action_items", []):
            # Only include non-completed items
            if item.get("status", "Not Started") != "Completed":
                action_item = {
                    "meeting_id": record.id,
                    "meeting_date": summary.get("meeting_date"),
                    "meeting_type": record.meeting_type,
                    "file_name": record.file_name,
                    **item
                }
                
                # Apply filters
                if owner and item.get("owner", "").lower() != owner.lower():
                    continue
                if priority and item.get("priority", "").lower() != priority.lower():
                    continue
                    
                all_action_items.append(action_item)
    
    # Sort by priority (High -> Medium -> Low)
    priority_order = {"high": 0, "medium": 1, "low": 2}
    all_action_items.sort(key=lambda x: priority_order.get(x.get("priority", "").lower(), 3))
    
    return {
        "total_pending": len(all_action_items),
        "action_items": all_action_items
    }


@router.get("/blockers/active")
def get_active_blockers(
    severity: Optional[str] = Query(None, description="Filter by severity (High, Medium, Low)"),
    db: Session = Depends(get_db)
):
    """
    Get all active blockers and risks across meetings.
    Critical for identifying systemic issues.
    """
    records = db.query(MeetingRecord).filter(MeetingRecord.has_blockers == True).all()
    
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
def get_all_red_flags(db: Session = Depends(get_db)):
    """
    Get all red flags across meetings.
    These are critical issues that need immediate attention.
    """
    records = db.query(MeetingRecord).filter(MeetingRecord.has_red_flags == True).all()
    
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
def get_statistics(db: Session = Depends(get_db)):
    """
    Get overview statistics of all meetings.
    Useful for dashboards and reports.
    """
    total_meetings = db.query(MeetingRecord).count()
    meetings_with_blockers = db.query(MeetingRecord).filter(MeetingRecord.has_blockers == True).count()
    meetings_with_red_flags = db.query(MeetingRecord).filter(MeetingRecord.has_red_flags == True).count()
    
    # Total action items across all meetings
    total_action_items = db.query(func.sum(MeetingRecord.action_items_count)).scalar() or 0
    
    # Meeting type distribution
    meeting_types = db.query(
        MeetingRecord.meeting_type,
        func.count(MeetingRecord.id)
    ).group_by(MeetingRecord.meeting_type).all()
    
    # Recent meetings (last 7 days)
    from datetime import datetime, timedelta
    week_ago = datetime.now() - timedelta(days=7)
    recent_meetings = db.query(MeetingRecord).filter(
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
def get_stats_by_type(meeting_type: str, db: Session = Depends(get_db)):
    """
    Get statistics for a specific meeting type.
    Example: /stats/by-type/standup
    """
    meetings = db.query(MeetingRecord).filter(MeetingRecord.meeting_type == meeting_type).all()
    
    if not meetings:
        raise HTTPException(status_code=404, detail=f"No meetings found of type '{meeting_type}'")
    
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
def delete_record(record_id: int, db: Session = Depends(get_db)):
    """
    Delete a meeting record.
    """
    record = db.query(MeetingRecord).filter(MeetingRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail=f"Meeting record {record_id} not found")
    
    db.delete(record)
    db.commit()
    
    return {"message": f"Meeting record {record_id} deleted successfully"}