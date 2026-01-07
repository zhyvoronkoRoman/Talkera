import React, { useState, useEffect } from 'react';
import { updateUserProfile, getMyAppointments, cancelAppointment } from '../../api/auth'; // Імпортуємо функції
import './Profile.css';

const ProfileScreen = ({ user, onUserUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Для блокування кнопки
  const [appointments, setAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    avatarUrl: '/src/assets/profile.jpg'
  });

  // Заповнюємо дані при завантаженні
  useEffect(() => {
    if (user) {
      setUserData(prev => ({
        ...prev,
        firstName: user.firstName || '', // Важливо: backend віддає firstName
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phoneNumber || '',   // Мапимо phoneNumber -> phone
        gender: user.sex || '',
        dob: user.birthDate || ''        // Мапимо birthDate -> dob
      }));
    }
  }, [user]);

  // Завантажуємо записи при ініціалізації
  useEffect(() => {
    const loadAppointments = async () => {
      if (user) {
        try {
          const token = localStorage.getItem('authToken');
          const appointmentsData = await getMyAppointments(token);
          setAppointments(appointmentsData);
        } catch (error) {
          console.error("Помилка завантаження записів:", error);
        } finally {
          setAppointmentsLoading(false);
        }
      }
    };

    loadAppointments();
  }, [user]);

  // Записи тепер завантажуються з API

  // Функція для скасування бронювання
  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm('Ви впевнені, що хочете скасувати цей запис?')) {
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await cancelAppointment(appointmentId, token);

      // Оновлюємо список записів після скасування
      const updatedAppointments = await getMyAppointments(token);
      setAppointments(updatedAppointments);

      alert('Запис успішно скасовано!');
    } catch (error) {
      console.error('Помилка скасування запису:', error);
      alert('Не вдалося скасувати запис. Спробуйте ще раз.');
    }
  };

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handlePhoneChange = (value) => {
    const digitsOnly = value.replace(/\D/g, '');
    const limitedDigits = digitsOnly.slice(0, 12);
    setUserData({ ...userData, phone: limitedDigits });
  };

  // --- ГОЛОВНА ЗМІНА ТУТ ---
  const saveProfile = async () => {
    setIsLoading(true);
    try {
      // 1. Беремо токен
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error("Ви не авторизовані");

      // 2. Готуємо дані для Java (Java чекає birthDate, а не dob)
      const payload = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phone,
        gender: userData.gender, // Це буде відображено як "sex" в backend
        birthDate: userData.dob || null // Якщо пустий рядок, віддаємо null
      };

      // 3. Відправляємо на сервер
      const updatedUser = await updateUserProfile(token, payload);

      console.log("Оновлено:", updatedUser);

      // 4. Оновлюємо дані користувача в App.jsx
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      setIsEditing(false);
      alert("Дані успішно збережено в базу!");

    } catch (error) {
      console.error("Помилка збереження:", error);
      alert("Не вдалося зберегти зміни. Перевірте консоль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="profile-container">
      {/* ... ВЕРХНЯ ЧАСТИНА ... */}
      <div className="profile-header">
        <div className="profile-header-content">
          <div className="avatarContainer">
             <img src={userData.avatarUrl} alt="Аватар" className="avatar" />
          </div>
          
          <div className="profile-info">
            <h2 className="userName">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="userEmail">{userData.email}</p>
          </div>
        </div>

        <div className="actionButtonContainer">
          {isEditing ? (
            <button 
                className="buttonPrimary" 
                onClick={saveProfile}
                disabled={isLoading} // Блокуємо кнопку поки йде запит
            >
              {isLoading ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          ) : (
            <button className="buttonOutline" onClick={() => setIsEditing(true)}>
              Редагувати
            </button>
          )}
        </div>
      </div>

      {/* ... РЕШТА КОМПОНЕНТА БЕЗ ЗМІН ... */}
      {/* Переконайтеся, що ProfileField використовує правильні ключі зі стейту */}
      <div className="sectionContainer">
        <h3 className="sectionTitle">Особисті дані</h3>
        
        <ProfileField label="Ім'я" value={userData.firstName} isEditing={isEditing} onChange={(t) => handleInputChange('firstName', t)} />
        <ProfileField label="Прізвище" value={userData.lastName} isEditing={isEditing} onChange={(t) => handleInputChange('lastName', t)} />
        {/* Пошта зазвичай не редагується, тому можна прибрати isEditing або зробити поле disabled */}
        <ProfileField label="Пошта" value={userData.email} isEditing={false} type="email" /> 
        
        <PhoneField label="Номер телефону" value={userData.phone} isEditing={isEditing} placeholder="380XXXXXXXXX" onChange={handlePhoneChange} />
        <GenderField label="Стать" value={userData.gender} isEditing={isEditing} onChange={(t) => handleInputChange('gender', t)} />
        <ProfileField label="Дата народження" value={userData.dob} isEditing={isEditing} type="date" onChange={(t) => handleInputChange('dob', t)} />
      </div>

      {/* ... ЗАПИСИ ... */}
       <div className="sectionContainer">
        <h3 className="sectionTitle">Мої записи</h3>
        {appointmentsLoading ? (
          <p>Завантаження записів...</p>
        ) : appointments.length > 0 ? (
          <div className="historyList">
            {appointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
              />
            ))}
          </div>
        ) : (
          <p className="no-appointments">У вас поки немає записів</p>
        )}
      </div>
    </div>
  );
};

