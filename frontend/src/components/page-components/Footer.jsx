import React, { useState } from "react";
import { Link } from "react-router-dom";
import { sendContactMessage } from "../../api/auth";
import "./Footer.css"; 

const Footer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Очищаємо статус при введенні
    if (submitStatus) setSubmitStatus(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
      });

      setSubmitStatus({ type: 'success', message: `Дякуємо, ${formData.name}! Ваше повідомлення надіслано успішно.` });
      setFormData({ name: "", email: "", message: "" });

    } catch (error) {
      console.error('Помилка відправки повідомлення:', error);
      setSubmitStatus({ type: 'error', message: 'Помилка відправки повідомлення. Спробуйте пізніше.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer-whole-section">
      
      {/* ВЕРХНЯ ЧАСТИНА: Форма зв'язку  */}
      <div className="footer-top-content">
        <div className="contact-block">
          <h3 className="contact-title">Зв’язок з нами</h3>
          <p className="contact-subtitle">
            Маєш питання? Ми завжди раді допомогти тобі на шляху до впевненого мовлення! 
            Зв’яжися з нашою командою — разом ми досягнемо мети.
          </p>
          
          <form onSubmit={handleSubmit} className="contact-form-dark">
            <input 
              type="text" 
              name="name" 
              placeholder="Введіть ваше ім'я" 
              value={formData.name}
              onChange={handleChange}
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Введіть ваш email" 
              value={formData.email}
              onChange={handleChange}
              required 
            />
            <textarea 
              name="message" 
              placeholder="Введіть ваше повідомлення..." 
              rows="4"
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            
            <button
              type="submit"
              className="btn-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Надсилається...' : 'Надіслати'}
            </button>

            {submitStatus && (
              <div
                className={`submit-status ${submitStatus.type}`}
                style={{
                  marginTop: '10px',
                  padding: '10px',
                  borderRadius: '5px',
                  textAlign: 'center',
                  fontSize: '14px',
                  backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: submitStatus.type === 'success' ? '#155724' : '#721c24',
                  border: `1px solid ${submitStatus.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                }}
              >
                {submitStatus.message}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* РОЗДІЛЮВАЧ (Лінія) */}
      <div className="footer-divider"></div>

      {/* НИЖНЯ ЧАСТИНА: Навігація і лого (як на картинці знизу) */}
      <div className="footer-bottom-content">
        <div className="footer-container">
          
          {/* Логотип */}
          <div className="footer-logo">
            <h2>Talkera</h2>
            <p>
              Ваш особистий гід у світі вільного спілкування.
            </p>
          </div>

          {/* Колонки посилань */}
          <div className="footer-links-group">
            
            <div className="link-column">
              <h4>Навігація</h4>
              <ul>
                <li><Link to="/doctors">Лікарі</Link></li>
                <li><Link to="/games">Ігри</Link></li>
                <li><Link to="/about">Про нас</Link></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Ресурси</h4>
              <ul>
                <li><Link to="/policy">Політика конфіденційності</Link></li>
                <li><Link to="/terms">Умови використання</Link></li>
                <li><Link to="/contacts">Контакти</Link></li>
              </ul>
            </div>

            <div className="link-column">
              <h4>Ми у соцмережах</h4>
              <div className="social-text-links">
                 {/* Текстові посилання замість іконок */}
                <a href="https://www.instagram.com/">Instagram</a>
                <a href="https://www.facebook.com/">Facebook</a>
                <a href="https://web.telegram.org/a/">Telegram</a>
                <div className="footer-column">
          </div>
              </div>
            </div>

          </div>
        </div>

        <div className="footer-copyright">
          <p>© {new Date().getFullYear()} Talkera. Усі права захищено.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;