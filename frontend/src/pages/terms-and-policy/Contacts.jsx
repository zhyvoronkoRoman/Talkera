import React from 'react';
import './Contacts.css';

const Contacts = () => {
  return (
    <div className="contacts-page">
      <div className="container">
        
        {/* Заголовок */}
        <div className="contacts-header">
          <h1>Зв'яжіться з нами</h1>
          <p>Оберіть зручний спосіб для зв'язку або завітайте до нас в гості.</p>
        </div>

        {/* Центральна картка з контактами */}
        <div className="contacts-wrapper">
          <div className="contact-info-card">
            
            <div className="contact-list-horizontal">
              {/* Телефон */}
              <div className="contact-item">
                <div className="icon-box">📞</div>
                <div className="item-text">
                  <h3>Телефон</h3>
                  <p>+38 (044) 123-45-67</p>
                  <p>+38 (099) 987-65-43</p>
                </div>
              </div>

              {/* Email */}
              <div className="contact-item">
                <div className="icon-box">✉️</div>
                <div className="item-text">
                  <h3>Email</h3>
                  <p>support@talkera.com</p>
                  <p>partners@talkera.com</p>
                </div>
              </div>

              {/* Адреса */}
              <div className="contact-item">
                <div className="icon-box">📍</div>
                <div className="item-text">
                  <h3>Адреса</h3>
                  <p>с. Зимна Вода, Львівська, 94а</p>
                  <p>Пн-Пт: 09:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Соціальні мережі */}
            <div className="social-block-center">
              <h3>Ми в соцмережах</h3>
              <div className="social-links-row">
                <a href="https://www.instagram.com/" className="social-btn">Instagram</a>
                <a href="https://www.facebook.com/" className="social-btn">Facebook</a>
                <a href="https://web.telegram.org/a/" className="social-btn">Telegram</a>
              </div>
            </div>

          </div>
        </div>

        {/* Секція карти з заголовком */}
        <div className="map-section-wrapper">
          <h2 className="map-title">Наш офіс</h2>
          <div className="map-frame">
            <iframe 
              title="Talkera Office Map"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d643.5389990371567!2d23.877400158234735!3d49.82073319963159!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1z0LfQuNC80L3QsCDQstC-0LTQsCDRh9C10YDQtdC80YjQuNC90LA!5e0!3m2!1suk!2sua!4v1766574300743!5m2!1suk!2sua" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contacts;