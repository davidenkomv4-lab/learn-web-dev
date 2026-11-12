"""[Backend] Задание 1. Запись клиентов в салон.

Задание 1. Класс Appointment (запись клиента)
    Раньше create_appointment возвращала обычный словарь.
    Теперь она возвращает объект класса Appointment.
    Запись создаётся, только если заполнены все поля.

Задание 2. Новое бизнес-правило
    Записаться к мастеру можно только в часы работы салона:
    с 08:00 до 20:00.

Запуск:  python main.py
"""

from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Справочники: мастера и услуги
# ---------------------------------------------------------------------------


@dataclass
class Master:
    master_id: int
    name: str


@dataclass
class Service:
    service_id: int
    title: str
    price: int


masters: list[Master] = [
    Master(1, "Анна Смирнова"),
    Master(2, "Екатерина Орлова"),
]

services: list[Service] = [
    Service(1, "Стрижка женская", 2500),
    Service(2, "Маникюр", 1800),
]


def get_master(master_id: int) -> Master | None:
    """Возвращает мастера по id или None, если такого нет."""
    for master in masters:
        if master.master_id == master_id:
            return master
    return None


def get_service(service_id: int) -> Service | None:
    """Возвращает услугу по id или None, если такой нет."""
    for service in services:
        if service.service_id == service_id:
            return service
    return None


# ---------------------------------------------------------------------------
# Задание 1. Класс записи клиента
# ---------------------------------------------------------------------------


class Appointment:
    """Запись клиента к мастеру на услугу в определённое время."""

    def __init__(
        self,
        appointment_id: int,
        client_name: str,
        master_id: int,
        service_id: int,
        time: str,
    ) -> None:
        self.id = appointment_id
        self.client_name = client_name
        self.master_id = master_id
        self.service_id = service_id
        self.time = time

    def __repr__(self) -> str:
        return (
            f"Appointment(id={self.id}, client_name={self.client_name!r}, "
            f"master_id={self.master_id}, service_id={self.service_id}, "
            f"time={self.time!r})"
        )


appointments: list[Appointment] = []


# ---------------------------------------------------------------------------
# Задание 2. Часы работы салона
# ---------------------------------------------------------------------------

OPENING_TIME = "08:00"
CLOSING_TIME = "20:00"


def parse_time(time: str) -> int | None:
    """Переводит строку "ЧЧ:ММ" в минуты от начала суток.

    Возвращает None, если строка не похожа на время.
    """
    parts = time.split(":")
    if len(parts) != 2 or not all(part.isdigit() for part in parts):
        return None

    hours, minutes = int(parts[0]), int(parts[1])
    if not (0 <= hours <= 23 and 0 <= minutes <= 59):
        return None
    return hours * 60 + minutes


def is_working_time(time: str) -> bool:
    """Можно ли записаться на это время: с 08:00 до 20:00.

    20:00 — время закрытия, поэтому на 20:00 записаться уже нельзя.
    """
    minutes = parse_time(time)
    if minutes is None:
        return False
    return parse_time(OPENING_TIME) <= minutes < parse_time(CLOSING_TIME)


# ---------------------------------------------------------------------------
# Создание записи
# ---------------------------------------------------------------------------


def create_appointment(
    client_name: str,
    master_id: int,
    service_id: int,
    time: str,
) -> Appointment | None:
    """Создаёт запись и добавляет её в список appointments.

    Возвращает None (и ничего не добавляет), если:
      - не заполнено хотя бы одно поле;
      - нет такого мастера или такой услуги;
      - время вне часов работы салона.
    """
    # Задание 1: все поля должны быть заполнены.
    # strip() — чтобы строка из одних пробелов тоже считалась пустой.
    if not client_name or not client_name.strip():
        return None
    if not master_id or not service_id or not time:
        return None

    master = get_master(master_id)
    service = get_service(service_id)
    if master is None or service is None:
        return None

    # Задание 2: записываем только в часы работы салона.
    if not is_working_time(time):
        return None

    appointment = Appointment(
        appointment_id=len(appointments) + 1,
        client_name=client_name.strip(),
        master_id=master.master_id,
        service_id=service.service_id,
        time=time,
    )
    appointments.append(appointment)
    return appointment


# ---------------------------------------------------------------------------
# Проверка — сценарии из задания
# ---------------------------------------------------------------------------


def print_appointments() -> None:
    print("Список записей:")
    for appointment in appointments:
        print(appointment.client_name, appointment.time)


if __name__ == "__main__":
    print("=== Задание 1. Две корректные записи ===")
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")
    print_appointments()

    print()
    print("=== Задание 1. Запись с незаполненным полем ===")
    appointments.clear()
    no_correct_appointment = create_appointment("", 1, 1, "12:00")
    print(len(appointments))

    print()
    print("=== Задание 2. Две записи в часы работы ===")
    appointments.clear()
    first_appointment = create_appointment("Иванова А.А.", 1, 1, "10:00")
    second_appointment = create_appointment("Петрова А.А.", 1, 1, "11:00")
    print_appointments()

    print()
    print("=== Задание 2. Запись на 00:00 (салон закрыт) ===")
    appointments.clear()
    no_correct_appointment = create_appointment("Сидорова А.А.", 1, 1, "00:00")
    print(len(appointments))
