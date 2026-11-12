// App — корневой компонент: страница выбора даты и времени.
//
// Отличие от задания 3: данные приходят с сервера.
//   1. При открытии страницы грузим «сегодня» — GET /api/booking/today.
//   2. Когда выбран день — грузим его слоты — GET /api/slots?day=&month=&year=.
// У каждой загрузки три состояния: loading → error или данные.
import { useEffect, useState } from "react";
import "./styles/booking.css";
import Header from "./components/Header.jsx";
import StepIndicator from "./components/StepIndicator.jsx";
import Calendar from "./components/Calendar.jsx";
import TimeSlots from "./components/TimeSlots.jsx";
import BottomBar from "./components/BottomBar.jsx";
import LoadingState from "./components/LoadingState.jsx";
import { compareDates, shiftMonth } from "./utils/date.js";
import { fetchSlots, fetchToday } from "./api.js";

function App() {
  // --- «Сегодня» с сервера ---
  const [today, setToday] = useState(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  // --- Календарь и выбор ---
  // Пока «сегодня» не пришло, месяц и день неизвестны — поэтому null.
  const [viewYear, setViewYear] = useState(null);
  const [viewMonth, setViewMonth] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // --- Слоты выбранного дня с сервера ---
  const [slots, setSlots] = useState(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);

  // 1. Загружаем «сегодня» один раз при открытии страницы.
  useEffect(() => {
    async function loadToday() {
      try {
        setTodayLoading(true);
        setTodayError(null);
        const data = await fetchToday();
        setToday(data);
        // Теперь знаем, какой месяц показать и какой день выбрать.
        setViewYear(data.year);
        setViewMonth(data.month);
        setSelectedDate(data);
      } catch (err) {
        setTodayError(err.message);
      } finally {
        setTodayLoading(false);
      }
    }
    loadToday();
  }, []);

  // 2. Загружаем слоты каждый раз, когда меняется выбранный день.
  useEffect(() => {
    if (!selectedDate) return;

    // Если пользователь быстро кликает по дням, ответы могут прийти
    // не по порядку. Флаг ignore отбрасывает ответ от «старого» дня.
    let ignore = false;

    async function loadSlots() {
      try {
        setSlotsLoading(true);
        setSlotsError(null);
        const data = await fetchSlots(selectedDate);
        // Дополнительная проверка: ответ относится к выбранному дню.
        if (!ignore && compareDates(data.date, selectedDate) === 0) {
          setSlots(data.slots);
        }
      } catch (err) {
        if (!ignore) setSlotsError(err.message);
      } finally {
        if (!ignore) setSlotsLoading(false);
      }
    }
    loadSlots();

    // Функция очистки: вызывается перед следующим запуском эффекта.
    return () => {
      ignore = true;
    };
  }, [selectedDate]);

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

  // Пока нет «сегодня» — вместо календаря показываем заглушку или ошибку.
  const todayReady = !todayLoading && !todayError && today;

  return (
    <div className="page">
      <Header />

      <main className="main">
        <StepIndicator current={3} />

        <h1 className="title">Выберите дату и время</h1>
        <p className="subtitle">Анна Смирнова · Стрижка женская · Шаг 3 из 5</p>

        {todayReady ? (
          <>
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
                loading={slotsLoading}
                error={slotsError}
                selectedTime={selectedTime}
                onSelectTime={handleSelectTime}
              />
            </div>

            <BottomBar
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onNext={handleNext}
            />
          </>
        ) : (
          <div className="state-panel">
            <LoadingState error={todayError} text="Загружаем календарь…" />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
