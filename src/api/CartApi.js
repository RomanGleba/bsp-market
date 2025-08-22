// Працює з NestJS-роутами: GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id, DELETE /cart
import http from './http';

// Нормалізація відповіді бекенда в очікуваний формат { items: [...] }
const normalizeItem = (x = {}) => ({
    id:    x.id ?? x._id ?? x.productId ?? x.itemId ?? x.product?.id,
    sku:   x.sku ?? x.product?.sku ?? '',
    title: x.title ?? x.product?.title ?? x.name ?? '',
    price: Number(x.price ?? x.product?.price ?? 0),
    image: x.image ?? x.product?.image ?? '',
    qty:   Number(x.qty ?? x.quantity ?? 1),
});

const normalizeCart = (data) => {
    const items = Array.isArray(data)
        ? data
        : Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data?.cart?.items)
                ? data.cart.items
                : [];
    return { items: items.map(normalizeItem) };
};

export async function getCart({ signal } = {}) {
    const { data } = await http.get('/cart', { signal });
    return normalizeCart(data);
}

export async function addToCart(payload, { signal } = {}) {
    // очікується body: { id, sku, qty }
    const body = {
        id:  payload.id,
        sku: payload.sku,
        qty: Math.max(1, Number(payload.qty) || 1),
    };
    const { data } = await http.post('/cart/items', body, { signal });
    return normalizeCart(data);
}

export async function patchCartQty(id, qty, { signal } = {}) {
    const body = { qty: Math.max(1, Number(qty) || 1) };
    const { data } = await http.patch(`/cart/items/${encodeURIComponent(id)}`, body, { signal });
    return normalizeCart(data);
}

export async function deleteCartItem(id, { signal } = {}) {
    const { data } = await http.delete(`/cart/items/${encodeURIComponent(id)}`, { signal });
    return normalizeCart(data);
}

export async function clearCart({ signal } = {}) {
    const { data } = await http.delete('/cart', { signal });
    return normalizeCart(data);
}
