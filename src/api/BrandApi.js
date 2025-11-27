import http from './http';

// GET /brands → [{ id, name, logoKey? }, ...] (публічний)
export async function listBrands({ signal } = {}) {
    const { data } = await http.get('/brands', { signal });
    if (Array.isArray(data)) {
        return data.map(x => ({
            id: x.id ?? x._id ?? x.brandId ?? x.slug ?? String(x.name),
            name: x.name ?? x.title ?? '',
            logoKey: x.logoKey ?? x.logo ?? '',
        }));
    }
    return [];
}
