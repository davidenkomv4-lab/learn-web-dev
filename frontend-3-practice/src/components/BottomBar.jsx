// BottomBar — нижняя панель: что выбрано и кнопка «Далее».
//
// Пропсы:
//   selectedDate — выбранный день;
//   selectedTime — выбранное время или null;
//   onNext       — колбэк кнопки «Далее».
import { formatDate } from "../utils/date.js";

export default function BottomBar({ selectedDate, selectedTime, onNext }) {
  const dateText = formatDate(selectedDate);
  const timeText = selectedTime ?? "выберите время";

  return (
    <div className="bottom-bar">
      <div className="selected-summary">
        <span className="summary-label">Выбрано:</span>
        <span className="summary-value">
          {dateText} • {timeText}
        </span>
      </div>
      {/* «Далее» доступна, только когда выбраны и день, и время */}
      <button
        className="next-btn"
        type="button"
        disabled={selectedTime === null}
        onClick={onNext}
      >
        Далее →
      </button>
    </div>
  );
}
