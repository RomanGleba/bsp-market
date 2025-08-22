// src/store/authSlice.js
import { createSlice } from '@reduxjs/toolkit';

const safeParse = (str, fallback = null) => {
    try { return JSON.parse(str); } catch { return fallback; }
};

const initialState = {
    user: safeParse(localStorage.getItem('user'), null),
    token: localStorage.getItem('token') || '',
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, { payload }) {
            state.user = payload.user;
            state.token = payload.token;
            localStorage.setItem('user', JSON.stringify(payload.user));
            localStorage.setItem('token', payload.token);
        },
        logout(state) {
            state.user = null;
            state.token = '';
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
    },
});

export const { setAuth, logout } = slice.actions;
export default slice.reducer;

// selectors
export const selectUser   = (s) => s.auth.user;
export const selectToken  = (s) => s.auth.token;
export const selectIsAuth = (s) => Boolean(s.auth.token);
