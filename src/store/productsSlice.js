import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getProducts, getProductById, getProductBySku } from '../api/ProductApi.js';

const norm = (v) => String(v ?? '').trim().toLowerCase();

/** Уніфікатор товару для стору */
const normalizeProduct = (x = {}) => ({
    id:          x.id ?? x._id ?? x.productId ?? x.itemId,
    sku:         x.sku ?? x.code ?? '',
    title:       x.title ?? x.name ?? '',
    price:       Number(x.price ?? 0),
    promoPrice:  x.promoPrice != null ? Number(x.promoPrice) : undefined,
    brand:       x.brand ?? '',
    category:    x.category ?? x.cat ?? '',
    image:       x.image ?? x.photo ?? '',
    thumb:       x.thumb ?? x.image ?? '',
    description: x.description ?? x.desc ?? '',
    descriptionHtml: x.descriptionHtml ?? '',
    isAvailable: x.isAvailable == null ? true : !!x.isAvailable,
});

/* ========================== THUNKS ========================== */

export const fetchProducts = createAsyncThunk(
    'products/fetch',
    async (params = {}, { signal }) => {
        // Всюди використовуємо namespace `shop`
        const data = await getProducts({ site: 'shop', ...params }, { signal });
        const items = (data.items || []).map(normalizeProduct);
        return {
            items,
            total: Number(data.total ?? items.length ?? 0),
            page:  Number(data.page ?? params.page ?? 1),
            limit: Number(data.limit ?? params.limit ?? 12),
            sort:  data.sort ?? params.sort ?? 'createdAt',
            dir:   data.dir  ?? params.dir  ?? 'desc',
        };
    }
);

export const fetchProduct = createAsyncThunk(
    'products/fetchOne',
    async (id, { signal }) => {
        const p = await getProductById(id, { signal });
        return normalizeProduct(p);
    }
);

export const fetchProductBySku = createAsyncThunk(
    'products/fetchOneBySku',
    async (sku, { signal }) => {
        const p = await getProductBySku(sku, { signal });
        if (!p) throw new Error('Товар не знайдено');
        return normalizeProduct(p);
    }
);

/* ========================== SLICE ========================== */

const initialState = {
    items: [],
    total: 0,
    page: 1,
    limit: 12,
    sort: 'createdAt',
    dir: 'desc',
    status: 'idle',
    error: null,
    lastQuery: {},

    current: null,
    currentStatus: 'idle',
    currentError: null,
};

const slice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        clearCurrent(s) {
            s.current = null;
            s.currentStatus = 'idle';
            s.currentError = null;
        }
    },
    extraReducers: (b) => {
        /* ---- list ---- */
        b.addCase(fetchProducts.pending, (s, { meta }) => {
            s.status = 'loading';
            s.error = null;
            const arg = meta?.arg || {};

            const prev = s.lastQuery || {};
            const keys = [
                'q', 'page', 'limit', 'sort', 'dir',
                'category', 'brandId', 'site', 'availableOnly', // 👈
            ];
            const changed = keys.some(k => String(prev[k] ?? '') !== String(arg[k] ?? (k === 'site' ? 'shop' : '')));

            if (changed) {
                s.items = [];
                s.page = Number(arg.page ?? 1);
            }
        });

        b.addCase(fetchProducts.fulfilled, (s, { payload, meta }) => {
            s.status = 'succeeded';
            s.items = payload.items || [];
            s.total = Number(payload.total ?? s.items.length ?? 0);
            s.page  = Number(payload.page ?? 1);
            s.limit = Number(payload.limit ?? s.limit ?? 12);
            s.sort  = payload.sort ?? s.sort;
            s.dir   = payload.dir  ?? s.dir;
            s.lastQuery = meta?.arg || {};
        });

        b.addCase(fetchProducts.rejected, (s, a) => {
            s.status = 'failed';
            s.error = a.error?.message || 'Не вдалося завантажити товари';
            s.items = [];
            s.total = 0;
        });

        /* ---- by sku ---- */
        b.addCase(fetchProductBySku.pending, (s) => {
            s.currentStatus = 'loading';
            s.currentError = null;
        });
        b.addCase(fetchProductBySku.fulfilled, (s, { payload }) => {
            s.currentStatus = 'succeeded';
            s.current = payload || null;
        });
        b.addCase(fetchProductBySku.rejected, (s, a) => {
            s.currentStatus = 'failed';
            s.currentError = a.error?.message || 'Не вдалося завантажити товар';
            s.current = null;
        });

        /* ---- by id ---- */
        b.addCase(fetchProduct.pending, (s) => {
            s.currentStatus = 'loading';
            s.currentError = null;
        });
        b.addCase(fetchProduct.fulfilled, (s, { payload }) => {
            s.currentStatus = 'succeeded';
            s.current = payload || null;
        });
        b.addCase(fetchProduct.rejected, (s, a) => {
            s.currentStatus = 'failed';
            s.currentError = a.error?.message || 'Не вдалося завантажити товар';
            s.current = null;
        });
    }
});

export const { clearCurrent } = slice.actions;
export default slice.reducer;

/* ========================== SELECTORS ========================== */

export const selectProducts             = (s) => s.products.items;
export const selectProductsStatus       = (s) => s.products.status;
export const selectProductsError        = (s) => s.products.error;
export const selectProductsTotal        = (s) => s.products.total;
export const selectProductsPage         = (s) => s.products.page;
export const selectProductsLimit        = (s) => s.products.limit;
export const selectProductsSort         = (s) => s.products.sort;
export const selectProductsDir          = (s) => s.products.dir;

export const selectProductsMeta = (s) => ({
    total:  s.products.total,
    page:   s.products.page,
    limit:  s.products.limit,
    sort:   s.products.sort,
    dir:    s.products.dir,
    status: s.products.status,
    error:  s.products.error,
});

export const selectCurrentProduct       = (s) => s.products.current;
export const selectCurrentProductStatus = (s) => s.products.currentStatus;

export const selectProductBySku = (sku) => (s) => {
    if (!sku) return null;
    const n = norm(sku);
    return (s.products.items || []).find(p => norm(p?.sku) === n) || null;
};
