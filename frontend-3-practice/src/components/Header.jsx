// Header — шапка сайта: логотип, меню и кнопка «Записаться».
// Пропсов не принимает: содержимое статичное.
export default function Header() {
  const links = ["Услуги", "Мастера", "Отзывы", "Контакты"];

  return (
    <header className="header">
      <a href="#" className="logo">
        LUMINA
      </a>
      <nav className="nav">
        {links.map((link) => (
          <a key={link} href="#" className="nav-link">
            {link}
          </a>
        ))}
      </nav>
      <button className="header-btn" type="button">
        Записаться
      </button>
    </header>
  );
}
