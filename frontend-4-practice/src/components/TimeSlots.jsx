// TimeSlots — панель со слотами времени выбранного дня.
//
// Пропсы:
//   slots        — массив { time, available } (или null, пока не загружен);
//   loading      — идёт запрос слотов;
//   error        — текст ошибки загрузки или null;
//   selectedTime — выбранное время или null;
//   onSelectTime(time) — колбэк при клике по свободному слоту.
import LoadingState from "./LoadingState.jsx";

export default function TimeSlots({
  slots,
  loading,
  error,
  selectedTime,
  onSelectTime,
}) {
  // Выбираем, что показать: заглушку, ошибку, пустой список или слоты.
  let content;
  if (loading) {
    content = <LoadingState text="Загружаем свободное время…" />;
  } else if (error) {
    content = <LoadingState error={error} />;
  } else if (!slots || slots.length === 0) {
    content = <p className="slots-empty">На этот день свободного времени нет.</p>;
  } else {
    content = (
      <div className="slots-grid">
        {slots.map((slot) => {
          let className = "slot";
          if (!slot.available) className += " slot--busy";
          if (slot.time === selectedTime) className += " slot--selected";

          return (
            <button
              key={slot.time}
              className={className}
              type="button"
              disabled={!slot.available}
              onClick={() => onSelectTime(slot.time)}
            >
              {slot.time}
              {!slot.available && <span className="slot-hint">Занято</span>}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <section className="slots-panel">
      <h2 className="slots-title">Доступное время</h2>
      {content}
    </section>
  );
}
