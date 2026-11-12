"""[Backend] Задание 3. Мастера в базе данных SQLite.

Хранение мастеров перенесено из Python-списка в таблицу masters
базы SQLite. Работа с базой — через SQLAlchemy.

Задание 1. Модель Master (id, name, specialization) — в models.py.
Задание 2. API:
    GET /masters                              — все мастера из БД;
    GET /masters?specialization=Парикмахер    — мастера одной специализации;
    GET /masters/{master_id}                  — один мастер, 404 если нет.

Запуск:
    pip install -r requirements.txt
    uvicorn main:app --reload
Документация и проверка: http://127.0.0.1:8000/docs
"""

from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from database import Base, engine, get_session
from models import Master

# Начальные данные: попадут в таблицу, только если она пустая.
INITIAL_MASTERS = [
    {"name": "Анна", "specialization": "Парикмахер"},
    {"name": "Мария", "specialization": "Визажист"},
    {"name": "Екатерина", "specialization": "Мастер маникюра"},
    {"name": "Ольга", "specialization": "Парикмахер"},
]


def init_db() -> None:
    """Создаёт таблицы и заполняет masters, если в ней ещё нет данных."""
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        count = session.scalar(select(func.count()).select_from(Master))
        if count == 0:
            session.add_all(Master(**data) for data in INITIAL_MASTERS)
            session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Выполняется один раз при старте сервера.
    init_db()
    yield


app = FastAPI(title="Салон красоты — мастера", lifespan=lifespan)


@app.get("/masters")
def list_masters(
    specialization: str | None = None,
    session: Session = Depends(get_session),
):
    """Все мастера или только мастера указанной специализации."""
    query = select(Master).order_by(Master.id)
    if specialization is not None:
        query = query.where(Master.specialization == specialization)

    masters = session.scalars(query).all()
    return [master.to_dict() for master in masters]


@app.get("/masters/{master_id}")
def get_master(master_id: int, session: Session = Depends(get_session)):
    """Один мастер по id. Если не найден — 404."""
    master = session.get(Master, master_id)
    if master is None:
        raise HTTPException(404, detail="Master not found")
    return master.to_dict()
