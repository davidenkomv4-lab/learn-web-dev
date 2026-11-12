// JavaScript для страницы выбора даты и времени (задание 2).
//
// Что работает:
//   1. При открытии страницы выбран сегодняшний день и показаны его слоты.
//   2. Клик по дню выбирает его, обновляет слоты и сбрасывает время.
//   3. Клик по слоту выбирает время, и оно попадает в нижнюю панель.
//   4. Стрелки «‹» и «›» листают месяцы (с переходом через год).
//   5. Дни раньше «сегодня» приглушены и не кликаются.
//   6. Нижняя панель обновляется при выборе дня и времени.
//
// Дата везде хранится как объект { day, month, year },
// месяц 0-индексный (0 = январь), как в new Date().

// =====================================================================
// 1. ДАННЫЕ
// =====================================================================

// Расписание салона: время приёма. Сервера пока нет — захардкожено.
const SLOT_TIMES = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

// Занятые слоты на конкретные дни месяца (ключ — число месяца).
// Нужны, чтобы у разных дней были разные слоты.
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

// По воскресеньям салон не работает.
const DAY_OFF = 0; // 0 = воскресенье в new Date().getDay()

const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const DAYS_OF_WEEK = [
  "Воскресенье", "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота",
];

// «Сегодня» берём из системной даты.
const now = new Date();
const today = {
  day: now.getDate(),
  month: now.getMonth(),
  year: now.getFullYear(),
};

// =====================================================================
// 2. СОСТОЯНИЕ
// =====================================================================

const state = {
  viewYear: today.year, // какой месяц сейчас показан в календаре
  viewMonth: today.month,
  selectedDate: { ...today }, // выбранный день (по умолчанию — сегодня)
  selectedTime: null, // выбранное время, например "12:00"
  slots: [], // слоты выбранного дня
};

// =====================================================================
// 3. ЧИСТЫЕ ФУНКЦИИ (не трогают DOM)
// =====================================================================

