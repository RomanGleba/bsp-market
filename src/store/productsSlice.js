// src/store/productsSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { products as mockRaw } from '../data/product';
import { getProducts, getProductById, getProductBySku } from '../api/ProductApi.js';

// --- helpers ---
const norm = (v) => String(v ?? '').trim().toLowerCase();

const normalizeProduct = (x = {}) => ({
    id:          x.id ?? x._id ?? x.productId ?? x.itemId,
    sku:         x.sku ?? x.code ?? '',
    title:       x.title ?? x.name ?? '',         // уніфікуємо під title
    price:       Number(x.price ?? 0),
    promoPrice:  x.promoPrice != null ? Number(x.promoPrice) : undefined,
    stock:       x.stock != null ? Number(x.stock) : undefined,
    brand:       x.brand ?? '',
    category:    x.category ?? x.cat ?? '',
    image:       x.image ?? x.photo ?? '',
    thumb:       x.thumb ?? x.image ?? '',
    description: x.description ?? x.desc ?? '',
});

const mock = (mockRaw || []).map(normalizeProduct);

// --- thunks ---
export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async (params = {}, { signal }) => {
        try {
            // 1) пробуємо реальне API
            const data = await getProducts(params, { signal });
            // очікується { items, total, page, limit } — вже нормалізовано в ProductApi
            return data;
        } catch {
            // 2) fallback: mock + лише пошук/сортування (без нарізки, бо клієнт пагінує)
            const { q = '', cat, brand, kind, sort } = params;
            let data = [...mock];

            if (q) {
                const nq = norm(q);
                data = data.filter(p =>
                    norm(p.title).includes(nq) ||
                    norm(p.description).includes(nq) ||
                    norm(p.sku).includes(nq)
                );
            }
            if (cat)   data = data.filter(p => norm(p.category) === norm(cat));
            if (brand) data = data.filter(p => norm(p.brand) === norm(brand));
            if (kind)  data = data.filter(p => norm(p.kind) === norm(kind));

            switch (sort) {
                case 'price-asc':  data.sort((a,b)=>(+a.price||0) - (+b.price||0)); break;
                case 'price-desc': data.sort((a,b)=>(+b.price||0) - (+a.price||0)); break;
                case 'name-asc':   data.sort((a,b)=>norm(a.title).localeCompare(norm(b.title))); break;
                case 'name-desc':  data.sort((a,b)=>norm(b.title).localeCompare(norm(a.title))); break;
                default: break;
            }

            return { items: data, total: data.length, page: 1, limit: data.length };
        }
    }
);

export const fetchProduct = createAsyncThunk(
    'products/fetchOne',
    async (id, { signal, rejectWithValue }) => {
        try {
            const p = await getProductById(id, { signal });
            return normalizeProduct(p);
        } catch {
            const found = mock.find(p => String(p.id) === String(id));
            if (!found) return rejectWithValue('Товар не знайдено');
            return found;
        }
    }
);

export const fetchProductBySku = createAsyncThunk(
    'products/fetchOneBySku',
    async (sku, { signal, rejectWithValue }) => {
        try {
            const p = await getProductBySku(sku, { signal });
            if (!p) return rejectWithValue('Товар не знайдено');
            return normalizeProduct(p);
        } catch {
            const nsku = norm(sku);
            const found = mock.find(p => norm(p.sku) === nsku);
            if (!found) return rejectWithValue('Товар не знайдено');
            return found;
        }
    }
);

// --- state ---
const initialState = {
    items: [], total: 0, page: 1, limit: 12, status: 'idle', error: null, lastQuery: {},
    current: null, currentStatus: 'idle', currentError: null,
};

// --- slice ---
const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrent(s){ s.current=null; s.currentStatus='idle'; s.currentError=null; }
    },
    extraReducers: (b)=>{
        b.addCase(fetchProducts.pending, (s,{meta})=>{
            s.status='loading'; s.error=null;
            const arg = meta?.arg || {};
            const changed = arg.q!==s.lastQuery.q || arg.cat!==s.lastQuery.cat ||
                arg.brand!==s.lastQuery.brand || arg.kind!==s.lastQuery.kind ||
                arg.sort!==s.lastQuery.sort;
            if (changed){ s.items=[]; s.page = arg.page ?? 1; }
        });
        b.addCase(fetchProducts.fulfilled, (s,{payload,meta})=>{
            s.status='succeeded';
            s.items = payload.items || [];
            s.total = payload.total || s.items.length;
            s.page  = payload.page  || 1;
            s.limit = payload.limit ?? s.limit;
            s.lastQuery = meta?.arg || {};
        });
        b.addCase(fetchProducts.rejected, (s,a)=>{
            s.status='failed'; s.error=a.error?.message || 'Не вдалося завантажити товари';
        });

        b.addCase(fetchProductBySku.pending, (s)=>{ s.currentStatus='loading'; s.currentError=null; });
        b.addCase(fetchProductBySku.fulfilled, (s,{payload})=>{ s.currentStatus='succeeded'; s.current=payload||null; });
        b.addCase(fetchProductBySku.rejected, (s,a)=>{ s.currentStatus='failed'; s.currentError=a.payload||a.error?.message||'Не вдалося завантажити товар'; s.current=null; });

        b.addCase(fetchProduct.pending, (s)=>{ s.currentStatus='loading'; s.currentError=null; });
        b.addCase(fetchProduct.fulfilled, (s,{payload})=>{ s.currentStatus='succeeded'; s.current=payload||null; });
        b.addCase(fetchProduct.rejected, (s,a)=>{ s.currentStatus='failed'; s.currentError=a.payload||a.error?.message||'Не вдалося завантажити товар'; s.current=null; });
    }
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;

// selectors
export const selectProducts             = s => s.products.items;
export const selectProductsStatus       = s => s.products.status;
export const selectProductsError        = s => s.products.error;
export const selectProductsTotal        = s => s.products.total;
export const selectProductsPage         = s => s.products.page;
export const selectProductsLimit        = s => s.products.limit;
export const selectProductsMeta         = s => ({ total:s.products.total, page:s.products.page, limit:s.products.limit, status:s.products.status, error:s.products.error });
export const selectCurrentProduct       = s => s.products.current;
export const selectCurrentProductStatus = s => s.products.currentStatus;
export const selectProductBySku = (sku)=>(s)=>{
    if (!sku) return null; const n = norm(sku);
    return (s.products.items||[]).find(p => norm(p?.sku)===n) || null;
};
