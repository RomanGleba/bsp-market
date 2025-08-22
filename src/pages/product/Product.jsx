// src/pages/product/Products.jsx
import React, { useDeferredValue, useEffect,  useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import {
    fetchProducts,
    selectProducts,
    selectProductsStatus,
    selectProductsError,
    selectProductsTotal,
    selectProductsLimit,
} from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import s from './Products.module.scss';

const PAGE_SIZE = 12;

export default function Products() {
    const d = useDispatch();

    // дані зі стору
    const items  = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);
    const error  = useSelector(selectProductsError);
    const total  = useSelector(selectProductsTotal);
    const limitFromStore = useSelector(selectProductsLimit);

    // query params
    const [sp, setSp] = useSearchParams();
    const qRaw  = sp.get('q') || '';
    const pageRaw = Number(sp.get('page') || 1);

    // локальний стейт сторінки + стабілізація запиту
    const [page, setPage] = useState(Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1);
    const qDeferred = useDeferredValue(qRaw);

    // вибираємо ліміт: якщо бек повертає свій, поважаємо його; інакше наш дефолт
    const limit = Number(limitFromStore) || PAGE_SIZE;
    const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / limit));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    // підвантажити з бека при зміні запиту/сторінки
    useEffect(() => {
        d(fetchProducts({ q: qDeferred, page: currentPage, limit: PAGE_SIZE }));
    }, [d, qDeferred, currentPage]);

    // тримаємо URL у синхроні
    useEffect(() => {
        const next = new URLSearchParams();
        if (qRaw) next.set('q', qRaw);
        if (currentPage > 1) next.set('page', String(currentPage));
        setSp(next, { replace: true });
    }, [qRaw, currentPage, setSp]);

    // якщо змінився текст пошуку — повертаємось на першу сторінку
    useEffect(() => { setPage(1); }, [qDeferred]);

    // якщо total зменшився і сторінка вийшла за межі — підрівнюємо
    useEffect(() => {
        if (currentPage > totalPages) setPage(totalPages);
    }, [currentPage, totalPages]);

    // скрол догори при зміні сторінки
    useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [currentPage]);

    // очистити пошук
    const clearQuery = () => {
        const next = new URLSearchParams(sp);
        next.delete('q'); next.delete('page');
        setSp(next, { replace: true });
    };

    // безпечний унікальний ключ
    const keyOf = (p, i) => `prod-${p?.sku ?? p?.id ?? i}`;

    const showEmpty = status === 'succeeded' && (Number(total) || 0) === 0;
    const showError = status === 'failed';
    const showLoadingInline = status === 'loading' && (items?.length ?? 0) === 0;

    return (
        <section className="container">
            <div className={s.layout}>

                <div className={s.topBar}>
                    <div className={s.count}>
                        Знайдено: <b>{total}</b> · стор. {currentPage}/{totalPages}
                    </div>
                    {qRaw && (
                        <button className="btn" onClick={clearQuery} title="Очистити пошук">
                            ✕ Очистити «{qRaw}»
                        </button>
                    )}
                </div>

                {showLoadingInline && <div className="skeleton" style={{ height: 120 }} />}

                {showError && (
                    <div className="card">Помилка: {error || 'Не вдалося завантажити товари'}</div>
                )}

                {!showError && (
                    <>
                        <div className={s.grid}>
                            {items.map((p, i) => (
                                <ProductCard key={keyOf(p, i)} product={p} />
                            ))}
                        </div>

                        {showEmpty && (
                            <div className={`card ${s.empty}`}>
                                Нічого не знайдено. Спробуйте інший запит.
                            </div>
                        )}

                        {totalPages > 1 && (
                            <nav className={s.pager} aria-label="Пагінація">
                                <button
                                    className="btn"
                                    disabled={currentPage === 1}
                                    onClick={() => setPage((p) => p - 1)}
                                >
                                    ‹ Назад
                                </button>

                                {/* сторінки (до 7 кнопок) з оновленням URL */}
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((n) => {
                                    const params = new URLSearchParams();
                                    if (qRaw) params.set('q', qRaw);
                                    if (n > 1) params.set('page', String(n));
                                    return (
                                        <Link
                                            key={`pg-${n}`}
                                            to={`?${params.toString()}`}
                                            className="btn"
                                            aria-current={n === currentPage ? 'page' : undefined}
                                            onClick={(e) => { e.preventDefault(); setPage(n); }}
                                        >
                                            {n}
                                        </Link>
                                    );
                                })}

                                <button
                                    className="btn"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setPage((p) => p + 1)}
                                >
                                    Вперед ›
                                </button>
                            </nav>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
