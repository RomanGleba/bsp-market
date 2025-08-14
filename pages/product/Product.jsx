import React, { useEffect, useMemo, useState, useDeferredValue } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts } from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import FiltersProduct from '../../components/filters/FiltersProduct';
import s from './Products.module.scss';

export default function Products() {
  const d = useDispatch();
  const all = useSelector(selectProducts);

  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [sort, setSort] = useState('popular');

 
  useEffect(() => {
    if (!all?.length) d(fetchProducts());
  }, [d, all?.length]);

  const cats = useMemo(() => {
    const set = new Set();
    for (const p of all ?? []) {
      if (p?.category) set.add(p.category);
    }
    return ['all', ...Array.from(set)];
  }, [all]);

  const qDeferred = useDeferredValue(q);

  const getPrice = (p) => Number(p?.promoPrice ?? p?.price ?? Number.POSITIVE_NUMBER);

  const list = useMemo(() => {
    const qn = (qDeferred ?? '').toLowerCase();

    let arr = (all ?? []).filter((p) => (p?.title ?? '').toLowerCase().includes(qn));

    if (cat !== 'all') {
      arr = arr.filter((p) => (p?.category ?? '') === cat);
    }

    if (sort === 'price-asc') {
      arr = arr.slice().sort((a, b) => getPrice(a) - getPrice(b));
    } else if (sort === 'price-desc') {
      arr = arr.slice().sort((a, b) => getPrice(b) - getPrice(a));
    } else {
      // "popular" як дефолт — якщо немає рейтингу/продажів, сортуємо стабільно за title
      const collator = new Intl.Collator('uk');
      arr = arr.slice().sort((a, b) => collator.compare(a?.title ?? '', b?.title ?? ''));
    }

    return arr;
  }, [all, qDeferred, cat, sort]);

  return (
    <section className="container">
      <div className={s.layout}>
        <aside className={'card ' + s.sidebar}>
          <h3 style={{ marginTop: 0 }}>Фільтри</h3>
          <FiltersProduct
            q={q}
            setQ={setQ}
            cat={cat}
            setCat={setCat}
            sort={sort}
            setSort={setSort}
            cats={cats}
          />
        </aside>

        <div className={s.grid}>
          {list.map((p) => (
            <ProductCard key={p?.id ?? p?.sku ?? p?.title} product={p} />
          ))}
          {list.length === 0 && <div className="card">Нічого не знайдено.</div>}
        </div>
      </div>
    </section>
  );
}
