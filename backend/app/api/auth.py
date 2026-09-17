import uuid
import secrets
import hashlib
import base64
import json
import time
from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.sql_models import User
from backend.app.schemas.pydantic_schemas import (
    UserCreateSchema, UserLoginSchema, UserResponseSchema, AuthResponseSchema
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

def hash_password(password: str, salt: str = None) -> tuple:
    if salt is None:
        salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        bytes.fromhex(salt),
        100000
    )
    return key.hex(), salt

def verify_password(password: str, hashed: str, salt: str) -> bool:
    key, _ = hash_password(password, salt)
    return secrets.compare_digest(key, hashed)

def generate_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": int(time.time()) + 86400 * 7  # 7 days validity
    }
    dumped = json.dumps(payload).encode('utf-8')
    sig = hashlib.sha256(dumped + b"OA_SMART_SECRET_KEY_2026").hexdigest()[:16]
    raw = dumped + b"." + sig.encode('utf-8')
    return base64.urlsafe_b64encode(raw).decode('utf-8')

def parse_token(token: str) -> dict:
    try:
        raw = base64.urlsafe_b64decode(token.encode('utf-8'))
        dumped, sig = raw.rsplit(b".", 1)
        expected_sig = hashlib.sha256(dumped + b"OA_SMART_SECRET_KEY_2026").hexdigest()[:16].encode('utf-8')
        if not secrets.compare_digest(sig, expected_sig):
            return None
        payload = json.loads(dumped.decode('utf-8'))
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

def get_current_user(authorization: str = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing or invalid Authorization header")
    token = authorization.split(" ")[1]
    payload = parse_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session expired or invalid token")
    user = db.query(User).filter(User.id == payload.get("sub")).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.post("/signup", response_model=AuthResponseSchema)
def signup(payload: UserCreateSchema, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    if '@' not in email_clean or '.' not in email_clean.split('@')[-1]:
        raise HTTPException(status_code=400, detail="Please provide a valid email address")
    
    if len(payload.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")

    existing = db.query(User).filter(User.email == email_clean).first()
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    hashed, salt = hash_password(payload.password)
    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    
    # Full Name is explicitly optional!
    full_name_clean = payload.full_name.strip() if payload.full_name else None

    user = User(
        id=user_id,
        email=email_clean,
        hashed_password=hashed,
        salt=salt,
        full_name=full_name_clean,
        role="HEALTHCARE_WORKER"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = generate_token(user.id, user.email)
    return AuthResponseSchema(
        token=token,
        user=user,
        message="Account created successfully"
    )

@router.post("/login", response_model=AuthResponseSchema)
def login(payload: UserLoginSchema, db: Session = Depends(get_db)):
    email_clean = payload.email.strip().lower()
    user = db.query(User).filter(User.email == email_clean).first()

    if not user or not verify_password(payload.password, user.hashed_password, user.salt):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = generate_token(user.id, user.email)
    return AuthResponseSchema(
        token=token,
        user=user,
        message="Logged in successfully"
    )

@router.get("/me", response_model=UserResponseSchema)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/logout")
def logout():
    return {"status": "SUCCESS", "message": "Logged out successfully"}
