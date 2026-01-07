// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Отримуємо поточний шлях (наприклад, "/doctors")
  const { pathname } = useLocation();

  useEffect(() => {
    // Ця команда прокручує вікно вгору (x=0, y=0)
    window.scrollTo(0, 0);
  }, [pathname]); // Спрацьовує кожного разу, коли змінюється pathname

  return null; // Цей компонент нічого не відображає візуально
};

export default ScrollToTop;