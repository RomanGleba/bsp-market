// src/pages/productdetails/ProductDetails.jsx
import React, { lazy, Suspense, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import {
    selectProductBySku,
    selectCurrentProduct,
    selectCurrentProductStatus,
    fetchProductBySku,
    clearCurrent,
} from '../../store/productsSlice';
import { addToCartRemote } from '../../store/cartSlice';

import s from './ProductDetails.module.scss';

// Папка: productSections
const ProductSections = lazy(() => import('./productSelections/ProductSelections.jsx'));

const fmt = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
});

class TabsBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch() {}
    render() {
        if (this.state.hasError) return <div className="card">Не вдалося завантажити вкладки.</div>;
        return this.props.children;
    }
}

export default function ProductDetails() {
    const { sku: rawSku } = useParams();
    const sku = decodeURIComponent(rawSku || '');
    const d = useDispatch();

    const cached    = useSelector(selectProductBySku(sku));
    const current   = useSelector(selectCurrentProduct);
    const statusOne = useSelector(selectCurrentProductStatus);
    const product   = cached || current;

    useEffect(() => {
        if (!sku) return;
        d(fetchProductBySku(sku));
        return () => { d(clearCurrent()); };
    }, [sku, d]);

    useEffect(() => {
        if (product?.title) document.title = `${product.title} – Dasty Pet Food`;
    }, [product]);

    if (statusOne === 'loading' && !product) {
        return <section className="container"><div className="skeleton"></div></section>;
    }
    if ((statusOne === 'succeeded' || statusOne === 'failed') && !product) {
        return (
            <section className="container">
                <div className="card">
                    Товар не знайдено. <Link to="/products">Повернутися до каталогу</Link>
                </div>
            </section>
        );
    }
    if (!product) return null;

    const hasPromo = typeof product.promoPrice === 'number' && product.promoPrice < product.price;
    const price = hasPromo ? product.promoPrice : product.price;
    const out = (Number(product?.stock) || 0) <= 0;

    return (
        <section className="container">
            <div className={s.layout}>
                <div className={s.media}>
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={`${product.brand ? product.brand + ' ' : ''}${product.title}`}
                            loading="lazy"
                            className={s.photo}
                        />
                    ) : (
                        <div className={s.noimg} role="img" aria-label="Зображення відсутнє" />
                    )}
                </div>

                <div className={s.info}>
                    <h1 className={s.title}>{product.title}</h1>
                    <div className={s.meta}>
                        <span className={s.sku}>Код: <b>{product.sku || '—'}</b></span>
                        {product.brand && <span className={s.brand}>{product.brand}</span>}
                        {product.category && <span className={s.cat}>{product.category}</span>}
                    </div>

                    <div className={s.priceRow}>
                        {hasPromo ? (
                            <>
                                <div>
                                    <span className="price">{fmt.format(Math.round(price))}</span>{' '}
                                    <span className={s.old}><s>{fmt.format(Math.round(product.price))}</s></span>
                                </div>
                                <span className="badge">Акція</span>
                            </>
                        ) : (
                            <span className="price">{fmt.format(Math.round(price))}</span>
                        )}
                    </div>

                    <div className={s.actions}>
            <span role="status" aria-live="polite" className={`badge ${out ? s.badgeOutPill : s.badgeIn}`}>
              {out ? 'Немає в наявності' : 'Є в наявності'}
            </span>
                        <button
                            className="btn primary"
                            disabled={out}
                            aria-disabled={out}
                            onClick={() => d(addToCartRemote({
                                id: product.id,
                                sku: product.sku,
                                title: product.title,
                                price,
                                image: product.image,
                                qty: 1,
                            }))}
                        >
                            Додати в кошик
                        </button>
                    </div>
                </div>
            </div>

            <Suspense fallback={<div className="skeleton"></div>}>
                <TabsBoundary>
                    <ProductSections product={product} />
                </TabsBoundary>
            </Suspense>
        </section>
    );
}
