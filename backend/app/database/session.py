import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Determine absolute path to the project root and canonical SQLite database file
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
DEFAULT_DB_PATH = os.path.join(BASE_DIR, "oa_smart.db")

# Allow override via environment variable, otherwise use canonical absolute path
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    norm_path = DEFAULT_DB_PATH.replace(os.sep, "/")
    DATABASE_URL = f"sqlite:///{norm_path}"

print(f"[OA-SMART DB] Initialized database engine connected to: {DATABASE_URL}")

# SQLite specific connect_args
connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
