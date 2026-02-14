# Meet Summarizer: AI-Powered Meeting Analysis & Notifications

Meet Summarizer is a comprehensive, production-ready application designed to transform raw meeting audio or transcripts into structured, actionable insights. With support for both local LLMs and cloud-based AI like Google Gemini, it offers a hybrid approach to efficiency and privacy.

![Dashboard Preview](assets/dashboard_table.png)
![Dashboard Preview](assets/dashboard_cards.png)

## 🚀 Key Features

- **🔐 Secure Authentication**: Multi-method login with standard Email/Password and **Google OAuth 2.0** integration.
- **🧠 Hybrid AI Processing**: 
  - **Cloud:** High-speed, accurate processing using **Google Gemini 2.5 Flash** as the primary engine.
  - **Local & Fallback:** Private, offline processing using **Ollama** (Whisper for transcription, Llama3/Mistral for summarization), which also serves as a reliable **fallback** if cloud processing is disabled or unavailable.
- **📈 Comprehensive Dashboard**: A sleek, modern React frontend to manage all your meetings at a glance.
- **✉️ Automated Notifications**: Automatic email delivery of meeting summaries via **SMTP/Gmail**.
- **📄 PDF Export**: Professional PDF generation of meeting summaries, attached automatically to notification emails.
- **🗄️ Robust Database**: Managed **PostgreSQL** (Supabase) with connection pooling and stability checks.
- **🧪 API Documentation**: Fully documented interactive API endpoints using FastAPI's Swagger UI.

---

## 🛠️ Technologies Used

### Backend (FastAPI)
- **FastAPI**: Modern, high-performance web framework.
- **SQLAlchemy & Alembic**: Database ORM and versioned migrations.
- **PostgreSQL**: Enterprise-grade relational database.
- **Pydantic**: Type-safe data validation.
- **Google Generative AI**: Access to Gemini LLMs.
- **Ollama**: Local LLM management and serving.

### Frontend (React)
- **React & TypeScript**: Type-safe UI development.
- **Tailwind CSS**: Modern styling with utility classes.
- **Zustand**: Lightweight, efficient state management.
- **Lucide React**: Clean, modern iconography.
- **Google Identity Services**: Seamless "Sign-In with Google" integration.

---

## ⚙️ Installation & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Ollama (optional, for local processing)

### 2. Backend Setup
```bash
# Clone the repository
git clone <repository-url>
cd meet-summarizer

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate   # Windows
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file in the root directory and `frontend/.env` for the UI.

### Root `.env` (Backend)
```env
# AI Configuration
GEMINI_API_KEY=your_gemini_key
USE_GEMINI=true
GEMINI_MODEL=gemini-1.5-flash

# Database
DATABASE_URL=postgresql://user:pass@host:port/dbname

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Configuration (SMTP)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SENDER_EMAIL=your-email@gmail.com
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🏃 Usage

### Start the Backend
```bash
uvicorn app.main:app --reload --port 8000
```

### Start the Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.
Interactive API docs can be found at `http://localhost:8000/docs`.

---

## 📂 Project Structure

```text
MEET_SUMMARIZER/
├── app/
│   ├── routes/         # API Endpoints (OAuth, Email, Records, etc.)
│   ├── services/       # Core Logic (LLM, PDF Gen, Processing)
│   ├── models.py       # SQLAlchemy Models
│   ├── schemas.py      # Pydantic Schemas
│   └── database.py     # Database Connection
├── frontend/
│   ├── src/
│   │   ├── components/ # UI Components (Auth, Dashboard, etc.)
│   │   ├── state/      # Global State (Zustand)
│   │   └── lib/        # API Client & Utils
├── alembic/            # Database Migrations
└── requirements.txt    # Python Dependencies
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.