import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectProducts } from '../store/productsSlice';

/**
 * Повертає async-функцію suggestFn(q) для SearchBar.
 * Будує пул з назв, брендів, категорій, SKU і робить пошук по contains.
 * Пріоритизація: збіг з початку слова > просто входження. До 8 підказок.
 */
export function useSuggestFn() {
  const products = useSelector(selectProducts);

  // раз збираємо унікальний пул рядків
  const pool = useMemo(() => {
    const set = new Set();

    // фіксовані популярні (на випадок порожнього каталогу)
    ['Корм', 'Іграшки', 'Амуниція', ].forEach(v => set.add(v));

    for (const p of products || []) {
      if (p?.title) set.add(String(p.title));
      if (p?.brand) set.add(String(p.brand));
      if (p?.category) set.add(String(p.category));
      if (p?.sku) set.add(String(p.sku));
    }
    return Array.from(set);
  }, [products]);

  // сама функція підказок
  return async (q) => {
    const needle = (q || '').trim().toLowerCase();
    if (!needle) return [];
    const starts = [];
    const contains = [];
    for (const txt of pool) {
      const t = txt.toLowerCase();
      if (t.startsWith(needle)) starts.push(txt);
      else if (t.includes(needle)) contains.push(txt);
      if (starts.length >= 8) break; // швидка обрізка
    }
    return [...starts, ...contains].slice(0, 8);
  };
}