// ... Допоміжні компоненти (ProfileField і т.д.) залишаємо без змін ...
// Тільки переконайтеся, що ви їх додали в кінець файлу
const ProfileField = ({ label, value, isEditing, onChange, type = 'text', placeholder = '' }) => (
  <div className="fieldContainer">
    <label className="label">{label}</label>
    {isEditing ? (
      <input 
        className="input" 
        type={type}
        value={value} 
        onChange={(e) => onChange && onChange(e.target.value)} 
        placeholder={placeholder}
        disabled={!onChange} // Якщо функція не передана (як для пошти)
      />
    ) : (
      <p className="valueText" style={!value ? { color: '#ccc', fontStyle: 'italic' } : {}}>
        {value || 'Не вказано'}
      </p>
    )}
  </div>
);

// PhoneField, GenderField, HistoryCard - залишаємо ваші
const PhoneField = ({ label, value, isEditing, onChange, placeholder = '' }) => {
    const formatPhone = (phone) => {
        if (!phone) return '';
        if (phone.length <= 3) return `+${phone}`;
        if (phone.length <= 5) return `+${phone.slice(0, 3)} ${phone.slice(3)}`;
        if (phone.length <= 8) return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5)}`;
        return `+${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 8)} ${phone.slice(8)}`;
    };

    return (
        <div className="fieldContainer">
        <label className="label">{label}</label>
        {isEditing ? (
            <input 
            className="input" 
            type="tel"
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder={placeholder}
            maxLength={12}
            />
        ) : (
            <p className="valueText" style={!value ? { color: '#ccc', fontStyle: 'italic' } : {}}>
            {value ? formatPhone(value) : 'Не вказано'}
            </p>
        )}
        </div>
    );
};

const GenderField = ({ label, value, isEditing, onChange }) => (
  <div className="fieldContainer">
    <label className="label">{label}</label>
    {isEditing ? (
      <select 
        className="input" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Оберіть стать</option>
        <option value="Чоловіча">Чоловіча</option>
        <option value="Жіноча">Жіноча</option>
      </select>
    ) : (
      <p className="valueText" style={!value ? { color: '#ccc', fontStyle: 'italic' } : {}}>
        {value || 'Не вказано'}
      </p>
    )}
  </div>
);

const AppointmentCard = ({ appointment, onCancel }) => {
  // Діагностика: перевіримо, які дані приходять
  console.log('Appointment data:', appointment);
  console.log('Doctor data:', appointment.doctor);

  const getStatusColor = (status) => {
    switch(status) {
      case 'BOOKED': return '#007BFF';
      case 'COMPLETED': return '#28A745';
      case 'CANCELLED': return '#DC3545';
      default: return '#888';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'BOOKED': return 'Заплановано';
      case 'COMPLETED': return 'Завершено';
      case 'CANCELLED': return 'Скасовано';
      default: return status;
    }
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const color = getStatusColor(appointment.status);
  const canCancel = appointment.status === 'BOOKED';

  return (
    <div className="historyCard">
      <div className="historyInfo">
        <p className="historyDoctor">
          {appointment.doctor?.user?.firstName} {appointment.doctor?.user?.lastName}
          ({appointment.doctor?.specialization || appointment.doctor?.profession || 'Лікар'})
        </p>
        <p className="historyDate">{formatDateTime(appointment.dateTime)}</p>
      </div>
      <div className="appointmentActions">
        <div className="badge" style={{ backgroundColor: color + '20' }}>
          <span className="badgeText" style={{ color: color }}>
            {getStatusText(appointment.status)}
          </span>
        </div>
        {canCancel && (
          <button
            className="cancelBtn"
            onClick={() => onCancel(appointment.id)}
          >
            Скасувати
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;