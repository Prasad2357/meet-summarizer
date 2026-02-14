from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import DATABASE_URL

# For SQLite, we need check_same_thread=False
# For PostgreSQL, we need connection pooling settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # PostgreSQL with connection pooling
    # pool_pre_ping: Check if connection is alive before using it
    # pool_recycle: Recycle connections after 300 seconds (5 minutes)
    # pool_size: Number of connections to maintain
    # max_overflow: Max number of connections to create beyond pool_size
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,       # Test connections before using
        pool_recycle=300,         # Recycle connections every 5 minutes
        pool_size=5,              # Maintain 5 connections in the pool
        max_overflow=10,          # Allow up to 10 extra connections
        connect_args={
            "connect_timeout": 10  # Connection timeout in seconds
        }
    )

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

# Dependency for routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
