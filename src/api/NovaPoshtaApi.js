// src/api/NovaPoshtaApi.js
import http from './http';

/**
 * Пошук міст Нової пошти
 * @param {string} search
 * @returns {Promise<Array<{ref:string, present:string, cityName:string}>>}
 */
export async function searchNpcities(search, { signal } = {}) {
    const q = (search || '').trim();
    if (q.length < 2) return [];

    console.log('[NP] ▶️ searchNpcities request:', q);

    const { data } = await http.post(
        '/nova-poshta/cities',
        { search: q },
        { signal }
    );

    console.log('[NP] ✅ searchNpcities response:', data);

    const addresses = data?.data?.[0]?.Addresses ?? [];
    return addresses.map((c) => ({
        ref: c.Ref,                         // id, якщо треба
        present: c.Present,                 // "м. Ужгород, Закарпатська обл."
        cityName: c.MainDescription || '',  // "Ужгород" — під CityName
    }));
}

/**
 * Отримати відділення за НАЗВОЮ міста
 * @param {string} cityName
 * @returns {Promise<Array<{ref:string, number:string, description:string}>>}
 */
export async function getNpWarehouses(cityName, { signal } = {}) {
    const name = (cityName || '').trim();
    if (!name) return [];

    console.log('[NP] ▶️ getNpWarehouses request, cityName:', name);

    const { data } = await http.post(
        '/nova-poshta/warehouses',
        { cityName: name },
        { signal }
    );

    console.log('[NP] ✅ getNpWarehouses response:', data);

    const list = data?.data ?? [];
    return list.map((w) => ({
        ref: w.Ref,
        number: w.Number,
        description: w.Description,
    }));
}
