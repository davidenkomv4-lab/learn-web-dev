// StepIndicator — индикатор шагов записи.
// Пропс current — номер текущего шага. Шаги до него — «пройденные».
import { Fragment } from "react";

const STEPS = ["Мастер", "Услуга", "Дата", "Контакты", "Готово"];

export default function StepIndicator({ current }) {
  return (
    <div className="steps">
      {STEPS.map((label, index) => {
        const number = index + 1;

        let stepClass = "step";
        if (number < current) stepClass += " step--done";
        if (number === current) stepClass += " step--current";

        // Линия между шагами «пройдена», если следующий шаг уже достигнут.
        const lineClass =
          number + 1 <= current ? "step-line step-line--done" : "step-line";

        return (
          // Fragment — обёртка без лишнего div, чтобы не сломать flex-вёрстку.
          <Fragment key={label}>
            <div className={stepClass}>
              <span className="step-num">{number}</span>
              <span className="step-label">{label}</span>
            </div>
            {/* После последнего шага линии нет */}
            {index < STEPS.length - 1 && <div className={lineClass}></div>}
          </Fragment>
        );
      })}
    </div>
  );
}
