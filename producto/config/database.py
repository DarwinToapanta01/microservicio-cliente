from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

engine = create_engine("sqlite:///./db_producto.db")

sessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine 
)
Base = declarative_base()

def obtener_db():
    db = sessionLocal()
    try:
        yield db
    except Exception as e:
        print("Ocurrió un error en la captura de datos:", e)
        db.rollback()
        raise
    finally:
        db.close()
