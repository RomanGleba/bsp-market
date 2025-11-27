import React from 'react';

export default function FiltersProduct({
  cat, setCat, cats = [],
  sort, setSort,
  price = { min: '', max: '' },
  setPrice,
  inStock = false, setInStock,
  brands = new Set(), setBrands,
  attrs = {}, setAttrs,
  allBrands = [],
  allAttrs = {}
}) {
  // не називай параметр "set" (плутається з Set/setState)
  const toggleFromSet = (s, v) =>
    s.has(v) ? new Set([...s].filter(x => x !== v)) : new Set([...s, v]);

  const toggleAttr = (name, v) => {
    const current = attrs?.[name] || new Set();
    const next = toggleFromSet(current, v);
    setAttrs({ ...(attrs || {}), [name]: next });
  };

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <label>
        Категорія
        <select
          value={cat ?? 'all'}
          onChange={e => setCat(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 10 }}
        >
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>

      <div>
        <div style={{ opacity: .7, marginBottom: 6 }}>Ціна, грн</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input
            type="number"
            placeholder="Від"
            value={price?.min ?? ''}                              // ✅ безпечно
            onChange={e => setPrice(p => ({ ...(p || {}), min: e.target.value }))}
          />
          <input
            type="number"
            placeholder="До"
            value={price?.max ?? ''}                              // ✅ безпечно
            onChange={e => setPrice(p => ({ ...(p || {}), max: e.target.value }))}
          />
        </div>
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={!!inStock}                                     // ✅ до boolean
          onChange={e => setInStock(e.target.checked)}
        />
        Лише в наявності
      </label>

      {!!(allBrands && allBrands.length) && (
        <div>
          <div style={{ opacity: .7, marginBottom: 6 }}>Бренд</div>
          <div style={{ display: 'grid', gap: 6, maxHeight: 180, overflow: 'auto' }}>
            {allBrands.map(b => {
              const value = typeof b === 'string' ? b : b.value;   // ✅ підтримка string | {value,count}
              const count = typeof b === 'object' ? b.count : undefined;
              const checked = (brands || new Set()).has(value);
              return (
                <label key={value} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setBrands(toggleFromSet(brands || new Set(), value))}
                  />
                  {value} {count ? <span style={{ opacity: .6 }}>({count})</span> : null}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {Object.entries(allAttrs || {}).map(([name, options]) => (
        <div key={name}>
          <div style={{ opacity: .7, marginBottom: 6 }}>{name}</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {(options || []).map(opt => {
              const value = typeof opt === 'string' ? opt : opt.value;  // ✅ підтримка string | {value,count}
              const count = typeof opt === 'object' ? opt.count : undefined;
              const isChecked = !!(attrs?.[name]?.has(value));
              return (
                <label key={value} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAttr(name, value)}
                  />
                  {value} {count ? <span style={{ opacity: .6 }}>({count})</span> : null}
                </label>
              );
            })}
          </div>
        </div>
      ))}

      <label>Сортування
        <select
          value={sort ?? 'popular'}
          onChange={e => setSort(e.target.value)}
          style={{ width: '100%', padding: '8px 10px', borderRadius: 10 }}
        >
          <option value="popular">Популярні</option>
          <option value="price-asc">Дешевші</option>
          <option value="price-desc">Дорожчі</option>
          <option value="newest">Новинки</option>
        </select>
      </label>
    </div>
  );
}

