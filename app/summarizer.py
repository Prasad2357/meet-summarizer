import ollama
import json
import re
from datetime import datetime
from typing import Dict, Any, List
import tiktoken
from rapidfuzz import fuzz

ENCODER = tiktoken.get_encoding("cl100k_base")  # Mistral 7B compatible

# ---------------------- Transcript Utilities ----------------------

def clean_transcript(transcript: str) -> str:
    """Remove timestamps, normalize speaker labels, collapse extra spaces"""
    transcript = re.sub(r'\d{2}:\d{2}:\d{2}\s+', '', transcript)
    transcript = re.sub(r'(.*?)\s*\(.*?\):', r'\1:', transcript)
    transcript = re.sub(r'\s+', ' ', transcript).strip()
    return transcript


def chunk_transcript_by_tokens(transcript: str, max_tokens: int = 6000, overlap_tokens: int = 200) -> List[str]:
    """Split transcript into token-safe chunks with overlap"""
    paragraphs = [p.strip() for p in re.split(r'\n+|\.\s+', transcript) if p.strip()]
    chunks, current_chunk, current_tokens = [], [], 0

    for paragraph in paragraphs:
        paragraph_tokens = len(ENCODER.encode(paragraph))
        if current_tokens + paragraph_tokens > max_tokens:
            if current_chunk:
                chunks.append(" ".join(current_chunk))
                overlap_chunk = current_chunk[-overlap_tokens // max(1, paragraph_tokens):]
                current_chunk = overlap_chunk.copy()
                current_tokens = sum(len(ENCODER.encode(p)) for p in current_chunk)
        current_chunk.append(paragraph)
        current_tokens += paragraph_tokens

    if current_chunk:
        chunks.append(" ".join(current_chunk))
    return chunks


def _deduplicate_list_by_key(items: List[dict], key_func, threshold: int = 90) -> List[dict]:
    """Fuzzy deduplicate items by key"""
    unique_items = []
    for item in items:
        if not any(fuzz.ratio(key_func(item), key_func(u)) >= threshold for u in unique_items):
            unique_items.append(item)
    return unique_items


def safe_json_parse(model_output: str) -> dict:
    """Extract JSON from LLM output safely"""
    cleaned = model_output.strip()
    cleaned = re.sub(r'^```json\s*', '', cleaned)
    cleaned = re.sub(r'^```\s*', '', cleaned)
    cleaned = re.sub(r'\s*```$', '', cleaned)
    json_start, json_end = cleaned.find("{"), cleaned.rfind("}") + 1
    if json_start == -1 or json_end == 0:
        return {}
    try:
        return json.loads(cleaned[json_start:json_end])
    except json.JSONDecodeError:
        return {}

# ---------------------- Normalization ----------------------

# Helper function to check if a key or content is action-related
def is_action_key(key: str) -> bool:
    """Checks if a string suggests an action, task, or commitment."""
    return any(keyword in key.lower() for keyword in ["action", "commit", "task", "responsible", "deadline", "target"])

# Helper function to check if a key or content is decision/goal-related
def is_goal_key(key: str) -> bool:
    """Checks if a string suggests a goal, objective, or decision."""
    return any(keyword in key.lower() for keyword in ["goal", "decide", "objective", "plan", "strategy"])


def normalize_summary_fields(summary: dict) -> dict:
    """Normalize and fill structured summary fields dynamically by content cross-referencing."""
    if not summary:
        return {}

    # 1. Dynamically extract core data from the top level or 'Meeting' key
    core_data = summary.pop("Meeting", summary)
    
    # Initialize dynamic containers
    dynamic_actions = []
    dynamic_decisions = []
    dynamic_attendees = []
    
    # 2. Iterate through core_data to dynamically map content
    for key, value in core_data.items():
        # Handle Attendees (simple list of strings)
        if "attendee" in key.lower() and isinstance(value, list):
            dynamic_attendees.extend(value)
            
        # If the value is a list of objects (the most common format for actions/goals)
        if isinstance(value, list) and value and isinstance(value[0], dict):
            # Check for Action/Commitment Lists (Commitments, Action_Items)
            if is_action_key(key) or "action_items" in key.lower():
                for item in value:
                    # Generic extraction logic for action items
                    action_list = [v for k, v in item.items() if isinstance(v, str) and is_action_key(k) and len(v) > 5]
                    owner_list = [v for k, v in item.items() if isinstance(v, str) and ("responsible" in k.lower() or "owner" in k.lower())]
                    due_date_list = [v for k, v in item.items() if isinstance(v, str) and ("deadline" in k.lower() or "target" in k.lower())]
                    
                    if action_list:
                        dynamic_actions.append({
                            "task": action_list[0],
                            "owner": owner_list[0] if owner_list else "Unassigned",
                            "due_date": due_date_list[0] if due_date_list else "N/A"
                        })

            # Check for Decision/Goal Lists (Goals, Objectives)
            elif is_goal_key(key) or "decide" in key.lower():
                for item in value:
                    # Generic extraction logic for goals/decisions
                    goal_text = item.get("Goal", item.get("Action", item.get("Title", None)))
                    strategies = item.get("Strategies", None)
                    if goal_text:
                        decision_summary = goal_text
                        if strategies and isinstance(strategies, list):
                            decision_summary += f" (Strategies: {', '.join(strategies)})"
                        dynamic_decisions.append(decision_summary)
        
        # If the value is a dictionary (like Action_Items in id: 12)
        elif isinstance(value, dict):
            if is_action_key(key) or "action_items" in key.lower():
                 for owner, task in value.items():
                    dynamic_actions.append({
                        "task": task,
                        "owner": owner,
                        "due_date": "N/A" # Cannot infer deadline from this format
                    })

    # 3. Populate target fields (only if they are currently empty)
    if not summary.get("action_items"):
        summary["action_items"] = dynamic_actions
        
    if not summary.get("key_decisions"):
        summary["key_decisions"] = dynamic_decisions
        
    if not summary.get("attendees_mentioned"):
        # Deduplicate and use the most comprehensive list of attendees
        summary["attendees_mentioned"] = list(set(dynamic_attendees + summary.get("attendees_mentioned", [])))


    # 4. Populate dependent fields (Follow-up Needed, Metadata)
    
    # Follow-up Needed: Populate from Action Items (using existing fuzzy logic)
    if not summary.get("follow_up_needed"):
        immediate_tasks, this_week_tasks, later_tasks = [], [], []
        for item in summary.get("action_items", []):
            task_desc = item.get("task", "")
            owner = item.get("owner", "")
            due_date = item.get("due_date", "").lower()
            
            task_string = f"{owner}: {task_desc}"
            if "immediate" in due_date or "q1" in due_date or "today" in due_date or "establish" in task_desc.lower():
                immediate_tasks.append(task_string)
            elif "friday" in due_date or "next week" in due_date or "wednesday" in due_date:
                this_week_tasks.append(task_string)
            else:
                later_tasks.append(task_string)
                
        summary["follow_up_needed"] = {
            "immediate": immediate_tasks, 
            "this_week": this_week_tasks, 
            "later": later_tasks
        }
    
    # 5. Fix metadata counts (based on newly populated lists)
    summary["metadata"] = {
        "action_items": len(summary.get("action_items", [])),
        "blockers": len(summary.get("blockers_and_risks", [])),
        "red_flags": len(summary.get("red_flags", [])),
        "key_decisions": len(summary.get("key_decisions", [])),
        "questions_raised": len(summary.get("questions_raised", [])),
    }

    return summary

# ---------------------- Meeting Classification ----------------------

def classify_meeting_type(transcript: str, model_name: str) -> str:
    """Classify meeting type using Ollama"""
    transcript_clean = clean_transcript(transcript)
    classification_prompt = f"""
Analyze this meeting transcript and classify it into ONE of these categories:
- standup: Daily standup/scrum meeting, status updates
- planning: Sprint planning, iteration planning, roadmap discussions
- retro: Retrospective, post-mortem, lessons learned
- client_call: Client meeting, customer call, demo, external stakeholder discussion
- general: Other meeting types, leadership meetings, strategy discussions

Transcript preview (first 1000 characters):
{transcript_clean[:1000]}

Respond with ONLY ONE WORD - the category name.
"""
    try:
        client = ollama.Client(host="http://localhost:11434")
        response = client.generate(
            model=model_name,
            prompt=classification_prompt,
            stream=False,
            options={"temperature": 0.1, "num_predict": 20}
        )
        raw = response.get("response", "").strip().lower()
        for valid in ["standup", "planning", "retro", "client_call", "general"]:
            if valid in raw:
                return valid
        return "general"
    except Exception as e:
        print(f"Classification error: {e}")
        return "general"


# ---------------------- Core Summary Functions ----------------------

def generate_summary(model_name: str, transcript: str, meeting_type: str = "general") -> dict:
    """Generate meeting summary"""
    meeting_contexts = {
        "standup": "DAILY STANDUP: Focus on accomplishments, plans, blockers, and velocity.",
        "planning": "SPRINT PLANNING: Focus on commitments, estimates, dependencies, and goals.",
        "retro": "RETROSPECTIVE: Focus on what went well, improvements, action items, morale.",
        "client_call": "CLIENT CALL: Focus on requirements, feedback, timelines, and next steps.",
        "general": "GENERAL MEETING: Extract all key discussion points and outcomes."
    }
    context = meeting_contexts.get(meeting_type, meeting_contexts["general"])
    prompt = f"""
You are an expert AI assistant. Create a comprehensive meeting summary in structured JSON.
{context}

Transcript:
{transcript}

Return ONLY valid JSON starting with {{ and ending with }}.
"""
    try:
        client = ollama.Client(host="http://localhost:11434")
        response = client.generate(
            model=model_name,
            prompt=prompt,
            stream=False,
            options={"temperature": 0.3, "num_predict": 8192, "top_p": 0.9}
        )
        parsed = safe_json_parse(response.get("response", ""))
        normalized = normalize_summary_fields(parsed)
        return _validate_and_fill_defaults(normalized, meeting_type)
    except Exception as e:
        return _create_fallback_summary(transcript, meeting_type, str(e))


def _validate_and_fill_defaults(data: Dict[str, Any], meeting_type: str) -> Dict[str, Any]:
    """Ensure schema completeness"""
    defaults = {
        "meeting_type": meeting_type,
        "meeting_date": datetime.now().strftime('%Y-%m-%d'),
        "executive_summary": data.get("executive_summary", "Meeting summary generated"),
        "key_decisions": data.get("key_decisions", []),
        "action_items": data.get("action_items", []),
        "discussion_points": data.get("discussion_points", []),
        "blockers_and_risks": data.get("blockers_and_risks", []),
        "new_requirements": data.get("new_requirements", []),
        "questions_raised": data.get("questions_raised", []),
        "metrics_mentioned": data.get("metrics_mentioned", {"velocity": None, "burndown": None, "completion_rate": None, "other": {}}),
        "next_steps": data.get("next_steps", []),
        "attendees_mentioned": data.get("attendees_mentioned", []),
        "follow_up_needed": data.get("follow_up_needed", {"immediate": [], "this_week": [], "later": []}),
        "context_for_absentees": data.get("context_for_absentees", "Full meeting context available in transcript"),
        "sentiment_analysis": data.get("sentiment_analysis", {"overall_mood": "Neutral", "concerns_level": "Medium", "team_confidence": "Moderate"}),
        "red_flags": data.get("red_flags", [])
    }
    for k, v in defaults.items():
        data.setdefault(k, v)
    return data


def _create_fallback_summary(transcript: str, meeting_type: str, error_msg: str) -> Dict[str, Any]:
    """Fallback summary when LLM fails"""
    words = transcript.split()
    attendees = list({w for w in words if w[0].isupper() and len(w) > 2})[:10]
    return {
        "meeting_type": meeting_type,
        "meeting_date": datetime.now().strftime('%Y-%m-%d'),
        "executive_summary": f"A {meeting_type} meeting was held. Transcript has ~{len(words)} words. Full analysis could not be completed automatically.",
        "key_decisions": [],
        "action_items": [{"task": "Review transcript for details", "owner": "Unassigned", "due_date": "Not specified", "priority": "High"}],
        "discussion_points": [{"topic": "Various topics discussed", "summary": "Manual review needed", "participants": attendees}],
        "attendees_mentioned": attendees,
        "follow_up_needed": {"immediate": ["Review meeting manually"], "this_week": [], "later": []},
        "sentiment_analysis": {"overall_mood": "Unknown", "concerns_level": "Unknown", "team_confidence": "Unknown"},
        "red_flags": [f"Automated analysis failed: {error_msg[:150]}"],
        "error_details": {"error": "LLM processing error", "message": error_msg[:200]}
    }


# ---------------------- Large Transcript Handling ----------------------

def _combine_chunk_summaries(summaries: list, meeting_type: str) -> dict:
    combined = {
        "meeting_type": meeting_type,
        "meeting_date": datetime.now().strftime('%Y-%m-%d'),
        "executive_summary": " ".join([s.get("executive_summary", "") for s in summaries]),
        "key_decisions": [],
        "action_items": [],
        "discussion_points": [],
        "blockers_and_risks": [],
        "new_requirements": [],
        "questions_raised": [],
        "metrics_mentioned": {"velocity": None, "burndown": None, "completion_rate": None, "other": {}},
        "next_steps": [],
        "attendees_mentioned": [],
        "follow_up_needed": {"immediate": [], "this_week": [], "later": []},
        "sentiment_analysis": {"overall_mood": "Mixed", "concerns_level": "Medium", "team_confidence": "Moderate"},
        "red_flags": []
    }

    for s in summaries:
        combined["action_items"].extend(s.get("action_items", []))
        combined["key_decisions"].extend(s.get("key_decisions", []))
        combined["blockers_and_risks"].extend(s.get("blockers_and_risks", []))
        combined["discussion_points"].extend(s.get("discussion_points", []))
        combined["questions_raised"].extend(s.get("questions_raised", []))
        combined["new_requirements"].extend(s.get("new_requirements", []))
        combined["next_steps"].extend(s.get("next_steps", []))
        combined["red_flags"].extend(s.get("red_flags", []))
        combined["attendees_mentioned"].extend(s.get("attendees_mentioned", []))

    combined["discussion_points"] = _deduplicate_list_by_key(combined["discussion_points"], key_func=lambda x: x.get("topic", ""))
    combined["questions_raised"] = _deduplicate_list_by_key(combined["questions_raised"], key_func=lambda x: x.get("question", ""))
    combined["attendees_mentioned"] = list(set(combined["attendees_mentioned"]))

    return combined


def generate_summary_for_large_transcript(model_name: str, transcript: str, meeting_type: str = "general") -> dict:
    """Handle long transcripts intelligently with chunking and merging"""
    total_tokens = len(ENCODER.encode(transcript))
    if total_tokens < 6000:
        return generate_summary(model_name, transcript, meeting_type)

    print(f"⚙️ Large transcript detected ({total_tokens} tokens). Processing in chunks...")

    transcript_clean = clean_transcript(transcript)
    chunks = chunk_transcript_by_tokens(transcript_clean, max_tokens=6000, overlap_tokens=200)

    chunk_summaries = [generate_summary(model_name, chunk, meeting_type) for chunk in chunks]
    combined = _combine_chunk_summaries(chunk_summaries, meeting_type)

    # Optional refinement pass for executive summary
    executive_text = " ".join([s.get("executive_summary", "") for s in chunk_summaries])
    refined = generate_summary(model_name, executive_text, meeting_type)
    combined["executive_summary"] = refined.get("executive_summary", combined["executive_summary"])

    return normalize_summary_fields(combined)
