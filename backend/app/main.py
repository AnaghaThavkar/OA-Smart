import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Ensure parent monorepo directories are on sys.path for ML module imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from backend.app.database.session import Base, engine
from backend.app.api import patients, screenings, sync, dashboard, reports, auth, chat

# Initialize SQL Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="OA-SMART Backend API",
    description="Portable AI-Assisted Osteoarthritis (OA) Risk Screening Backend",
    version="1.0.0"
)

# Configure CORS for PWA frontend communication
origins = os.getenv("CORS_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(patients.router, prefix="/api")
app.include_router(screenings.router, prefix="/api")
app.include_router(sync.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(reports.router, prefix="/api")

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "OA-SMART Backend API",
        "version": "2.0.0",
        "system": "Portable AI-Assisted Osteoarthritis Screening System",
        "docs": "/docs"
    }
