import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'cart',
  initialState: { items: [] },
  reducers: {
    addItem(state, { payload }) {
      const f = state.items.find(x => x.id === payload.id);
      if (f) f.qty += payload.qty || 1;
      else state.items.push({ ...payload, qty: payload.qty || 1 });
    },
    removeItem(state, { payload }) { state.items = state.items.filter(x => x.id !== payload); },
    setQty(state, { payload }) {
      const it = state.items.find(x => x.id === payload.id);
      if (it) it.qty = Math.max(1, payload.qty);
    },
    clear(state){ state.items = []; }
  }
});

export const { addItem, removeItem, setQty, clear } = slice.actions;
export const selectCart = s => s.cart.items;
export const selectTotals = s => {
  const sum = s.cart.items.reduce((a,c)=>a + c.price*c.qty, 0);
  const qty = s.cart.items.reduce((a,c)=>a + c.qty, 0);
  return { sum, qty };
};
export default slice.reducer;
