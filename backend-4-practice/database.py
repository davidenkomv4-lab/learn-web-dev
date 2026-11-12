"""Подключение к базе SQLite и сессии SQLAlchemy."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session

DATABASE_URL = "sqlite:///salon.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


class Base(DeclarativeBase):
    """Базовый класс для всех SQLAlchemy-моделей."""


def get_session():
    """Зависимость FastAPI: сессия на время одного запроса."""
    with Session(engine) as session:
        yield session
