// App — корневой компонент: страница выбора даты и времени на React.
//
// Здесь живёт всё состояние страницы (useState), а дочерние
// компоненты получают данные и колбэки через пропсы.
//
// Что было в нативной версии → что стало здесь:
//   глобальные переменные state       → useState
//   innerHTML + сборка строк          → JSX и .map()
//   addEventListener("click")         → onClick
//   ручная перерисовка renderAll()    → React перерисует сам
import { useState } from "react";
import "./styles/booking.css";
import Header from "./components/Header.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BottomBar from "./components/BottomBar.jsx";
import { getToday, shiftMonth } from "./utils/date.js";
import { getSlotsForDate } from "./data/slots.js";

// «Сегодня» считаем один раз при загрузке модуля.
const today = getToday();

function App() {
  // Какой месяц показан в календаре.
  const [viewYear, setViewYear] = useState(today.year);
  const [viewMonth, setViewMonth] = useState(today.month);

  // Выбранный день (по умолчанию — сегодня) и выбранное время.
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);

  // Слоты не храним в состоянии: они однозначно вычисляются
  // из выбранного дня, поэтому считаем их при рендере.
  const slots = getSlotsForDate(selectedDate, today);

  function handleSelectDay(day) {
    setSelectedDate({ day, month: viewMonth, year: viewYear });
    setSelectedTime(null); // при смене дня время сбрасываем обязательно
  }

  function handleSelectTime(time) {
    setSelectedTime(time);
  }

  function handlePrevMonth() {
    const prev = shiftMonth(viewYear, viewMonth, -1);
    setViewYear(prev.year);
    setViewMonth(prev.month);
  }

  function handleNextMonth() {
    const next = shiftMonth(viewYear, viewMonth, 1);
    setViewYear(next.year);
    setViewMonth(next.month);
  }

  function handleNext() {
    console.log("Выбрано:", selectedDate, selectedTime);
  }

  return (
    <div className="page">
      <Header />

      <main className="main">
        <StepIndicator current={3} />

        <h1 className="title">Выберите дату и время</h1>
        <p className="subtitle">Анна Смирнова · Стрижка женская · Шаг 3 из 5</p>

        <div className="panels">
          <Calendar
            viewYear={viewYear}
            viewMonth={viewMonth}
            selectedDate={selectedDate}
            today={today}
            onSelectDay={handleSelectDay}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
          <TimeSlots
            slots={slots}
            selectedTime={selectedTime}
            onSelectTime={handleSelectTime}
          />
        </div>

        <BottomBar
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onNext={handleNext}
        />
      </main>
    </div>
  );
}

export default App;
