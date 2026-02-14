from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import os
import json
from dotenv import load_dotenv

from app.database import get_db
from app.models import User, MeetingRecord
from app.dependencies.auth import get_current_user
from app.services.file_utils import generate_summary_pdf

load_dotenv()

router = APIRouter()

# Email configuration from environment variables
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SENDER_EMAIL = os.getenv("SENDER_EMAIL", SMTP_USERNAME)

class EmailRequest(BaseModel):
    recipient_email: EmailStr
    subject: str
    body: str

def send_email_notification(recipient_email: str, subject: str, body: str, pdf_attachment: bytes = None, pdf_filename: str = "meeting_summary.pdf"):
    """Send email notification with optional PDF attachment"""
    try:
        # Create message
        message = MIMEMultipart("mixed")
        message["Subject"] = subject
        message["From"] = SENDER_EMAIL
        message["To"] = recipient_email
        
        # Create HTML and plain text versions
        html_body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                {body}
            </body>
        </html>
        """
        
        # Create the email body
        email_body = MIMEMultipart("alternative")
        text_part = MIMEText(body, "plain")
        html_part = MIMEText(html_body, "html")
        email_body.attach(text_part)
        email_body.attach(html_part)
        message.attach(email_body)
        
        # Attach PDF if provided
        if pdf_attachment:
            pdf_part = MIMEApplication(pdf_attachment, _subtype="pdf")
            pdf_part.add_header('Content-Disposition', 'attachment', filename=pdf_filename)
            message.attach(pdf_part)
        
        # Send email
        with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
            server.starttls()
            if SMTP_USERNAME and SMTP_PASSWORD:
                server.login(SMTP_USERNAME, SMTP_PASSWORD)
            server.sendmail(SENDER_EMAIL, recipient_email, message.as_string())
        
        print(f"✅ Email sent to {recipient_email}")
        return True
    except Exception as e:
        print(f"❌ Failed to send email to {recipient_email}: {str(e)}")
        return False

def send_meeting_processed_email(user_email: str, user_name: str, meeting_title: str, meeting_id: int, summary_data: dict = None):
    """Send notification when meeting is processed, with PDF attachment"""
    subject = f"✅ Meeting Summary Ready: {meeting_title}"
    
    # Generate PDF if summary data is provided
    pdf_bytes = None
    if summary_data:
        try:
            pdf_bytes = generate_summary_pdf(summary_data)
        except Exception as e:
            print(f"⚠️ Failed to generate PDF: {str(e)}")
    
    body = f"""
    <h2>Hi {user_name},</h2>
    
    <p>Great news! Your meeting summary is ready.</p>
    
    <h3>Meeting: {meeting_title}</h3>
    
    <p>Your meeting has been successfully processed and summarized. {"The summary PDF is attached to this email." if pdf_bytes else "You can view the full summary in your dashboard."}</p>
    
    <p style="margin-top: 30px; color: #666; font-size: 14px;">
        Best regards,<br>
        Meet Summarizer Team
    </p>
    """
    
    send_email_notification(
        user_email, 
        subject, 
        body, 
        pdf_attachment=pdf_bytes,
        pdf_filename=f"meeting_summary_{meeting_id}.pdf"
    )


@router.post("/notify-meeting-completion/{meeting_id}")
async def notify_meeting_completion(
    meeting_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Send email notification when meeting processing is complete"""
    
    # Get meeting
    meeting = db.query(MeetingRecord).filter(
        MeetingRecord.id == meeting_id,
        MeetingRecord.user_id == current_user.id
    ).first()
    
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    
    # Parse summary data
    summary_data = None
    if meeting.summary_json:
        try:
            summary_data = json.loads(meeting.summary_json)
        except:
            pass
    
    # Queue email sending in background
    background_tasks.add_task(
        send_meeting_processed_email,
        current_user.email,
        current_user.name,
        meeting.file_name,
        meeting.id,
        summary_data
    )
    
    return {"message": f"Email notification with PDF attachment queued for {current_user.email}"}
