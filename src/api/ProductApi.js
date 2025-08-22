// src/api/ProductApi.js
import http from './http';

/* ---------- helpers ---------- */
const normalizeProduct = (x = {}) => ({
    id:          x.id ?? x._id ?? x.productId ?? x.itemId,
    sku:         x.sku ?? x.code ?? x.SKU ?? '',
    title:       x.title ?? x.name ?? '',
    price:       Number(x.price ?? 0),
    promoPrice:  x.promoPrice != null ? Number(x.promoPrice) : undefined,
    stock:       x.stock != null ? Number(x.stock) : undefined,
    brand:       x.brand ?? x.manufacturer ?? '',
    category:    x.category ?? x.cat ?? '',
    image:       x.image ?? x.photo ?? x.thumb ?? '',
    thumb:       x.thumb ?? x.image ?? '',
    description: x.description ?? x.desc ?? '',
    attrs:       x.attrs ?? x.attributes ?? [],
});

const normalizeList = (data) => {
    // приймаємо і масив, і обгортки {items,...} або {data:{items,...}}
    const box = data?.data ?? data;
    const items = Array.isArray(box) ? box : (box?.items ?? box?.rows ?? []);
    return {
        items: (items || []).map(normalizeProduct),
        total: Number(box?.total ?? box?.count ?? items?.length ?? 0),
        page:  Number(box?.page ?? 1),
        limit: Number(box?.limit ?? box?.perPage ?? 12),
    };
};

/* ---------- API ---------- */

// GET /products?q=&page=&limit=&cat=&brand=&kind=&sort=
export async function getProducts(params = {}, { signal } = {}) {
    const { data } = await http.get('/products', { params, signal });
    const res = normalizeList(data);
    // Підставляємо запитані page/limit, якщо бек не повернув
    return {
        items: res.items,
        total: res.total,
        page:  res.page  || Number(params.page  ?? 1),
        limit: res.limit || Number(params.limit ?? 12),
    };
}

// GET /products/:id
export async function getProductById(id, { signal } = {}) {
    const { data } = await http.get(`/products/${encodeURIComponent(id)}`, { signal });
    const src = data?.data ?? data?.item ?? data?.product ?? data;
    return normalizeProduct(src);
}

// Варіанти маршруту на бекові:
// 1) GET /products/sku/:sku
// 2) або GET /products?sku=...
export async function getProductBySku(sku, { signal } = {}) {
    try {
        const { data } = await http.get(`/products/sku/${encodeURIComponent(sku)}`, { signal });
        const src = data?.data ?? data?.item ?? data?.product ?? data;
        return normalizeProduct(src);
    } catch (e) {
        // fallback на query-пошук
        const { data } = await http.get('/products', { params: { sku }, signal });
        const { items } = normalizeList(data);
        return items[0] ?? null;
    }
}
