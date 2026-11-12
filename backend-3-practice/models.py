"""Задание 1. SQLAlchemy-модель Master и таблица masters."""

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from database import Base


class Master(Base):
    __tablename__ = "masters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    specialization: Mapped[str] = mapped_column(String(100), index=True)

    def to_dict(self) -> dict:
        """Мастер в формате ответа API."""
        return {"id": self.id, "name": self.name, "specialization": self.specialization}

    def __repr__(self) -> str:
        return f"Master(id={self.id}, name={self.name!r}, specialization={self.specialization!r})"
