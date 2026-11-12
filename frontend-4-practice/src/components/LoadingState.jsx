// LoadingState — заглушка для загрузки или ошибки.
//
// Пропсы:
//   error — текст ошибки; если есть, показываем сообщение об ошибке;
//   text  — текст во время загрузки (по умолчанию «Загрузка…»).
export default function LoadingState({ error, text = "Загрузка…" }) {
  if (error) {
    return (
      <p className="state-message state-message--error">
        Не удалось загрузить данные: {error}
      </p>
    );
  }

  return <p className="state-message">{text}</p>;
}
