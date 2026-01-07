import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDoctorById, getAllAvailableSlots, createAppointment } from '../../api/auth'; // Імпорт
import './DoctorDetails.css';

const DoctorDetails = ({ user, onOpenRegistration }) => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Завантажуємо інформацію про лікаря
        const doctorData = await getDoctorById(id);
        setDoctor(doctorData);

        // Завантажуємо всі доступні слоти
        const slots = await getAllAvailableSlots(id);
        setAvailableSlots(slots);
      } catch (error) {
        console.error("Не вдалося завантажити дані", error);
        setAvailableSlots([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Групуємо слоти за датами
  const groupSlotsByDate = (slots) => {
    const grouped = {};
    slots.forEach(slot => {
      const date = new Date(slot.dateTime).toLocaleDateString('uk-UA', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(slot);
    });
    return grouped;
  };

  const groupedSlots = groupSlotsByDate(availableSlots);

  const handleBooking = async () => {
    if (!user) {
      onOpenRegistration();
      return;
    }
    if (!selectedSlot) {
      alert("Оберіть час!");
      return;
    }

    // Перевіряємо наявність токена
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert("Ви не авторизовані. Увійдіть в систему.");
      onOpenRegistration();
      return;
    }

    try {
      const appointmentData = {
        doctorId: parseInt(id),
        dateTime: selectedSlot.dateTime
      };

      console.log("Надсилаємо дані бронювання:", appointmentData);
      console.log("Токен присутній:", !!token);

      // Надсилаємо запит на створення запису
      await createAppointment(appointmentData, token);

      alert(`Запис до ${doctor.name} ${doctor.surname} на ${new Date(selectedSlot.dateTime).toLocaleString('uk-UA')} успішний!`);

      // Перезавантажуємо всі слоти після бронювання
      const slots = await getAllAvailableSlots(id);
      setAvailableSlots(slots);

      // Скидаємо вибір
      setSelectedSlot(null);

    } catch (error) {
      console.error("Помилка бронювання:", error);
      alert("Не вдалося створити запис. Спробуйте ще раз.");
    }
  };

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!doctor) return <div className="loading">Лікаря не знайдено.</div>;

  return (
    <div className="details-page">
      <div className="container">
        
        <Link to="/doctors" className="back-link">← Назад до списку</Link>

        <div className="doctor-profile-grid">
          
          {/* Ліва колонка: Фото та основна інфо */}
          <div className="profile-sidebar">
            <div className="profile-image-box">
              <img src={doctor.image} alt={doctor.surname} />
            </div>
            <div className="profile-summary">
              <span className="profession-badge">{doctor.profession}</span>
              <h2>{doctor.name} {doctor.surname}</h2>
              <p className="experience">Досвід роботи: {doctor.experience}</p>
              <div className="price-tag">
                {doctor.price} грн <span>/ сеанс</span>
              </div>
            </div>
          </div>

          {/* Права колонка: Деталі та Запис */}
          <div className="profile-content">
            
            {/* Блок інформації */}
            <section className="info-section">
              <h3>Освіта та кваліфікація</h3>
              <p className="education-text">{doctor.education}</p>
              
              <h3>Про себе</h3>
              <p className="about-text">{doctor.about}</p>
            </section>

            {/* Блок запису (Слоти) */}
            <section className="booking-section">
              <h3>📅 Доступні слоти для запису</h3>
              <p className="booking-hint">Оберіть зручну дату та годину:</p>

              {/* Вибір часу за датами */}
              <div className="slots-by-date">
                {Object.keys(groupedSlots).length > 0 ? (
                  Object.entries(groupedSlots).map(([date, slots]) => (
                    <div key={date} className="date-group">
                      <h4 className="date-header">{date}</h4>
                      <div className="hours-grid">
                        {slots.map((slot) => {
                          // Форматуємо час для відображення (HH:MM)
                          const timeString = new Date(slot.dateTime).toLocaleTimeString('uk-UA', {
                            hour: '2-digit',
                            minute: '2-digit'
                          });

                          return (
                            <button
                              key={slot.id}
                              className={`time-btn ${selectedSlot && selectedSlot.id === slot.id ? 'active' : ''}`}
                              onClick={() => setSelectedSlot(slot)}
                            >
                              {timeString}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-slots">Немає доступних слотів для запису</p>
                )}
              </div>

              {/* Кнопка дії */}
              <div className="booking-action">
                <button
                  className="btn-book-now"
                  disabled={!selectedSlot || availableSlots.length === 0}
                  onClick={handleBooking}
                >
                  {availableSlots.length === 0
                    ? "Немає доступних слотів"
                    : selectedSlot
                      ? `Записатися на ${new Date(selectedSlot.dateTime).toLocaleTimeString('uk-UA', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}`
                      : "Оберіть час"}
                </button>
              </div>

            </section>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;