# [Backend] Задание 2. Категории услуг

API салона на FastAPI — [`main.py`](main.py). Данные хранятся в памяти.

## Новые эндпоинты

| Метод | URL | Что возвращает |
|---|---|---|
| GET | `/categories` | Список категорий с количеством услуг (`servicesCount`) |
| GET | `/categories/{category_id}` | Одна категория; если нет — `404 Category not found` |

Количество услуг считается по полю `category_id` у каждой услуги.

Также есть эндпоинты из лекции: `/services`, `/services/{id}`,
`/masters`, `/masters/{id}`, `GET/POST /appointments`.

## Как запустить

```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

Проверка в браузере или в Swagger UI (`http://127.0.0.1:8000/docs`):

```
GET /categories      → 200
[
  { "id": 1, "name": "Стрижки и укладки", "servicesCount": 5 },
  { "id": 2, "name": "Маникюр и педикюр", "servicesCount": 5 },
  { "id": 3, "name": "Брови и ресницы", "servicesCount": 4 },
  { "id": 4, "name": "Спа-процедуры", "servicesCount": 4 }
]

GET /categories/1    → 200 { "id": 1, "name": "Стрижки и укладки", "servicesCount": 5 }
GET /categories/99   → 404 { "detail": "Category not found" }
```
