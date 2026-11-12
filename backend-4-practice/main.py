"""[Backend] Задание 4. Pydantic-модели услуг.

Задание 1. Pydantic-модель ServiceCreate — в schemas.py.
Задание 2. POST /services с этой моделью — в routers/services.py.

Запуск:
    pip install -r requirements.txt
    uvicorn main:app --reload
Документация и проверка: http://127.0.0.1:8000/docs
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import Base, engine
from models import Category, Service
from routers import services

INITIAL_CATEGORIES = [
    "Стрижки и укладки",
    "Маникюр и педикюр",
    "Брови и ресницы",
    "Спа-процедуры",
]

INITIAL_SERVICES = [
    {"category_id": 1, "title": "Стрижка женская", "desc": "Стрижка и укладка", "duration": 60, "price": 2500},
    {"category_id": 2, "title": "Маникюр с покрытием", "desc": "Покрытие гель-лаком", "duration": 90, "price": 2200},
    {"category_id": 3, "title": "Коррекция бровей", "desc": "Форма и окрашивание", "duration": 30, "price": 800},
    {"category_id": 4, "title": "Массаж спины", "desc": "Классический массаж", "duration": 60, "price": 3000},
]


def init_db() -> None:
    """Создаёт таблицы и заполняет их, если база пустая."""
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        if session.scalar(select(func.count()).select_from(Category)) == 0:
            session.add_all(Category(name=name) for name in INITIAL_CATEGORIES)
            session.flush()
            session.add_all(Service(**data) for data in INITIAL_SERVICES)
            session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="Салон красоты — услуги", lifespan=lifespan)
app.include_router(services.router)
