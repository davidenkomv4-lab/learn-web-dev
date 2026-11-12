// Данные слотов. Сервера пока нет — захардкожено, как в задании 2.
import { compareDates } from "../utils/date.js";

// Расписание салона: время приёма.
const SLOT_TIMES = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00",
];

// Занятые слоты на конкретные дни месяца (ключ — число месяца).
const BUSY_BY_DAY = {
  1: ["10:00", "14:00"],
  3: ["11:00", "13:00", "16:00"],
  5: ["12:00"],
  8: ["10:00", "11:00", "12:00"],
  10: ["15:00", "17:00"],
  12: ["11:00", "13:00"],
  14: ["10:00", "16:00"],
  15: ["12:00", "14:00", "15:00"],
  17: ["13:00"],
  19: ["10:00", "11:00"],
  21: ["16:00", "17:00"],
  22: ["12:00"],
  24: ["10:00", "13:00", "14:00"],
  26: ["11:00", "15:00"],
  28: ["12:00", "17:00"],
  30: ["10:00", "16:00"],
};

// По воскресеньям салон не работает (0 = воскресенье в getDay()).
const DAY_OFF = 0;

// Возвращает слоты для даты в формате { time: "10:00", available: true }.
export function getSlotsForDate(date, today) {
  const weekDay = new Date(date.year, date.month, date.day).getDay();
  if (weekDay === DAY_OFF) {
    return [];
  }

  const busy = BUSY_BY_DAY[date.day] || [];
  const isToday = compareDates(date, today) === 0;
  const currentHour = new Date().getHours();

  return SLOT_TIMES.map((time) => {
    // Сегодня нельзя записаться на время, которое уже прошло.
    const alreadyPassed = isToday && parseInt(time) <= currentHour;
    return {
      time,
      available: !busy.includes(time) && !alreadyPassed,
    };
  });
}
