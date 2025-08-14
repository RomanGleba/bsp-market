import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'auth',
  initialState: { user: JSON.parse(localStorage.getItem('user') || 'null'), token: localStorage.getItem('token') || '' },
  reducers: {
    setAuth(state, { payload }) {
      state.user = payload.user; state.token = payload.token;
      localStorage.setItem('user', JSON.stringify(payload.user));
      localStorage.setItem('token', payload.token);
    },
    logout(state) { state.user = null; state.token = ''; localStorage.removeItem('user'); localStorage.removeItem('token'); }
  }
});
export const { setAuth, logout } = slice.actions;
export const selectUser = s => s.auth.user;
export default slice.reducer;
