import http from './http';

// Бек повертає масив [{ label, params? } | { label, q? }, ...]
export async function fetchSuggest(q, limit = 8, signal) {
    if (!q || !q.trim()) return [];
    const { data } = await http.get('/search/suggest', { params: { q, limit }, signal });
    return Array.isArray(data) ? data : [];
}
