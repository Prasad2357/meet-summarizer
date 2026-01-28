from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserResponse, UserLogin
from app.utils.security import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/", response_model=UserResponse)
def create_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user = User(
        name=payload.name,
        email=payload.email,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/signup")
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "User already exists")

    user = User(
        name=payload.name,
        email=payload.email,
        password_hash=hash_password(payload.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.name
    })

    return {"access_token": token, "token_type": "bearer"}

@router.post("/login")
def login(payload: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user.id),
        "email": user.email,
        "name": user.name
    })

    return {"access_token": token, "token_type": "bearer"}

@router.get("/", response_model=List[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@router.get("/{user_id}/meetings")
def get_user_meetings(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(404, "User not found")

    return user.meetings


