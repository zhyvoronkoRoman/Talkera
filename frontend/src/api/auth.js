// src/api/auth.js

const API_URL = 'http://localhost:8080/api/auth';
//Реєстрація
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'Помилка реєстрації');
    }
    return await response.text();
  } catch (error) {
    throw error;
  }
};
//Логін
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      throw new Error('Невірний email або пароль');
    }
    return await response.json(); // Повертає { token: "..." }
  } catch (error) {
    throw error;
  }
};
//Дістаємо профіль користувача
export const getProfile = async (token) => {
  const response = await fetch('http://localhost:8080/api/users/profile', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Обов'язково додаємо токен!
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Не вдалося отримати профіль');
  }
  return await response.json();
};

//Оновлюємо профіль користувача
export const updateUserProfile = async (token, userData) => {
  const response = await fetch('http://localhost:8080/api/users/profile', {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error('Не вдалося оновити профіль');
  }
  return await response.json();
};

// --- API для лікарів ---
const DOCTORS_API_URL = 'http://localhost:8080/api/doctors';

export const getAllDoctors = async () => {
  const response = await fetch(DOCTORS_API_URL);
  if (!response.ok) throw new Error('Failed to fetch doctors');
  return await response.json();
};

export const getDoctorById = async (id) => {
  const response = await fetch(`${DOCTORS_API_URL}/${id}`);
  if (!response.ok) throw new Error('Failed to fetch doctor details');
  return await response.json();
};

// --- API для слотів запису ---
const SLOTS_API_URL = 'http://localhost:8080/api/slots';

export const getAvailableSlots = async (doctorId, date) => {
  const response = await fetch(`${SLOTS_API_URL}/doctor/${doctorId}/available?date=${date}`);
  if (!response.ok) throw new Error('Failed to fetch available slots');
  return await response.json();
};

export const getAllAvailableSlots = async (doctorId) => {
  const response = await fetch(`${SLOTS_API_URL}/doctor/${doctorId}/available/all`);
  if (!response.ok) throw new Error('Failed to fetch all available slots');
  return await response.json();
};

// --- API для записів (appointments) ---
const APPOINTMENTS_API_URL = 'http://localhost:8080/api/appointments';

// --- API для Google OAuth2 ---
export const googleLogin = async (googleToken) => {
  const response = await fetch(`${API_URL}/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: googleToken }),
  });

  if (!response.ok) {
    throw new Error('Помилка входу через Google');
  }
  return await response.json(); // Отримаємо наш внутрішній токен і дані юзера
};

export const createAppointment = async (appointmentData, token) => {
  const response = await fetch(APPOINTMENTS_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(appointmentData),
  });
  if (!response.ok) throw new Error('Failed to create appointment');
  return await response.json();
};

export const cancelAppointment = async (appointmentId, token) => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/${appointmentId}/cancel`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to cancel appointment');
  return await response.json();
};

export const getMyAppointments = async (token) => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch appointments');
  return await response.json();
};

export const getMyUpcomingAppointments = async (token) => {
  const response = await fetch(`${APPOINTMENTS_API_URL}/my/upcoming`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch upcoming appointments');
  return await response.json();
};

export const generateWeeklySlots = async (doctorId, token) => {
  const response = await fetch(`${SLOTS_API_URL}/doctor/${doctorId}/generate-weekly`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to generate slots');
  return await response.json();
};

// --- API для контактної форми ---
const CONTACT_API_URL = 'http://localhost:8080/api/contact';

export const sendContactMessage = async (contactData) => {
  const response = await fetch(`${CONTACT_API_URL}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(contactData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to send contact message');
  }

  return await response.text();
};

// --- API для відгуків ---
const REVIEWS_API_URL = 'http://localhost:8080/api/reviews';

export const getAllReviews = async () => {
  const response = await fetch(REVIEWS_API_URL);
  if (!response.ok) throw new Error('Failed to fetch reviews');
  return await response.json();
};

export const createReview = async (reviewData) => {
  const response = await fetch(REVIEWS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || 'Failed to create review');
  }

  return await response.json();
};