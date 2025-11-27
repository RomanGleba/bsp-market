export function buildProductsUrl({ locationSearch, action = {} }) {
    const params = new URLSearchParams(locationSearch);
    params.delete('page');
    if ('q' in action) {
        const v = (action.q ?? '').trim();
        if (v) params.set('q', v); else params.delete('q');
    } else {
        params.delete('q');
        Object.entries(action).forEach(([k, v]) => {
            if (v == null || v === '') params.delete(k);
            else params.set(k, String(v));
        });
    }
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ''}`;
}