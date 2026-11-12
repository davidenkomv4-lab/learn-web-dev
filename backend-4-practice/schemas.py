"""Pydantic-модели — контракт API (что приходит и что уходит).

Задание 1. ServiceCreate — данные для создания услуги.
"""

from pydantic import BaseModel, ConfigDict, Field


class ServiceCreate(BaseModel):
    """Тело запроса POST /services.

    Ограничения:
      - title и desc не пустые, не длиннее 100 символов;
      - duration — от 30 минут до 3 часов (180 минут);
      - price — строго больше 0.
    """

    # Убираем пробелы по краям строк, чтобы "   " тоже считалось пустой строкой.
    model_config = ConfigDict(str_strip_whitespace=True)

    categoryId: int = Field(gt=0, description="Идентификатор категории услуги")
    title: str = Field(min_length=1, max_length=100, description="Название услуги")
    desc: str = Field(min_length=1, max_length=100, description="Описание услуги")
    duration: int = Field(ge=30, le=180, description="Продолжительность, минут")
    price: float = Field(gt=0, description="Стоимость, ₽")


class ServiceRead(BaseModel):
    """Услуга в ответе API."""

    # from_attributes — можно собрать модель прямо из SQLAlchemy-объекта.
    model_config = ConfigDict(from_attributes=True)

    id: int
    categoryId: int = Field(validation_alias="category_id")
    title: str
    desc: str
    duration: int
    price: float
