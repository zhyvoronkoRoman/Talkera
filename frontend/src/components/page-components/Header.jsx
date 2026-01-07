// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

// Приймаємо props від App.jsx
const Header = ({ user, onLogout, onOpenRegistration }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">Talkera</Link>
      </div>

      <nav>
        <ul className="nav-list">
          <li><Link to="/doctors">Лікарі</Link></li>
          <li><Link to="/games">Ігри</Link></li>
          <li><Link to="/about">Про нас</Link></li>
          <li><Link to="/contacts">Контакти</Link></li>
        </ul>
      </nav>

      <div className="user-section">
        {!user ? (
          // Якщо немає користувача -> Кнопка викликає модалку
          <button className="btn-login" onClick={onOpenRegistration}>
            Увійти
          </button>
        ) : (
          <div>
            <button 
              className="btn-profile" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {user.firstName} ▼
            </button>

            {isMenuOpen && (
              <div className="dropdown-menu">
                <ul>
                  <li>
                    <Link to="/profile" className="dropdown-link" onClick={() => setIsMenuOpen(false)}>
                      Мій профіль
                    </Link>
                  </li>
                  <li>
                    <button className="btn-logout" onClick={() => {
                        onLogout();
                        setIsMenuOpen(false);
                        navigate('/');
                    }}>
                      Вийти
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;