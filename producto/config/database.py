from sqlalchemy import create_engine
from sqlalchemy import sessionmaker, declarative_base

engine = create_engine("sqlite:///./db_producto.db")