// src/pages/basket/Basket.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCartItems,
    selectTotals,
    selectCartStatus,
    loadCart,
    setCartQty,        // thunk → PATCH /cart/items/:id
    removeFromCart,    // thunk → DELETE /cart/items/:id
    clearCartRemote,   // thunk → DELETE /cart
} from '../../store/cartSlice';
import { Link } from 'react-router-dom';
import s from './Basket.module.scss';

const fmt = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
});

export default function Basket() {
    const d = useDispatch();
    const items  = useSelector(selectCartItems);
    const totals = useSelector(selectTotals);
    const status = useSelector(selectCartStatus);

    // підвантажити кошик при монтуванні
    useEffect(() => { d(loadCart()); }, [d]);

    const onQtyChange = (id, val) => {
        const qty = Math.max(1, Number(val) || 1);
        d(setCartQty({ id, qty }));
    };

    return (
        <section className="container card">
            <h1>Кошик</h1>

            {items.length === 0 ? (
                <div>
                    Кошик порожній. <Link to="/products">До каталогу</Link>
                </div>
            ) : (
                <>
                    <table className={s.table}>
                        <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Ціна</th>
                            <th>К-сть</th>
                            <th>Сума</th>
                            <th />
                        </tr>
                        </thead>
                        <tbody>
                        {items.map((i) => {
                            const price = Number(i.price) || 0;
                            const qty   = Number(i.qty)   || 0;
                            return (
                                <tr key={`cart-${i.id ?? i.sku}`}>
                                    <td>{i.title}</td>
                                    <td>{fmt.format(Math.round(price))}</td>
                                    <td>
                                        <input
                                            type="number"
                                            min="1"
                                            value={qty}
                                            disabled={status === 'loading'}
                                            onChange={(e) => onQtyChange(i.id, e.target.value)}
                                            style={{ width: 70 }}
                                        />
                                    </td>
                                    <td>{fmt.format(Math.round(price * qty))}</td>
                                    <td>
                                        <button
                                            className="btn"
                                            disabled={status === 'loading'}
                                            onClick={() => d(removeFromCart(i.id))}
                                            aria-label="Видалити з кошика"
                                        >
                                            ×
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>

                    <div className={s.row}>
                        <div>
                            Всього: <b className="price">{fmt.format(Math.round(totals.sum))}</b>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button
                                className="btn"
                                disabled={status === 'loading'}
                                onClick={() => d(clearCartRemote())}
                            >
                                Очистити
                            </button>
                            <Link
                                to="/checkout"
                                className="btn primary"
                                aria-disabled={status === 'loading'}
                            >
                                Оформити
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
