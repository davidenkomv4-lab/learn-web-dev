// Чистые функции для работы с датами.
// Перенесены из задания 3. «Сегодня» теперь приходит с сервера,
// поэтому функции getToday() здесь больше нет.
// Остальные функции те же —
// они не зависят ни от DOM, ни от React.
//
// Дата везде хранится как объект { day, month, year },
// месяц 0-индексный (0 = январь), как в new Date().

export const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

export const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

export const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

export const WEEKDAYS_SHORT = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

// Строит сетку календаря: массив недель по 7 ячеек.
export function buildCalendarGrid(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();
  const offset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const cells = [];

  for (let i = offset - 1; i >= 0; i--) {
    cells.push({ day: prevMonthLastDay - i, otherMonth: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, otherMonth: false });
  }
  const totalCells = Math.ceil(cells.length / 7) * 7;
  let nextDay = 1;
  while (cells.length < totalCells) {
    cells.push({ day: nextDay, otherMonth: true });
    nextDay++;
  }

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }
  return weeks;
}

// Сравнивает две даты: -1 если a раньше b, 1 если позже, 0 если равны.
export function compareDates(a, b) {
  const d1 = new Date(a.year, a.month, a.day);
  const d2 = new Date(b.year, b.month, b.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Можно ли выбрать дату: не раньше сегодняшнего дня.
export function isDateSelectable(date, today) {
  return compareDates(date, today) >= 0;
}

// «Пятница, 17 октября 2026»
export function formatDate(date) {
  const weekDay = new Date(date.year, date.month, date.day).getDay();
  return `${DAYS_OF_WEEK[weekDay]}, ${date.day} ${MONTHS_GENITIVE[date.month]} ${date.year}`;
}

// Сдвигает месяц на delta (+1 или -1) с переходом через год.
export function shiftMonth(year, month, delta) {
  let newMonth = month + delta;
  let newYear = year;
  if (newMonth > 11) {
    newMonth = 0;
    newYear++;
  } else if (newMonth < 0) {
    newMonth = 11;
    newYear--;
  }
  return { year: newYear, month: newMonth };
}
