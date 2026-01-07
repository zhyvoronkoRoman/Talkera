import React, {  useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = ({ user, onOpenRegistration }) => {
  
  useEffect(() => {
    fetch('http://localhost:8080/api/hello')
      .then(response => response.text())
      .then(data => console.log("ВІДПОВІДЬ СЕРВЕРА:", data))
      .catch(error => console.error("ПОМИЛКА:", error));
  }, []);

  // Список категорій для горизонтального меню
  const specialties = [
    { title: "Логопед", icon: "🗣️", desc: "Виправлення вимови та мовленнєвих вад" },
    { title: "Дефектолог", icon: "🧩", desc: "Робота з розвитком дитини" },
    { title: "Психолог", icon: "🧠", desc: "Подолання страхів та бар'єрів" },
    { title: "Сурдопедагог", icon: "👂", desc: "Допомога при порушеннях слуху" }
  ];

  return (
    <div className="home-page">
      
      {/* СЕКЦІЯ 1: Hero (Банер) */}
      <section className="hero-section">
        <div className="container hero-container">
          
          {/* Текст і Кнопка */}
          <div className="hero-content">
            <h1>Знайди свій впевнений голос разом з Talkera</h1>
            <p>
              Перша в Україні інтерактивна платформа для підтримки людей із заїканням. 
              Ігри, професійні лікарі та спільнота — в одному місці.
            </p>
            
            {/* Логіка кнопки: Якщо увійшов -> в Профіль, якщо ні -> Реєстрація */}
            {user ? (
              <Link to="/profile" className="btn-hero">
                Перейти до профілю
              </Link>
            ) : (
              <button onClick={onOpenRegistration} className="btn-hero">
                Приєднатися до нас
              </button>
            )}
          </div>

          {/* Фото */}
          <div className="hero-image">
            {/* Використовуємо гарне фото з безкоштовного стоку */}
            <img 
              src="/src/assets/doctors.png" 
              alt="Щаслива дівчина спілкується" 
            />
          </div>
        </div>
      </section>

      {/* СЕКЦІЯ 2: Категорії лікарів */}
      <section className="specialties-section">
        <div className="container">
          <h2>Наші спеціалісти</h2>
          <p className="section-subtitle">Оберіть фахівця, який потрібен саме вам</p>

          <div className="specialties-grid">
  {specialties.map((spec, index) => (
    // 👇 ЗМІНЮЄМО ЦЕЙ РЯДОК 👇
    // Ми додаємо ?category=НазваСпеціальності до посилання
    <Link 
      to={`/doctors?category=${spec.title}`} 
      key={index} 
      className="specialty-card"
    >
      <div className="spec-icon">{spec.icon}</div>
      <h3>{spec.title}</h3>
      <p>{spec.desc}</p>
      <span className="spec-link">Знайти лікаря →</span>
    </Link>
  ))}
</div>
        </div>
      </section>

      {/* СЕКЦІЯ 3: Заклик до перегляду всіх */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Не знаєте, кого обрати?</h2>
            <p>Перегляньте повний список наших кваліфікованих лікарів, ознайомтеся з відгуками та оберіть найкращого.</p>
            <Link to="/doctors" className="btn-cta">
              Переглянути всіх лікарів
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;