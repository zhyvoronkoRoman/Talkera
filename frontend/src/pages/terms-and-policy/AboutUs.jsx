import React, { useState, useEffect } from 'react';
import { getAllReviews, createReview } from '../../api/auth';
import './AboutUs.css';

const AboutUs = () => {
  // 1. Стан для списку відгуків (завантажується з API)
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Стан для форми нового відгуку
  const [newReviewText, setNewReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Для демо-версії припустимо, що користувач залогінений під цим іменем
  const currentUser = { name: "Гість", role: "Користувач" };

  // Завантаження відгуків при першому рендері
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const reviewsData = await getAllReviews();
      setReviews(reviewsData);
    } catch (error) {
      console.error('Помилка завантаження відгуків:', error);
      // Якщо API недоступне, використовуємо демо-відгуки
      setReviews([
        {
          id: 1,
          name: "Олена Петрівна",
          role: "Мама пацієнта (7 років)",
          text: "Talkera змінила наше ставлення до занять. Син тепер сам просить 'пограти в слова', а не сприймає це як нудне лікування. Дякую логопеду Марії за професіоналізм!",
          rating: 5,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: "Андрій В.",
          role: "Користувач",
          text: "Я боровся із заїканням усе доросле життя. Тут я знайшов не тільки крутих лікарів, а й зручний інструмент для щоденних тренувань. Прогрес є!",
          rating: 5,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: "Ірина Лисенко",
          role: "Логопед-дефектолог",
          text: "Як спеціаліст, я бачу великий потенціал у гейміфікації. Це допомагає зняти напругу у пацієнтів. Платформа дуже зручна для ведення клієнтів.",
          rating: 4,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  }; 

  // Функція додавання відгуку
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewText.trim()) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        name: currentUser.name,
        role: currentUser.role,
        text: newReviewText.trim(),
        rating: 5 // Поки що ставимо 5 за замовчуванням
      };

      // Зберігаємо відгук в базу даних
      const savedReview = await createReview(reviewData);

      // Додаємо новий відгук на початок списку
      setReviews([savedReview, ...reviews]);
      setNewReviewText(""); // Очищаємо поле
      alert("Дякуємо! Ваш відгук опубліковано.");

    } catch (error) {
      console.error('Помилка створення відгуку:', error);
      alert("Помилка створення відгуку. Спробуйте пізніше.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="about-page">
      
      {/* Секція 1: Герой (Заголовок) */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Більше ніж просто слова</h1>
          <p>
            Talkera — це простір, де технології зустрічаються з турботою, 
            щоб допомогти кожному знайти свій впевнений голос.
          </p>
        </div>
      </section>

      {/* Секція 2: Наша місія */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-grid">
            <div className="mission-text">
              <h2>Наша Місія</h2>
              <p>
                Ми віримо, що заїкання не повинно бути перешкодою для мрій. 
                Наша мета — зробити професійну логопедичну допомогу доступною, 
                а процес лікування — цікавим та мотивуючим.
              </p>
              <p>
                Ми поєднали доказову медицину з ігровими механіками, 
                тому що позитивні емоції — це найкращий каталізатор змін.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Секція 3: Чому ми? */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Чому обирають Talkera?</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🎮</div>
              <h3>Гейміфікація</h3>
              <p>Перетворюємо нудні вправи на захоплюючі ігри. Проходьте рівні, отримуйте нагороди та покращуйте мовлення.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">👩‍⚕️</div>
              <h3>Експертність</h3>
              <p>Тільки сертифіковані логопеди, психологи та дефектологи. Ви обираєте спеціаліста, який підходить саме вам.</p>
            </div>
            <div className="value-item">
              <div className="value-icon">🛡️</div>
              <h3>Безпечний простір</h3>
              <p>Ми створили спільноту без осуду. Тут вас розуміють, підтримують і вірять у ваш успіх.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Секція 4: Відгуки (Інтерактивна) */}
      <section className="reviews-section">
        <div className="container">
          <h2 className="section-title">Що кажуть наші користувачі</h2>
          
          {/* Список відгуків */}
          <div className="reviews-grid">
            {loading ? (
              <div className="loading-reviews">Завантаження відгуків...</div>
            ) : reviews.length === 0 ? (
              <div className="no-reviews">Ще немає відгуків. Будьте першим!</div>
            ) : (
              reviews.map((review) => (
                <div key={review.id || review.createdAt} className="review-card">
                  <div className="review-header">
                    <div className="avatar-placeholder">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <h4>{review.name}</h4>
                      <span className="review-role">{review.role}</span>
                      {review.createdAt && (
                        <span className="review-date">
                          {new Date(review.createdAt).toLocaleDateString('uk-UA')}
                        </span>
                      )}
                    </div>
                    <div className="review-stars">
                      {"★".repeat(review.rating || 5)}
                    </div>
                  </div>
                  <p className="review-text">"{review.text}"</p>
                </div>
              ))
            )}
          </div>

          {/* Форма додавання відгуку */}
          <div className="add-review-block">
            <h3>Залиште свій відгук</h3>
            <p>Ваша думка допомагає нам ставати кращими.</p>
            <form onSubmit={handleSubmitReview} className="review-form">
              <textarea
                placeholder="Напишіть ваші враження від Talkera..."
                value={newReviewText}
                onChange={(e) => setNewReviewText(e.target.value)}
                required
              ></textarea>
              <button
                type="submit"
                className="btn-review"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Публікується...' : 'Опублікувати відгук'}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;