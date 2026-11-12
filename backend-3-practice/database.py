"""Подключение к базе SQLite и сессии SQLAlchemy."""

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session

# Файл базы появится рядом с приложением при первом запуске.
DATABASE_URL = "sqlite:///salon.db"

# check_same_thread=False — FastAPI может обслуживать запросы
# в разных потоках, а SQLite по умолчанию это запрещает.
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})


class Base(DeclarativeBase):
    """Базовый класс для всех моделей."""


def get_session():
    """Зависимость FastAPI: отдаёт сессию на время запроса и закрывает её."""
    with Session(engine) as session:
        yield session