// Строит сетку календаря: массив недель по 7 ячеек.
function buildCalendarGrid(year, month) {
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
function compareDates(a, b) {
  const d1 = new Date(a.year, a.month, a.day);
  const d2 = new Date(b.year, b.month, b.day);
  if (d1 < d2) return -1;
  if (d1 > d2) return 1;
  return 0;
}

// Можно ли выбрать дату: не раньше сегодняшнего дня.
function isDateSelectable(date) {
  return compareDates(date, today) >= 0;
}

// Возвращает слоты для даты в формате { time: "10:00", available: true }.
function getSlotsForDate(date) {
  const weekDay = new Date(date.year, date.month, date.day).getDay();
  if (weekDay === DAY_OFF) {
    return [];
  }

  const busy = BUSY_BY_DAY[date.day] || [];
  const isToday = compareDates(date, today) === 0;

  return SLOT_TIMES.map((time) => {
    const hour = parseInt(time);
    // Сегодня нельзя записаться на время, которое уже прошло.
    const alreadyPassed = isToday && hour <= now.getHours();
    return {
      time: time,
      available: !busy.includes(time) && !alreadyPassed,
    };
  });
}

// «Пятница, 17 октября 2026»
function formatDate(date) {
  const weekDay = new Date(date.year, date.month, date.day).getDay();
  return `${DAYS_OF_WEEK[weekDay]}, ${date.day} ${MONTHS_GENITIVE[date.month]} ${date.year}`;
}

// Сдвигает месяц на delta (+1 или -1) с переходом через год.
function shiftMonth(year, month, delta) {
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

// =====================================================================
// 4. ОТРИСОВКА И ОБРАБОТЧИКИ
// =====================================================================

const monthTitle = document.querySelector(".calendar-month");
const daysContainer = document.querySelector(".days");
const slotsContainer = document.querySelector(".slots-grid");
const summaryValue = document.querySelector(".summary-value");
const prevButton = document.querySelector(".arrow-btn--prev");
const nextMonthButton = document.querySelector(".arrow-btn--next");
const nextStepButton = document.querySelector(".next-btn");

// --- Календарь ---

function renderCalendar() {
  monthTitle.textContent = `${MONTHS_NOMINATIVE[state.viewMonth]} ${state.viewYear}`;

  const weeks = buildCalendarGrid(state.viewYear, state.viewMonth);
  let html = "";

  weeks.forEach((week) => {
    week.forEach((cell) => {
      // Дни соседнего месяца — серые и без обработчика.
      if (cell.otherMonth) {
        html += `<button class="day day--muted" type="button" disabled>${cell.day}</button>`;
        return;
      }

      const cellDate = {
        day: cell.day,
        month: state.viewMonth,
        year: state.viewYear,
      };

      let classes = "day";
      if (!isDateSelectable(cellDate)) classes += " day--disabled";
      if (compareDates(cellDate, today) === 0) classes += " day--today";
      if (compareDates(cellDate, state.selectedDate) === 0) classes += " day--selected";

      html += `<button class="${classes}" type="button" data-day="${cell.day}">${cell.day}</button>`;
    });
  });

  daysContainer.innerHTML = html;

  // После innerHTML старые элементы удалены — вешаем обработчики заново.
  // Только на дни, которые можно выбрать.
  daysContainer
    .querySelectorAll(".day[data-day]:not(.day--disabled)")
    .forEach((button) => button.addEventListener("click", onDayClick));

  // В прошлые месяцы листать нет смысла: там всё равно нельзя выбрать день.
  prevButton.disabled =
    state.viewYear === today.year && state.viewMonth === today.month;
}

function onDayClick(event) {
  const day = parseInt(event.currentTarget.dataset.day);

  state.selectedDate = {
    day: day,
    month: state.viewMonth,
    year: state.viewYear,
  };
  state.selectedTime = null; // при смене дня время сбрасываем обязательно
  state.slots = getSlotsForDate(state.selectedDate);

  renderAll();
}

function onPrevMonthClick() {
  const prev = shiftMonth(state.viewYear, state.viewMonth, -1);
  state.viewYear = prev.year;
  state.viewMonth = prev.month;
  renderCalendar();
}

function onNextMonthClick() {
  const next = shiftMonth(state.viewYear, state.viewMonth, 1);
  state.viewYear = next.year;
  state.viewMonth = next.month;
  renderCalendar();
}

// --- Слоты ---

function renderSlots() {
  if (state.slots.length === 0) {
    slotsContainer.innerHTML =
      '<p class="slots-empty">В этот день салон не работает. Выберите другой день.</p>';
    return;
  }

  let html = "";

  state.slots.forEach((slot) => {
    let classes = "slot";
    if (!slot.available) classes += " slot--busy";
    if (slot.time === state.selectedTime) classes += " slot--selected";

    if (slot.available) {
      html += `<button class="${classes}" type="button" data-time="${slot.time}">${slot.time}</button>`;
    } else {
      html += `
        <button class="${classes}" type="button" disabled>
          ${slot.time}
          <span class="slot-hint">Занято</span>
        </button>`;
    }
  });

  slotsContainer.innerHTML = html;

  slotsContainer
    .querySelectorAll(".slot[data-time]")
    .forEach((button) => button.addEventListener("click", onSlotClick));
}

function onSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderSlots();
  renderSummary();
}

// --- Нижняя панель ---

function renderSummary() {
  const dateText = formatDate(state.selectedDate);

  if (state.selectedTime) {
    summaryValue.textContent = `${dateText} • ${state.selectedTime}`;
  } else {
    summaryValue.textContent = `${dateText} • выберите время`;
  }

  // «Далее» доступна, только когда выбраны и день, и время.
  nextStepButton.disabled = state.selectedTime === null;
}

function onNextStepClick() {
  console.log("Выбрано:", state.selectedDate, state.selectedTime);
}

// Перерисовать всё, что зависит от выбранного дня.
function renderAll() {
  renderCalendar();
  renderSlots();
  renderSummary();
}

// =====================================================================
// 5. ИНИЦИАЛИЗАЦИЯ
// =====================================================================

prevButton.addEventListener("click", onPrevMonthClick);
nextMonthButton.addEventListener("click", onNextMonthClick);
nextStepButton.addEventListener("click", onNextStepClick);

state.slots = getSlotsForDate(state.selectedDate);
renderAll();
