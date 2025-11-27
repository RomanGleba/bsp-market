// src/pages/home/Home.jsx
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProducts,
    selectProducts,
    selectProductsStatus,
    selectProductsError,
} from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import { Link } from 'react-router-dom';
import s from './Home.module.scss';

// Горизонтальний банер
import heroPetsImg from '../../assets/dog.jpg';

export default function Home() {
    const d      = useDispatch();
    const items  = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);
    const error  = useSelector(selectProductsError);

    useEffect(() => {
        d(fetchProducts({ page: 1, limit: 50 }));
    }, [d]);

    // максимум 8 унікальних (за sku || id)
    const hits = useMemo(() => {
        const seen = new Set();
        const res  = [];
        for (const p of items) {
            const key = String(p.sku ?? p.id ?? '');
            if (!key || seen.has(key)) continue;
            seen.add(key);
            res.push(p);
            if (res.length === 8) break;
        }
        return res;
    }, [items]);

    const isLoading = status === 'loading';
    const isError   = status === 'failed';

    return (
        <section className="container">
            {/* HERO банер — картинка + кнопка поверх */}
            <div className={s.hero}>
                <img
                    src={heroPetsImg}
                    alt="Все для ваших улюбленців — широкий вибір кормів та ласощів"
                    className={s.heroImg}
                    loading="lazy"
                />

                <div className={s.heroCtaWrap}>
                    <Link to="/products" className={s.heroCtaBtn}>
                        <span className={s.heroCtaLabel}>До каталогу</span>
                        <span className={s.heroCtaArrow}>➜</span>
                    </Link>
                </div>
            </div>

            <h2>Хіти</h2>

            {isError && (
                <div className="card">
                    Помилка: {error || 'Не вдалося завантажити товари'}
                </div>
            )}

            {!isError && (
                <div className={s.grid}>
                    {isLoading && hits.length === 0 && (
                        <>
                            <div className="skeleton" style={{ height: 300 }} />
                            <div className="skeleton" style={{ height: 300 }} />
                            <div className="skeleton" style={{ height: 300 }} />
                            <div className="skeleton" style={{ height: 300 }} />
                        </>
                    )}

                    {hits.map((p, idx) => (
                        <ProductCard key={`hit-${p.sku ?? p.id ?? idx}`} product={p} />
                    ))}

                    {!isLoading && hits.length === 0 && (
                        <div className="card" style={{ gridColumn: '1 / -1' }}>
                            Поки що немає хітів.
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}
