# app/schemas.py
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime


class TranscriptInput(BaseModel):
    transcript: str
    meeting_type: Optional[str] = "general"


class ActionItem(BaseModel):
    task: str
    owner: str
    due_date: str
    priority: str = "Medium"
    dependencies: str = "None"
    status: str = "Not Started"


class KeyDecision(BaseModel):
    decision: str
    rationale: str
    impact: str
    decided_by: str


class DiscussionPoint(BaseModel):
    topic: str
    summary: str
    outcome: str
    participants: List[str] = []


class BlockerRisk(BaseModel):
    issue: str
    severity: str
    affected_areas: List[str]
    mitigation: Optional[str] = None


class NewRequirement(BaseModel):
    requirement: str
    source: str
    priority: str
    estimated_effort: str = "Unknown"


class Question(BaseModel):
    question: str
    asked_by: Optional[str] = None
    needs_answer_from: Optional[str] = None


class MetricsMentioned(BaseModel):
    velocity: Optional[str] = None
    burndown: Optional[str] = None
    completion_rate: Optional[str] = None
    other: Dict = {}


class FollowUp(BaseModel):
    immediate: List[str] = []
    this_week: List[str] = []
    later: List[str] = []


class SentimentAnalysis(BaseModel):
    overall_mood: str
    concerns_level: str
    team_confidence: str


class EnhancedSummary(BaseModel):
    meeting_type: str
    meeting_date: str
    executive_summary: str
    key_decisions: List[KeyDecision] = []
    action_items: List[ActionItem] = []
    discussion_points: List[DiscussionPoint] = []
    blockers_and_risks: List[BlockerRisk] = []
    new_requirements: List[NewRequirement] = []
    questions_raised: List[Question] = []
    metrics_mentioned: MetricsMentioned
    next_steps: List[str] = []
    attendees_mentioned: List[str] = []
    follow_up_needed: FollowUp
    context_for_absentees: str
    sentiment_analysis: SentimentAnalysis
    red_flags: List[str] = []


class MeetingRecordResponse(BaseModel):
    id: int
    file_name: str
    transcript: str
    summary_json: EnhancedSummary
    meeting_type: str
    created_at: datetime

    class Config:
        orm_mode = True


class MeetingRecordListResponse(BaseModel):
    id: int
    file_name: str
    meeting_type: str
    executive_summary: str
    action_items_count: int
    blockers_count: int
    created_at: datetime

    class Config:
        orm_mode = True

class PaginatedMeetingRecordResponse(BaseModel):
    items: List[MeetingRecordListResponse]
    total: int

class UserBase(BaseModel):
    name: str
    email: EmailStr
    
class UserCreate(UserBase):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True