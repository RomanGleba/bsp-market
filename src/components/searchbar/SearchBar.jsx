import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import s from './SearchBar.module.scss';

const useDebounced = (v, ms = 250) => {
  const [val, setVal] = useState(v);
  useEffect(() => { const t = setTimeout(() => setVal(v), ms); return () => clearTimeout(t); }, [v, ms]);
  return val;
};

// нормалізуємо в { label, action, type }
// action: або { q } (пошук), або params-об’єкт (фільтри каталогу)
function normalizeItem(item) {
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

export default function SearchBar({
  placeholder = 'Я шукаю…',
  suggestFn,               // async (q) => (string[] | {label, params}|{label,q})[]
  popular = [],            // string[] | {label, params}[] | {label,q}[]
  products = []            // масив всіх товарів для фільтрації чіпів
}) {
  const nav = useNavigate();
  const loc = useLocation();
  const [sp] = useSearchParams();

  const [q, setQ] = useState(sp.get('q') || '');
  const qd = useDebounced(q, 200);

  const [open, setOpen] = useState(false);
  const [sug, setSug] = useState([]); // сирі значення з suggestFn
  const [activeIdx, setActiveIdx] = useState(-1);
  const box = useRef(null);

  // нормалізуємо popular і sug
  const popularNormRaw = useMemo(
    () => (popular || []).map(normalizeItem).filter(Boolean),
    [popular]
  );
  const sugNorm = useMemo(
    () => (sug || []).map(normalizeItem).filter(Boolean),
    [sug]
  );

  // приховуємо чіпи-категорії без товарів; пошукові (type='search') не чіпаємо
  const popularNorm = useMemo(() => {
    if (!Array.isArray(products) || products.length === 0) {
      // якщо немає продуктів — показуємо тільки пошукові, категорії ховаємо
      return popularNormRaw.filter(it => it.type !== 'cat');
    }
    return popularNormRaw.filter(it => {
      if (it.type !== 'cat') return true; // не категорія — не фільтруємо
      const cat = it.action?.cat;
      if (!cat) return false;
      const catLc = String(cat).toLowerCase();
      return products.some(p => (p.category || '').toLowerCase() === catLc);
    });
  }, [popularNormRaw, products]);

  // автопідказки
  useEffect(() => {
    setActiveIdx(-1);
    if (!qd.trim()) { setSug([]); return; }
    let live = true;
    (async () => {
      const items = suggestFn ? await suggestFn(qd) : [];
      if (live) setSug(Array.isArray(items) ? items.slice(0, 8) : []);
    })();
    return () => { live = false; };
  }, [qd, suggestFn]);

  // клік поза SearchBar — закрити
  useEffect(() => {
    const onDoc = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, []);

  // зібрати URL з {q} або з params
  const buildUrlWithParams = (action = {}) => {
    const params = new URLSearchParams(loc.search);
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
  };

  const goSearch = (normalizedItem) => {
    if (!normalizedItem) return;
    // тут не потрібно алертів — ми вже прибрали «порожні» категорії з popularNorm
    const url = buildUrlWithParams(normalizedItem.action || {});
    nav(url);
    setOpen(false);
  };

  const showPopular = open && !qd.trim() && popularNorm.length > 0;
  const activeList = showPopular ? popularNorm : sugNorm;

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, activeList.length - 1)); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIdx >= 0 && activeList[activeIdx]) {
      e.preventDefault();
      goSearch(activeList[activeIdx]);
    }
  };

  return (
    <form
      ref={box}
      onSubmit={(e) => { e.preventDefault(); nav(buildUrlWithParams({ q })); setOpen(false); }}
      onKeyDown={onKeyDown}
      className={s.form}
      role="search"
    >
      <div className={s.inputWrap}>
        <input
          value={q}
          onChange={(e)=>{ setQ(e.target.value); setOpen(true); }}
          onFocus={()=> setOpen(true)}
          placeholder={placeholder}
          aria-label="Пошук"
          className={s.input}
        />
        <span className={s.icon}>🔍</span>
        {!!q && (
          <button type="button" onClick={()=> setQ('')} aria-label="Очистити" className={s.clear}>✕</button>
        )}
      </div>

      <button className={`btn ${s.submit}`} type="submit">Знайти</button>

      {open && (
        <div className={s.dropdown} role="listbox">
          {showPopular ? (
            <>
              <div className={s.sectionTitle}>Популярне</div>
              <div className={s.chips}>
                {popularNorm.map((it, i) => (
                  <button key={i} type="button" onClick={()=> goSearch(it)} className={s.chip}>
                    {it.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className={s.list}>
              {sugNorm.map((it, i) => (
                <button
                  key={i}
                  type="button"
                  role="option"
                  aria-selected={activeIdx === i}
                  onMouseEnter={()=> setActiveIdx(i)}
                  onClick={()=> goSearch(it)}
                  className={`${s.item} ${activeIdx === i ? s.itemActive : ''}`}
                >
                  {it.label}
                </button>
              ))}
              {sugNorm.length === 0 && q.trim() && (
                <div className={s.empty}>Нічого не знайдено</div>
              )}
            </div>
          )}
        </div>
      )}
    </form>
  );
}
