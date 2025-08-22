// src/components/productcard/ProductCard.jsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';                        // ⬅️
import { addItem } from '../../store/cartSlice';
import s from './ProductCard.module.scss';

const ProductCard = ({ product }) => {
    const d = useDispatch();
    const price = product.promoPrice ?? product.price;
    const out = (product?.stock ?? 0) <= 0;
    const imgSrc = product.thumb || product.image || null;

    const slug = encodeURIComponent(product.sku); // ⬅️ ВАЖЛИВО: має бути sku!

    return (
        <div className={`card ${s.card} ${out ? s.out : ''}`}>
            <Link to={`/product/${slug}`} className={s.media}>          {/* ⬅️ */}
                {imgSrc ? (
                    <img className={s.thumb} src={imgSrc} alt={product.title} />
                ) : (
                    <div className={s.noimg} aria-label="Зображення відсутнє" />
                )}
                {out && <span className={s.badgeOut}>Немає в наявності</span>}
            </Link>

            <Link to={`/product/${slug}`} className={s.title}>          {/* ⬅️ */}
                {product.title}
            </Link>

            <div className={s.row}>
                {product.promoPrice ? (
                    <>
                        <div>
                            <span className="price">{Math.round(price)} грн</span>{' '}
                            <span style={{ textDecoration: 'line-through', opacity: 0.7 }}>
                {Math.round(product.price)} грн
              </span>
                        </div>
                        <span className="badge">Акція</span>
                    </>
                ) : (
                    <span className="price">{Math.round(price)} грн</span>
                )}
            </div>

            <div className={s.row}>
        <span className={`badge ${out ? s.badgeOutPill : s.badgeIn}`}>
          {out ? 'Немає в наявності' : 'Є в наявності'}
        </span>
                <button
                    className="btn primary"
                    disabled={out}
                    aria-disabled={out}
                    onClick={() => d(addItem({ ...product, id: product.id, qty: 1 }))}
                >
                    Додати
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
