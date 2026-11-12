// TimeSlots — панель со слотами времени выбранного дня.
//
// Пропсы:
//   slots        — массив { time, available };
//   selectedTime — выбранное время или null;
//   onSelectTime(time) — колбэк при клике по свободному слоту.
export default function TimeSlots({ slots, selectedTime, onSelectTime }) {
  return (
    <section className="slots-panel">
      <h2 className="slots-title">Доступное время</h2>

      {/* Условный рендер: нет слотов — показываем сообщение */}
      {slots.length === 0 ? (
        <p className="slots-empty">
          В этот день салон не работает. Выберите другой день.
        </p>
      ) : (
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
      )}
    </section>
  );
}
