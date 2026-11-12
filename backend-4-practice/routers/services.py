"""Задание 2. Маршруты для услуг: GET /services, GET /services/{id}, POST /services."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from database import get_session
from models import Category, Service
from schemas import ServiceCreate, ServiceRead

router = APIRouter(prefix="/services", tags=["services"])


@router.get("", response_model=list[ServiceRead])
def list_services(session: Session = Depends(get_session)):
    return session.scalars(select(Service).order_by(Service.id)).all()


@router.get("/{service_id}", response_model=ServiceRead)
def get_service(service_id: int, session: Session = Depends(get_session)):
    service = session.get(Service, service_id)
    if service is None:
        raise HTTPException(404, detail="Service not found")
    return service


@router.post("", response_model=ServiceRead, status_code=201)
def create_service(data: ServiceCreate, session: Session = Depends(get_session)):
    """Создаёт услугу.

    Типы и ограничения полей проверяет Pydantic (ServiceCreate) ещё до
    вызова функции — при ошибке FastAPI сам вернёт 422.
    Здесь остаётся бизнес-правило: категория должна существовать.
    """
    if session.get(Category, data.categoryId) is None:
        raise HTTPException(404, detail="Category not found")

    service = Service(
        category_id=data.categoryId,
        title=data.title,
        desc=data.desc,
        duration=data.duration,
        price=data.price,
    )
    session.add(service)
    session.commit()
    session.refresh(service)  # получаем id, присвоенный базой
    return service
