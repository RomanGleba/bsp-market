// src/pages/home/Home.jsx
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts } from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import s from './Home.module.scss';

const Home = () => {
    const d = useDispatch();
    const items = useSelector(selectProducts);

    useEffect(() => { d(fetchProducts()); }, [d]);

    // Беремо максимум 8 унікальних товарів за ключем sku || id
    const hits = useMemo(() => {
        const seen = new Set();
        const res = [];
        for (const p of items) {
            const key = String(p.sku ?? p.id);
            if (seen.has(key)) continue;
            seen.add(key);
            res.push(p);
            if (res.length === 8) break;
        }
        return res;
    }, [items]);

    return (
        <section className="container">
            <div className={s.hero} />
            <h2>Хіти</h2>
            <div className={s.grid}>
                {hits.map((p, idx) => (
                    <ProductCard key={`hit-${p.sku ?? p.id}-${idx}`} product={p} />
                ))}
            </div>
        </section>
    );
};

export default Home;
