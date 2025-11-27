export function normalizeItem(item) {
    if (typeof item === 'string') {
        const label = item.trim();
        if (!label) return null;
        return { label, action: { q: label }, type: 'search' };
    }
    if (item && typeof item === 'object') {
        const label = String(item.label ?? item.q ?? '').trim();
        if (!label) return null;
        const type = item.type || ('params' in item ? 'cat' : 'search');
        if (item.params && typeof item.params === 'object') {
            return { label, action: { ...item.params }, type };
        }
        if (typeof item.q === 'string') {
            return { label, action: { q: item.q }, type };
        }
    }
    return null;
}