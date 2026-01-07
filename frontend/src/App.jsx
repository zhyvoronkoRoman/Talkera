import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- ВАЖЛИВО: Додали імпорт функції запиту профілю ---
import { getProfile } from './api/auth'; 

// Імпорти компонентів
import Header from './components/page-components/Header.jsx';
import Footer from './components/page-components/Footer.jsx';
import Registration from './components/Registration.jsx'; 

// Імпорти сторінок
import Home from './pages/main-pages/Home.jsx';
import AllDoctors from './pages/main-pages/AllDoctors.jsx';
import Games from './pages/main-pages/Game.jsx';
import AboutUs from './pages/terms-and-policy/AboutUs.jsx';
import Contacts from './pages/terms-and-policy/Contacts.jsx';
import Profile from './pages/main-pages/Profile.jsx';
import Terms from './pages/terms-and-policy/Terms.jsx';
import PrivacyPolicy from './pages/terms-and-policy/PrivacyPolicy.jsx';
import DoctorDetails from './pages/main-pages/DoctorDetails.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Metronome from './components/games/Metronome.jsx';
import LineUp from './components/games/LineUp.jsx'
import VoiceElevator from './components/games/VoiceElevator.jsx';

function App() {
  // 1. Стан авторизації (null = не увійшов, об'єкт = увійшов)
  const [user, setUser] = useState(null);
  
  // 2. Стан завантаження (true = перевіряємо токен)
  const [loading, setLoading] = useState(true);

  // 3. Стан модального вікна (true = відкрито, false = закрито)
  const [isRegistrationModalOpen, setRegistrationModalOpen] = useState(false);

  // 4. Функція для отримання повних даних користувача
  const fetchUserData = async (token) => {
    try {
      // Запитуємо реальні дані з сервера (Ім'я, Прізвище, Email, і т.д.)
      const userData = await getProfile(token);

      // Додаємо токен в об'єкт user і зберігаємо в стейт
      setUser({ ...userData, token });
      return userData;
    } catch (error) {
      console.error("Помилка отримання даних користувача:", error);
      // Якщо токен недійсний або протух - чистимо LocalStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');
      setUser(null);
      throw error;
    }
  };

  // 5. Перевірка сесії при запуску
  useEffect(() => {
    const initUser = async () => {
      // Перевіряємо токен в URL (для OAuth2)
      const urlParams = new URLSearchParams(window.location.search);
      const oauthToken = urlParams.get('token');

      if (oauthToken) {
        // Очищаємо URL від токена
        window.history.replaceState({}, document.title, window.location.pathname);
        // Зберігаємо токен і отримуємо дані користувача
        localStorage.setItem('authToken', oauthToken);
        await fetchUserData(oauthToken);
      } else {
        // Звичайна перевірка токена
        const token = localStorage.getItem('authToken');
        if (token) {
          await fetchUserData(token);
        }
      }

      // Вимикаємо індикатор завантаження
      setLoading(false);
    };

    initUser();
  }, []);

  // Оновлена функція onLogin
  const handleLogin = async (userData) => {
    try {
      // Зберігаємо email і token в localStorage
      if (userData.token) {
        localStorage.setItem('authToken', userData.token);
      }
      localStorage.setItem('userEmail', userData.email);

      // Отримуємо повні дані користувача з сервера
      await fetchUserData(userData.token);

      setRegistrationModalOpen(false); // Закриваємо вікно після входу
    } catch (error) {
      // Якщо сталася помилка при отриманні даних, все одно закриваємо модалку
      // але користувач буде мати тільки базові дані
      setUser(userData);
      setRegistrationModalOpen(false);
      console.error("Помилка при вході:", error);
    }
  };

  // Функція для оновлення даних користувача (викликається після збереження профілю)
  const handleUserUpdate = (updatedUserData) => {
    setUser(updatedUserData);
  };
  
  // Функція виходу
  const handleLogout = () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('userEmail'); 
    setUser(null);
  };

  const openRegistrationModal = () => setRegistrationModalOpen(true);
  const closeRegistrationModal = () => setRegistrationModalOpen(false);

  // Якщо додаток ще думає (перевіряє токен), показуємо пустий екран або спіннер
  // Це запобігає "миготінню" кнопки входу
  if (loading) {
      return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Завантаження...</div>;
  }

  return (
    <Router>
      <ScrollToTop />
      <div className="app-container">
        
        <Header 
          user={user} 
          onLogout={handleLogout} 
          onOpenRegistration={openRegistrationModal} 
        />

        <main>
          <Routes>
          <Route path="/" element={<Home user={user} onOpenRegistration={openRegistrationModal} />}/>
            <Route path="/doctors" element={<AllDoctors />} />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contacts" element={<Contacts />} />

            <Route path="/metronome" element={<Metronome />} />
            <Route path="/line-ball" element={<LineUp />} /> 
            <Route path="/volume-ball" element={<VoiceElevator />} />
            
            {/* Передаємо user у профіль, щоб заповнити поля */}
            <Route path="/profile" element={<Profile user={user} onUserUpdate={handleUserUpdate} />} />
            
            <Route path="/terms" element={<Terms />} />
            <Route path="/policy" element={<PrivacyPolicy />} />
            
            <Route 
              path="/doctor/:id" 
              element={<DoctorDetails user={user} onOpenRegistration={openRegistrationModal} />} 
            />
          </Routes>
        </main>

        <Footer />

        <Registration 
          isOpen={isRegistrationModalOpen} 
          onClose={closeRegistrationModal} 
          onLogin={handleLogin} 
        />
      </div>
    </Router>
  );
}

export default App;