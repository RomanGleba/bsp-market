// src/api/CartApi.js
import http from './http';

// ---- helpers ----

// привести один рядок кошика до стабільного вигляду
const normalizeItem = (x = {}) => {
    const cartItemId = x.id ?? x.cartItemId ?? x._id ?? null;
    const productId = x.productId ?? x.product?.id ?? null;

    // На бекові ціна зафіксована в момент додавання
    const rawPrice =
        x.price ??
        x.priceLocked ??
        x.product?.promoPrice ??
        x.product?.price ??
        0;

    return {
        id: cartItemId,
        cartItemId,
        productId,

        sku: x.sku ?? x.product?.sku ?? '',

        title:
            x.title ??
            x.product?.title ??
            x.name ??
            x.product?.name ??
            '',

        price: Number(rawPrice) || 0,

        // 🔥 ГОЛОВНЕ ВИПРАВЛЕННЯ — стабільний fallback зображення
        image:
            x.image ||
            x.product?.image ||
            x.product?.thumb ||
            (Array.isArray(x.product?.images) ? x.product.images[0] : null) ||
            null,

        qty: Math.max(1, Number(x.qty ?? x.quantity ?? 1)),
    };
};

// привести відповідь бекенду ({ cartId, items }) до { items: [...] }
const normalizeCart = (data) => {
    const items = Array.isArray(data?.items) ? data.items : [];
    return { items: items.map(normalizeItem) };
};

// ---- API ----

// GET /cart
export async function getCart({ signal } = {}) {
    const { data } = await http.get('/cart', { signal });
    return normalizeCart(data);
}

// POST /cart/items
export async function addToCart(payload, { signal } = {}) {
    const qty = Math.max(1, Number(payload.qty) || 1);

    const body = {
        product: {
            id: payload.id,
            sku: payload.sku,
            title: payload.title,
            price: payload.price,
            promoPrice: payload.promoPrice,

            // 🔥 Фіксуємо картинку ПРАВИЛЬНО
            image:
                payload.image ||
                payload.thumb ||
                (Array.isArray(payload.images) ? payload.images[0] : null) ||
                null,
        },
        qty,
    };

    const { data } = await http.post('/cart/items', body, { signal });
    return normalizeCart(data);
}

// PATCH /cart/items/:id
export async function patchCartQty(cartItemId, qty, { signal } = {}) {
    const body = { qty: Math.max(1, Number(qty) || 1) };

    const res = await http.patch(
        `/cart/items/${encodeURIComponent(cartItemId)}`,
        body,
        { signal }
    );

    if (res.status === 204 || res.data == null) {
        const again = await http.get('/cart', { signal });
        return normalizeCart(again.data);
    }
    return normalizeCart(res.data);
}

// DELETE /cart/items/:id
export async function deleteCartItem(cartItemId, { signal } = {}) {
    const res = await http.delete(
        `/cart/items/${encodeURIComponent(cartItemId)}`,
        { signal }
    );

    if (res.status === 204 || res.data == null) {
        const again = await http.get('/cart', { signal });
        return normalizeCart(again.data);
    }
    return normalizeCart(res.data);
}

// DELETE /cart
export async function clearCart({ signal } = {}) {
    const res = await http.delete('/cart', { signal });

    if (res.status === 204 || res.data == null) {
        const again = await http.get('/cart', { signal });
        return normalizeCart(again.data);
    }
    return normalizeCart(res.data);
}
