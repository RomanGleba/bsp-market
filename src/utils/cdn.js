// Надійно читаємо і нормалізуємо базовий CDN URL із .env
function normalizeCdnBase(raw) {
    const v = (raw || '').trim();
    if (!v) return '';
    // якщо випадково додали зайвий текст (arn, пробіли тощо) — беремо перший токен
    const first = v.split(/\s+/)[0];
    // якщо немає протоколу — додаємо https://
    const withProto = /^https?:\/\//i.test(first) ? first : `https://${first}`;
    // прибираємо кінцеві слеші
    return withProto.replace(/\/+$/, '');
}

export const CDN_BASE = normalizeCdnBase(import.meta?.env?.VITE_CDN_BASE_URL);

/** Перетворює "key"/"url" → повний CDN URL */
export function toImgSrcKey(input) {
    if (!input) return '';
    const raw = typeof input === 'string' ? input : (input?.url || input?.key || '');
    if (!raw) return '';
    if (/^https?:\/\//i.test(raw)) return raw; // вже абсолютний
    const clean = String(raw).replace(/^\/+/, ''); // знімаємо початкові /
    return CDN_BASE ? `${CDN_BASE}/${encodeURI(clean)}` : `/${encodeURI(clean)}`;
}

// DEBUG
if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[CDN] BASE =', CDN_BASE || '(empty)');
}
