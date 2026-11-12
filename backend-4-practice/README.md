# [Backend] Задание 4. Pydantic-модели услуг

FastAPI + SQLAlchemy (SQLite) + Pydantic. Приложение разделено на модули.

## Файлы

| Файл | Что внутри |
|---|---|
| [`schemas.py`](schemas.py) | **Задание 1.** Pydantic-модель `ServiceCreate` (и `ServiceRead` для ответа) |
| [`routers/services.py`](routers/services.py) | **Задание 2.** `POST /services`, а также `GET /services` и `GET /services/{id}` |
| [`models.py`](models.py) | SQLAlchemy-модели `Category` и `Service` |
| [`database.py`](database.py) | Подключение к SQLite и сессия |
| [`main.py`](main.py) | Приложение: подключает роутер, при старте создаёт и заполняет базу |

## Ограничения `ServiceCreate`

| Поле | Тип | Ограничение |
|---|---|---|
| `categoryId` | int | > 0; категория должна существовать (иначе `404`) |
| `title` | str | не пустое (пробелы не считаются), до 100 символов |
| `desc` | str | не пустое, до 100 символов |
| `duration` | int | от 30 до 180 минут |
| `price` | float | больше 0 |

В базу попадают только корректные услуги: при нарушении любого
правила FastAPI возвращает `422` и ничего не сохраняет.

## Как запустить

```bash
pip install -r requirements.txt
uvicorn main:app --reload
```

Swagger UI: `http://127.0.0.1:8000/docs`.

## Проверка из задания

| Тело запроса `POST /services` | Ответ |
|---|---|
| `{"categoryId": 3, "title": "Наращивание ресниц", "desc": "Огромные ресницы уже через 30 минут", "duration": 30, "price": 1500.00}` | `201` — услуга создана |
| то же, но `"price": "бесплатно"` | `422` — ошибка валидации |
| `"desc": "", "duration": 0, "price": -1500.00` | `422` — ошибка валидации |
