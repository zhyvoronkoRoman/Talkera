import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllDoctors } from '../../api/auth'; // Імпорт функції
import './AllDoctors.css';

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]); // Стан для даних з сервера
  const [filter, setFilter] = useState('Всі');
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true); // Індикатор завантаження
  
  const location = useLocation();
  const categories = ["Всі", "Логопед", "Дефектолог", "Психолог", "Сурдопедагог"];

  // 1. ЗАВАНТАЖЕННЯ ДАНИХ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllDoctors();
        setDoctors(data);
        setFilteredDoctors(data); // Спочатку показуємо всіх
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. ФІЛЬТРАЦІЯ (оновлена логіка)
  useEffect(() => {
    // Встановлюємо фільтр з URL
    const searchParams = new URLSearchParams(location.search);
    const categoryFromUrl = searchParams.get('category');
    if (categoryFromUrl && categories.includes(categoryFromUrl)) {
      setFilter(categoryFromUrl);
    } else {
      setFilter('Всі');
    }
  }, [location.search]);

  useEffect(() => {
    if (doctors.length === 0) return;

    if (filter === 'Всі') {
      setFilteredDoctors(doctors);
    } else {
      setFilteredDoctors(doctors.filter(doc => doc.profession === filter));
    }
  }, [filter, doctors]);

  if (loading) return <div className="loading">Завантаження лікарів...</div>;

  return (
    <div className="doctors-page">
      <div className="container">
        
        {/* Заголовок і опис */}
        <div className="doctors-header">
          <h1>Наші спеціалісти</h1>
          <p>Оберіть фахівця, який допоможе вам або вашій дитині досягти успіху.</p>
        </div>

        {/* Панель фільтрів */}
        <div className="filter-panel">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Сітка карток */}
        <div className="doctors-grid">
          {filteredDoctors.length > 0 ? (
            filteredDoctors.map((doctor) => (
              <Link to={`/doctor/${doctor.id}`} key={doctor.id} className="doctor-card-link">
                <div className="doctor-card">


                  <div className="doctor-image-wrapper">
                    <img src={doctor.image} alt={`${doctor.name} ${doctor.surname}`} />
                  </div>

                  <div className="doctor-info">
                    <span className="doctor-profession">{doctor.profession}</span>
                    <h3 className="doctor-name">{doctor.name} {doctor.surname}</h3>
                    <p className="doctor-exp">{doctor.experience}</p>
                    
                    <button className="btn-details">
                      Записатися
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="no-results">
              <p>На жаль, у цій категорії поки немає лікарів.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AllDoctors;