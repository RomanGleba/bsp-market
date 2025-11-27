import React from 'react';

export default function AppliedChips({
  q, onClearQuery,
  cat, setCat,
  price, setPrice,
  inStock, setInStock,
  brands, setBrands,
  attrs, setAttrs,
  resetAll
}) {
  const chips = [];
  if (q?.trim()) chips.push(onClearQuery ? { label:`Пошук: ${q}`, onClear:onClearQuery } : { label:`Пошук: ${q}`, type:'muted' });
  if (cat && cat !== 'all') chips.push({ label:`Категорія: ${cat}`, onClear:()=>setCat('all') });
  if (price.min) chips.push({ label:`Від: ${price.min}`, onClear:()=>setPrice(p=>({...p, min:''})) });
  if (price.max) chips.push({ label:`До: ${price.max}`,  onClear:()=>setPrice(p=>({...p, max:''})) });
  if (inStock)  chips.push({ label:'В наявності', onClear:()=>setInStock(false) });
  [...brands].forEach(b => chips.push({ label:`Бренд: ${b}`, onClear:()=>setBrands(new Set([...brands].filter(x=>x!==b))) }));
  Object.entries(attrs).forEach(([name, set]) => {
    [...set].forEach(v => chips.push({
      label:`${name}: ${v}`,
      onClear:()=>setAttrs(prev=>({...prev,[name]:new Set([...prev[name]].filter(x=>x!==v))}))
    }));
  });
  if (!chips.length) return null;
  return (
    <div className="chips">
      {chips.map((c,i)=> c.onClear
        ? <button key={i} className="chip" onClick={c.onClear}>{c.label} ×</button>
        : <span key={i} className="chip chip--muted" aria-disabled="true">{c.label}</span>
      )}
      <button className="chip chip--reset" onClick={resetAll}>Скинути всі</button>
    </div>
  );
}

