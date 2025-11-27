// src/store/cartSlice.js
import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import { getCart, addToCart, patchCartQty, deleteCartItem, clearCart } from '../api/CartApi';

// ===== async actions =====
export const loadCart = createAsyncThunk('cart/load', async (_, { signal }) => {
    const data = await getCart({ signal });
    return data.items || [];
});

export const addToCartRemote = createAsyncThunk('cart/add', async (payload, { signal }) => {
    const data = await addToCart(payload, { signal });
    return data.items || [];
});

export const setCartQtyRemote = createAsyncThunk('cart/setQty', async ({ id, qty }, { signal }) => {
    const data = await patchCartQty(id, qty, { signal });
    return data.items || [];
});

export const removeFromCartRemote = createAsyncThunk('cart/remove', async (id, { signal }) => {
    const data = await deleteCartItem(id, { signal });
    return data.items || [];
});

export const clearCartRemote = createAsyncThunk('cart/clear', async (_, { signal }) => {
    const data = await clearCart({ signal });
    return data.items || [];
});

// ===== slice =====
const slice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (b) => {
        const pending = (s) => { s.status = 'loading'; s.error = null; };
        const fulfilled = (s, { payload }) => { s.status = 'succeeded'; s.items = payload; };
        const rejected = (s, a) => { s.status = 'failed'; s.error = a.error?.message || 'Cart error'; };

        b.addCase(loadCart.pending, pending).addCase(loadCart.fulfilled, fulfilled).addCase(loadCart.rejected, rejected);
        b.addCase(addToCartRemote.pending, pending).addCase(addToCartRemote.fulfilled, fulfilled).addCase(addToCartRemote.rejected, rejected);
        b.addCase(setCartQtyRemote.pending, pending).addCase(setCartQtyRemote.fulfilled, fulfilled).addCase(setCartQtyRemote.rejected, rejected);
        b.addCase(removeFromCartRemote.pending, pending).addCase(removeFromCartRemote.fulfilled, fulfilled).addCase(removeFromCartRemote.rejected, rejected);
        b.addCase(clearCartRemote.pending, pending).addCase(clearCartRemote.fulfilled, fulfilled).addCase(clearCartRemote.rejected, rejected);
    },
});

export default slice.reducer;

// ===== selectors =====
export const selectCartItems = (s) => s.cart.items;
export const selectCartStatus = (s) => s.cart.status;

export const selectTotals = createSelector([selectCartItems], (items) =>
    items.reduce(
        (acc, c) => {
            const price = Number(c.price) || 0;
            const qty = Math.max(1, Number(c.qty) || 1);
            acc.sum += price * qty;
            acc.qty += qty;
            return acc;
        },
        { sum: 0, qty: 0 }
    )
);
