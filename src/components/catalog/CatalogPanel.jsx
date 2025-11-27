import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchProducts } from '../../store/productsSlice.js';
import { listBrands } from '../../api/BrandApi.js';

const CATS = ['Корм', 'Іграшки', 'Амуниція', 'Посуд', 'Вітаміни', 'Гігієна'];

export default function CatalogPanel() {
    const d = useDispatch();
    const [sp, setSp] = useSearchParams();

    const [q, setQ] = useState(sp.get('q') || '');
    const [category, setCategory] = useState(sp.get('category') || '');
    const [brand, setBrand] = useState(sp.get('brand') || '');
    const [sort, setSort] = useState(sp.get('sort') || 'createdAt');
    const [dir, setDir] = useState(sp.get('dir') || 'desc');
    const [min, setMin] = useState(sp.get('min') || '');
    const [max, setMax] = useState(sp.get('max') || '');
    const [inStock, setInStock] = useState(sp.get('stock') === '1');

    const [brands, setBrands] = useState([]);
    useEffect(() => {
        listBrands().then(setBrands).catch(console.error);
    }, []);

    useEffect(() => {
        const next = new URLSearchParams();
        if (q) next.set('q', q);
        if (category) next.set('category', category);
        if (brand) next.set('brand', brand);
        if (min) next.set('min', min);
        if (max) next.set('max', max);
        if (inStock) next.set('stock', '1');
        next.set('sort', sort);
        next.set('dir', dir);
        setSp(next);
    }, [q, category, brand, min, max, inStock, sort, dir]);

    useEffect(() => {
        const params = Object.fromEntries(sp.entries());
        d(fetchProducts(params));
    }, [sp]);

    return (
        <div className="catalog-panel">
            <div className="filters">
                <input placeholder="Пошук..." value={q} onChange={(e) => setQ(e.target.value)} />

                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Всі категорії</option>
                    {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>

                <select value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <option value="">Всі бренди</option>
                    {brands.map((b) => <option key={b.id} value={b.name}>{b.name}</option>)}
                </select>

                <div>
                    <input type="number" placeholder="мін" value={min} onChange={(e) => setMin(e.target.value)} />
                    <input type="number" placeholder="макс" value={max} onChange={(e) => setMax(e.target.value)} />
                </div>

                <label>
                    <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} /> В наявності
                </label>

                <select value={`${sort}:${dir}`} onChange={(e) => {
                    const [s, ddd] = e.target.value.split(':');
                    setSort(s); setDir(ddd);
                }}>
                    <option value="createdAt:desc">Нові</option>
                    <option value="price:asc">Дешевші</option>
                    <option value="price:desc">Дорожчі</option>
                </select>
            </div>
        </div>
    );
}
