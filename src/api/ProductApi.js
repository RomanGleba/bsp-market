// src/api/productApi.js
import http from './http';

/* ---------- helpers ---------- */
const normalizeProduct = (x = {}) => ({
    id:          x.id ?? x._id ?? x.productId ?? x.itemId,
    sku:         x.sku ?? x.code ?? x.SKU ?? '',
    title:       x.title ?? x.name ?? '',
    price:       Number(x.price ?? 0),
    promoPrice:  x.promoPrice != null ? Number(x.promoPrice) : undefined,

    // 🔹 бренд як назва (для меню, фільтрів по назві)
    brand:       x.brand ?? x.manufacturer ?? '',
    // 🔹 brandId — якщо захочеш будувати фільтр по id
    brandId:     x.brandId ?? '',

    category:    x.category ?? '',

    image:       x.image ?? x.photo ?? '',
    thumb:       x.thumb ?? x.image ?? '',
    description: x.description ?? x.desc ?? '',
    descriptionHtml: x.descriptionHtml ?? '',

    images:      Array.isArray(x.images) ? x.images : (x.image ? [x.image] : []),
    isAvailable: x.isAvailable == null ? true : !!x.isAvailable,

    // на всякий — щоб знати, з якого сайту (shop / company)
    site:        x.site ?? 'shop',
});

const normalizeList = (data) => {
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

// GET /shop/products
export async function getProducts(params = {}, { signal } = {}) {
    const { data } = await http.get('/shop/products', { params, signal });
    const res = normalizeList(data);
    return {
        items: res.items,
        total: res.total,
        page:  res.page || Number(params.page ?? 1),
        limit: res.limit || Number(params.limit ?? 12),
    };
}

export async function getProductById(id, { signal } = {}) {
    const { data } = await http.get(`/shop/products/${encodeURIComponent(id)}`, { signal });
    const src = data?.data ?? data?.item ?? data?.product ?? data;
    return normalizeProduct(src);
}

export async function getProductBySku(sku, { signal } = {}) {
    try {
        const { data } = await http.get(`/shop/products/sku/${encodeURIComponent(sku)}`, { signal });
        const src = data?.data ?? data?.item ?? data?.product ?? data;
        return normalizeProduct(src);
    } catch {
        const { data } = await http.get('/shop/products', { params: { sku }, signal });
        const { items } = normalizeList(data);
        return items[0] ?? null;
    }
}
