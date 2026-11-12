// Calendar — панель календаря: название месяца, стрелки и сетка дней.
//
// Своего состояния не хранит — всё приходит пропсами из App:
//   viewYear, viewMonth — какой месяц показываем;
//   selectedDate        — выбранный день { day, month, year };
//   today               — сегодняшняя дата;
//   onSelectDay(day)    — колбэк при клике по дню;
//   onPrevMonth / onNextMonth — колбэки стрелок.
import {
  MONTHS_NOMINATIVE,
  WEEKDAYS_SHORT,
  buildCalendarGrid,
  compareDates,
  isDateSelectable,
} from "../utils/date.js";

export default function Calendar({
  viewYear,
  viewMonth,
  selectedDate,
  today,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}) {
  // Сетку пересчитываем при каждом рендере — это дёшево.
  // flat() превращает массив недель в один список из 35–42 ячеек.
  const cells = buildCalendarGrid(viewYear, viewMonth).flat();

  // В прошлые месяцы листать нет смысла.
  const isCurrentMonth = viewYear === today.year && viewMonth === today.month;

  return (
    <section className="calendar-panel">
      <div className="calendar-top">
        <h2 className="calendar-month">
          {MONTHS_NOMINATIVE[viewMonth]} {viewYear}
        </h2>
        <div className="calendar-arrows">
          <button
            className="arrow-btn"
            type="button"
            aria-label="Предыдущий месяц"
            onClick={onPrevMonth}
            disabled={isCurrentMonth}
          >
            ‹
          </button>
          <button
            className="arrow-btn"
            type="button"
            aria-label="Следующий месяц"
            onClick={onNextMonth}
          >
            ›
          </button>
        </div>
      </div>

      <div className="weekdays">
        {WEEKDAYS_SHORT.map((name) => (
          <span key={name}>{name}</span>
        ))}
      </div>

      <div className="days">
        {cells.map((cell, index) => {
          // Дни соседнего месяца — серые и некликабельные.
          if (cell.otherMonth) {
            return (
              <button key={index} className="day day--muted" type="button" disabled>
                {cell.day}
              </button>
            );
          }

          const cellDate = { day: cell.day, month: viewMonth, year: viewYear };
          const selectable = isDateSelectable(cellDate, today);

          let className = "day";
          if (!selectable) className += " day--disabled";
          if (compareDates(cellDate, today) === 0) className += " day--today";
          if (compareDates(cellDate, selectedDate) === 0) className += " day--selected";

          return (
            <button
              key={index}
              className={className}
              type="button"
              disabled={!selectable}
              // Замыкание: каждый onClick «помнит» свой cell.day.
              onClick={() => onSelectDay(cell.day)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
