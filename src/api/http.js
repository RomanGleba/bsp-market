// src/api/http.js
import axios from 'axios';

// Працює у Vite; без process.env, щоб не ловити ESLint (no-undef)
function resolveBaseURL() {
    const env = (typeof import.meta !== 'undefined' && import.meta.env) || {};
    const base =
        env.VITE_API_BASE_URL ||
        env.VITE_API_BASE ||
        env.REACT_APP_API_BASE_URL || // на всяк випадок при спільному коді з CRA
        env.REACT_APP_API_BASE ||
        'http://localhost:5000';
    return String(base).replace(/\/+$/, '');
}

const http = axios.create({
    baseURL: resolveBaseURL(),
    timeout: 15000,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

http.interceptors.request.use((config) => {
    try {
        const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch { /* no-op */ }
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            'Network error';
        err.message = Array.isArray(msg) ? msg.join(', ') : msg;
        return Promise.reject(err);
    }
);

export default http;
