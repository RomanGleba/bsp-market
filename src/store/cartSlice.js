// src/store/cartSlice.js
import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import { getCart, addToCart, patchCartQty, deleteCartItem, clearCart } from '../api/CartApi.js';


export const loadCart = createAsyncThunk('cart/load', async (_arg, { signal }) => {
    const data = await getCart({ signal });
    return data.items || [];
});
export const addToCartRemote = createAsyncThunk('cart/add', async (payload, { signal }) => {
    const data = await addToCart(payload, { signal });
    return data.items || [];
});
export const setCartQty = createAsyncThunk('cart/setQty', async ({ id, qty }, { signal }) => {
    const data = await patchCartQty(id, qty, { signal });
    return data.items || [];
});
export const removeFromCart = createAsyncThunk('cart/remove', async (id, { signal }) => {
    const data = await deleteCartItem(id, { signal });
    return data.items || [];
});
export const clearCartRemote = createAsyncThunk('cart/clearRemote', async (_arg, { signal }) => {
    const data = await clearCart({ signal });
    return data.items || [];
});

const slice = createSlice({
    name: 'cart',
    initialState: { items: [], status: 'idle', error: null },
    reducers: {
        addItem(state, { payload }) {
            const f = state.items.find(x => x.id === payload.id);
            if (f) f.qty += Number(payload.qty) || 1;
            else state.items.push({ ...payload, qty: Number(payload.qty) || 1 });
        },
        removeItem(state, { payload }) { state.items = state.items.filter(x => x.id !== payload); },
        setQty(state, { payload }) { const it = state.items.find(x => x.id === payload.id); if (it) it.qty = Math.max(1, Number(payload.qty) || 1); },
        clear(state) { state.items = []; },
    },
    extraReducers: (b) => {
        const pend = (s) => { s.status = 'loading'; s.error = null; };
        const rej  = (s, a) => { s.status = 'failed'; s.error = a.error?.message || 'Помилка кошика'; };
        b.addCase(loadCart.pending, pend);
        b.addCase(loadCart.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.items = payload; });
        b.addCase(loadCart.rejected, rej);
        b.addCase(addToCartRemote.pending, pend);
        b.addCase(addToCartRemote.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.items = payload; });
        b.addCase(addToCartRemote.rejected, rej);
        b.addCase(setCartQty.pending, pend);
        b.addCase(setCartQty.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.items = payload; });
        b.addCase(setCartQty.rejected, rej);
        b.addCase(removeFromCart.pending, pend);
        b.addCase(removeFromCart.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.items = payload; });
        b.addCase(removeFromCart.rejected, rej);
        b.addCase(clearCartRemote.pending, pend);
        b.addCase(clearCartRemote.fulfilled, (s, { payload }) => { s.status = 'succeeded'; s.items = payload; });
        b.addCase(clearCartRemote.rejected, rej);
    }
});

export const { addItem, removeItem, setQty, clear } = slice.actions;
export default slice.reducer;

export const selectCartItems  = s => s.cart.items;
export const selectCartStatus = s => s.cart.status;

export const selectTotals = createSelector([selectCartItems], (items) =>
    items.reduce((acc, c) => {
        const price = Number(c.price) || 0;
        const qty   = Number(c.qty)   || 0;
        acc.sum += price * qty; acc.qty += qty; return acc;
    }, { sum: 0, qty: 0 })
);
