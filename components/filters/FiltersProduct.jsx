import React from 'react';
import s from './FiltersProduct.module.scss';

const FiltersProduct = ({ q, setQ, cat, setCat, sort, setSort, cats }) => {
  return (
    <div className={s.wrap}>
      <input className={s.input} placeholder="Пошук..." value={q} onChange={e=>setQ(e.target.value)} />
      <select className={s.select} value={cat} onChange={e=>setCat(e.target.value)}>
        {cats.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <select className={s.select} value={sort} onChange={e=>setSort(e.target.value)}>
        <option value="popular">Популярні</option>
        <option value="price-asc">Дешевші</option>
        <option value="price-desc">Дорожчі</option>
      </select>
    </div>
  );
}

export default  FiltersProduct;