"""[Backend] Задание 2. Категории услуг.

API салона на FastAPI. Данные пока хранятся в списках в памяти —
как в лекции. После перезапуска сервера всё вернётся к исходному.

Задание 1. GET /categories
    Список всех категорий услуг с количеством услуг в каждой
    (servicesCount).

Задание 2. GET /categories/{category_id}
    Информация о конкретной категории. Если такой нет — 404
    "Category not found".

Запуск:
    pip install fastapi uvicorn
    uvicorn main:app --reload
Документация и проверка: http://127.0.0.1:8000/docs
"""

from fastapi import FastAPI, HTTPException

app = FastAPI(title="Салон красоты — API")

# ---------------------------------------------------------------------------
# Данные в памяти
# ---------------------------------------------------------------------------

categories = [
    {"id": 1, "name": "Стрижки и укладки"},
    {"id": 2, "name": "Маникюр и педикюр"},
    {"id": 3, "name": "Брови и ресницы"},
    {"id": 4, "name": "Спа-процедуры"},
]

# У каждой услуги есть category_id — по нему услуги группируются.
services = [
    {"id": 1, "title": "Стрижка женская", "price": 2500, "category_id": 1},
    {"id": 2, "title": "Стрижка мужская", "price": 1500, "category_id": 1},
    {"id": 3, "title": "Укладка", "price": 1800, "category_id": 1},
    {"id": 4, "title": "Окрашивание", "price": 4500, "category_id": 1},
    {"id": 5, "title": "Детская стрижка", "price": 1200, "category_id": 1},
    {"id": 6, "title": "Маникюр классический", "price": 1500, "category_id": 2},
    {"id": 7, "title": "Маникюр с покрытием", "price": 2200, "category_id": 2},
    {"id": 8, "title": "Педикюр", "price": 2500, "category_id": 2},
    {"id": 9, "title": "Наращивание ногтей", "price": 3500, "category_id": 2},
    {"id": 10, "title": "Снятие покрытия", "price": 500, "category_id": 2},
    {"id": 11, "title": "Коррекция бровей", "price": 800, "category_id": 3},
    {"id": 12, "title": "Окрашивание бровей", "price": 700, "category_id": 3},
    {"id": 13, "title": "Ламинирование ресниц", "price": 2500, "category_id": 3},
    {"id": 14, "title": "Наращивание ресниц", "price": 3200, "category_id": 3},
    {"id": 15, "title": "Массаж спины", "price": 3000, "category_id": 4},
    {"id": 16, "title": "Обёртывание", "price": 3500, "category_id": 4},
    {"id": 17, "title": "Пилинг тела", "price": 2800, "category_id": 4},
    {"id": 18, "title": "SPA-уход для лица", "price": 4000, "category_id": 4},
]

masters = [
    {"id": 1, "name": "Анна Смирнова"},
    {"id": 2, "name": "Екатерина Орлова"},
]

appointments = []


# ---------------------------------------------------------------------------
# Вспомогательные функции
# ---------------------------------------------------------------------------


def count_services(category_id: int) -> int:
    """Сколько услуг относится к категории."""
    return sum(1 for service in services if service["category_id"] == category_id)


def category_with_count(category: dict) -> dict:
    """Категория в формате ответа API: id, name, servicesCount."""
    return {
        "id": category["id"],
        "name": category["name"],
        "servicesCount": count_services(category["id"]),
    }


# ---------------------------------------------------------------------------
# Задание 1. Список категорий
# ---------------------------------------------------------------------------


@app.get("/categories")
def list_categories():
    return [category_with_count(category) for category in categories]


# ---------------------------------------------------------------------------
# Задание 2. Информация по категории
# ---------------------------------------------------------------------------


@app.get("/categories/{category_id}")
def get_category(category_id: int):
    for category in categories:
        if category["id"] == category_id:
            return category_with_count(category)
    raise HTTPException(404, detail="Category not found")


# ---------------------------------------------------------------------------
# Эндпоинты из лекции: услуги, мастера, записи
# ---------------------------------------------------------------------------


@app.get("/services")
def list_services(category_id: int | None = None):
    """Все услуги или только услуги одной категории (?category_id=1)."""
    if category_id is None:
        return services
    return [service for service in services if service["category_id"] == category_id]


@app.get("/services/{service_id}")
def get_service(service_id: int):
    for service in services:
        if service["id"] == service_id:
            return service
    raise HTTPException(404, detail="Service not found")


@app.get("/masters")
def list_masters():
    return masters


@app.get("/masters/{master_id}")
def get_master(master_id: int):
    for master in masters:
        if master["id"] == master_id:
            return master
    raise HTTPException(404, detail="Master not found")


@app.get("/appointments")
def list_appointments():
    return appointments


@app.post("/appointments", status_code=201)
def add_appointment(data: dict):
    required = ("client_name", "master_id", "service_id", "time")
    if any(field not in data for field in required):
        raise HTTPException(400, detail="Missing required fields")

    for field in ("master_id", "service_id"):
        if not isinstance(data[field], int) or isinstance(data[field], bool):
            raise HTTPException(400, detail=f"{field} must be an integer")

    # Проверяем, что мастер и услуга существуют (иначе — 404).
    get_master(data["master_id"])
    get_service(data["service_id"])

    appointment = {
        "id": len(appointments) + 1,
        "client_name": data["client_name"],
        "master_id": data["master_id"],
        "service_id": data["service_id"],
        "time": data["time"],
    }
    appointments.append(appointment)
    return appointment
