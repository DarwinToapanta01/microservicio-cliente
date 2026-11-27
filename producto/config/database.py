import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine 
)
Base = declarative_base()

def obtener_db():
    db = SessionLocal()
    try:
        yield db
    except Exception as e:
        print("Ocurrió un error en la captura de datos:", e)
        db.rollback()
        raise
    finally:
        db.close()
