import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, selectProducts } from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import s from './Products.module.scss';

const PAGE_SIZE = 12;

export default function Products() {
  const dispatch = useDispatch();
  const all = useSelector(selectProducts);

  const [sp, setSp] = useSearchParams();
  const q = sp.get('q') || '';
  const qDeferred = useDeferredValue(q);

  const [page, setPage] = useState(Number(sp.get('page') || 1));

  useEffect(() => { dispatch(fetchProducts()); }, [dispatch]);

  const filtered = useMemo(() => {
    let arr = all;
    if (qDeferred.trim()) {
      const needle = qDeferred.toLowerCase();
      arr = arr.filter(p =>
        p.title.toLowerCase().includes(needle) ||
        p.sku?.toLowerCase().includes(needle)
      );
    }
    return arr;
  }, [all, qDeferred]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filtered, currentPage]
  );

  useEffect(() => {
    const next = new URLSearchParams();
    if (q) next.set('q', q);
    if (currentPage > 1) next.set('page', String(currentPage));
    setSp(next, { replace: true });
  }, [q, currentPage, setSp]);

  useEffect(() => { setPage(1); }, [qDeferred]);

  const clearQuery = () => {
    const next = new URLSearchParams(sp);
    next.delete('q');
    next.delete('page');
    setSp(next, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="container">
      <div className={s.layout}>
        <div className={s.topBar}>
          <div className={s.count}>
            Знайдено: <b>{total}</b> · стор. {currentPage}/{totalPages}
          </div>
          {q && (
            <button className="btn" onClick={clearQuery} title="Очистити пошук">
              ✕ Очистити «{q}»
            </button>
          )}
        </div>

        <div className={s.grid}>
          {pageItems.map(p => <ProductCard key={p.id} product={p} />)}
        </div>

        {total === 0 && (
          <div className={`card ${s.empty}`}>
            Нічого не знайдено. Спробуйте інший запит.
          </div>
        )}

        {totalPages > 1 && (
          <nav className={s.pager} aria-label="Пагінація">
            <button
              className="btn"
              disabled={currentPage === 1}
              onClick={() => setPage(p => p - 1)}
            >
              ‹ Назад
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 7)
              .map(n => (
                <button
                  key={n}
                  className="btn"
                  aria-current={n === currentPage ? 'page' : undefined}
                  onClick={() => setPage(n)}
                >
                  {n}
                </button>
              ))}

            <button
              className="btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage(p => p + 1)}
            >
              Вперед ›
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
