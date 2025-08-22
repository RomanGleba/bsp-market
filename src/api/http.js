// src/api/http.js
import axios from 'axios';

const http = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
    timeout: 15000,
    withCredentials: true, // ← лиши true, якщо бек віддає cookie-сесію; інакше можеш вимкнути
    headers: { 'Content-Type': 'application/json' },
});

// (опційно) підставляємо Bearer-токен з localStorage
http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); // змінй на свій спосіб зберігання
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// (опційно) нормалізуємо помилки
http.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg = err?.response?.data?.message || err.message || 'Network error';
        err.message = Array.isArray(msg) ? msg.join(', ') : msg;
        return Promise.reject(err);
    }
);

export default http;
