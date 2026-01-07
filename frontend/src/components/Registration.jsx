import React, { useState, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
// ВАЖЛИВО: Імпортуємо ОБИДВІ функції
import { registerUser, loginUser, googleLogin } from '../api/auth';
import './Registration.css';

const AuthModal = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState('register');

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Google OAuth2 login
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        // tokenResponse.access_token - це ключ від Google
        // Ми відправляємо його на наш бекенд
        const data = await googleLogin(tokenResponse.access_token);

        localStorage.setItem('authToken', data.token);
        onLogin({ email: data.email, token: data.token }); // або інші дані з data
        onClose();
        alert("Успішний вхід через Google!");
      } catch (err) {
        console.error(err);
        setError("Не вдалося увійти через Google");
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError("Помилка з'єднання з Google"),
  });

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // --- ЛОГІКА РЕЄСТРАЦІЇ + АВТОМАТИЧНИЙ ВХІД ---
    if (mode === 'register') {
      try {
        const payload = {
            email: formData.email,
            password: formData.password,
            firstName: formData.name,      
            lastName: formData.lastName
        };

        // 1. Реєструємо користувача
        await registerUser(payload);
        
        // 2. Одразу виконуємо автоматичний вхід (використовуємо ті ж дані)
        const loginResponse = await loginUser({
            email: formData.email,
            password: formData.password
        });

        // 3. Зберігаємо токен
        localStorage.setItem('authToken', loginResponse.token);

        // 4. Оновлюємо стан додатку (вхід виконано)
        onLogin({ email: formData.email, token: loginResponse.token });
        
        // 5. Закриваємо модалку
        alert("Реєстрація успішна! Ви увійшли в акаунт.");
        onClose();

      } catch (err) {
        console.error("Помилка:", err);
        setError(err.message || "Сталася помилка");
      } finally {
        setIsLoading(false);
      }
    } 
    
    // --- ЛОГІКА ВХОДУ (Для тих, хто вже має акаунт) ---
    else if (mode === 'login') {
      try {
        const data = await loginUser({ 
            email: formData.email, 
            password: formData.password 
        });

        localStorage.setItem('authToken', data.token);
        
        onLogin({ email: formData.email, token: data.token });
        onClose();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } 
    
    else if (mode === 'forgot') {
      alert(`Інструкції надіслано на ${formData.email}`);
      setMode('login');
      setIsLoading(false);
    }
  };


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2>
          {mode === 'login' && 'Вхід в акаунт'}
          {mode === 'register' && 'Реєстрація'}
          {mode === 'forgot' && 'Відновлення пароля'}
        </h2>

        {error && <div style={{color: 'red', textAlign: 'center', marginBottom: '10px'}}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          
          {mode === 'register' && (
            <>
              <input 
                type="text" name="name" placeholder="Ваше ім'я" 
                value={formData.name} onChange={handleChange} required 
              />
              <input 
                type="text" name="lastName" placeholder="Ваше Прізвище" 
                value={formData.lastName} onChange={handleChange} 
              />
            </>
          )}

          <input 
            type="email" name="email" placeholder="Email" 
            value={formData.email} onChange={handleChange} required 
          />

          {mode !== 'forgot' && (
            <input 
              type="password" name="password" placeholder="Пароль" 
              value={formData.password} onChange={handleChange} required 
            />
          )}

          <button 
            type="submit" 
            className={`btn-auth-submit ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? 'Обробка...' : (
                <>
                    {mode === 'login' && 'Увійти'}
                    {mode === 'register' && 'Зареєструватися'}
                    {mode === 'forgot' && 'Надіслати код'}
                </>
            )}
          </button>
        </form>

        {mode !== 'forgot' && (
          <div className="google-auth">
            <p>або</p>
            <button type="button" className="btn-google" onClick={() => loginWithGoogle()}>
              G  Увійти через Google
            </button>
          </div>
        )}

        <div className="auth-footer">
          {mode === 'login' && (
            <>
              <p onClick={() => setMode('forgot')} className="auth-link">Забули пароль?</p>
              <p>Ще не маєте акаунту? <span onClick={() => setMode('register')} className="auth-link-bold">Зареєструватися</span></p>
            </>
          )}
          {mode === 'register' && (
            <p>Вже маєте акаунт? <span onClick={() => setMode('login')} className="auth-link-bold">Увійти</span></p>
          )}
          {mode === 'forgot' && (
            <p onClick={() => setMode('login')} className="auth-link-bold">Повернутися до входу</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;