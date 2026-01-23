from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from sqlalchemy.sql import func
from app.database import Base

class MeetingRecord(Base):
    __tablename__ = "meeting_records"

    id = Column(Integer, primary_key=True, index=True)
    file_name = Column(String, nullable=False)
    transcript = Column(Text, nullable=False)
    summary_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    # NEW FIELDS - Add these for enhanced functionality
    meeting_type = Column(String, default="general", index=True)  # standup, planning, retro, client_call, general
    has_blockers = Column(Boolean, default=False, index=True)     # Quick filter for meetings with blockers
    has_red_flags = Column(Boolean, default=False, index=True)    # Quick filter for critical issues
    action_items_count = Column(Integer, default=0)               # Count for quick stats
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # Track when summaries are regenerated


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

