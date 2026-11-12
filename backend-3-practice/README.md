# [Backend] Задание 3. Мастера в базе данных

Хранение мастеров перенесено из Python-списка в базу SQLite.
Работа с базой — через SQLAlchemy 2.0.

## Файлы

| Файл | Что внутри |
|---|---|
| [`database.py`](database.py) | Подключение к SQLite, базовый класс моделей, сессия для запросов |
| [`models.py`](models.py) | **Задание 1.** Модель `Master` → таблица `masters` (`id`, `name`, `specialization`) |
| [`main.py`](main.py) | **Задание 2.** API на FastAPI; при старте создаёт таблицу и заполняет её, если она пустая |

## API

| Метод | URL | Ответ |
|---|---|---|
| GET | `/masters` | Все мастера из БД |
| GET | `/masters?specialization=Парикмахер` | Только мастера этой специализации |
| GET | `/masters/{master_id}` | Один мастер; если нет — `404 Master not found` |

## Как запустить

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Файл базы `salon.db` создастся автоматически. Проверить можно
в Swagger UI: `http://127.0.0.1:8000/docs`.

Пример:

```
GET /masters/1  →  200 { "id": 1, "name": "Анна", "specialization": "Парикмахер" }
GET /masters?specialization=Парикмахер
→ 200 [
    { "id": 1, "name": "Анна",  "specialization": "Парикмахер" },
    { "id": 4, "name": "Ольга", "specialization": "Парикмахер" }
  ]
GET /masters/99 →  404 { "detail": "Master not found" }
```
