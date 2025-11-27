// src/pages/Basket.jsx
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCartItems,
    selectTotals,
    selectCartStatus,
    loadCart,
    setCartQtyRemote,
    removeFromCartRemote,
    clearCartRemote,
} from '../../store/cartSlice.js';
import { BasketTable } from './ui/BasketTable';
import { BasketSummary } from './ui/BasketSummary';
import { Link, useNavigate } from 'react-router-dom';
import s from './BasketPage.module.scss';

const fmt = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
});

export default function BasketPage() {
    const d = useDispatch();
    const nav = useNavigate();

    const items = useSelector(selectCartItems);
    const totals = useSelector(selectTotals);
    const status = useSelector(selectCartStatus);

    const isLoading = status === 'loading';
    const totalUAH = useMemo(() => fmt.format(Math.round(totals.sum || 0)), [totals.sum]);

    useEffect(() => { d(loadCart()); }, [d]);

    const onQtyChange = (id, val) => {
        const qty = Math.max(1, Number(val) || 1);
        if (!id) return;
        d(setCartQtyRemote({ id, qty }));
    };

    const onRemove = (id) => { if (id) d(removeFromCartRemote(id)); };

    if (!isLoading && items.length === 0) {
        return (
            <section className={`container ${s.emptyWrap}`}>
                <div className={`card ${s.emptyCard}`}>
                    <div className={s.emptyIcon} aria-hidden>🛍️</div>
                    <h1>Кошик</h1>
                    <p>Тут поки порожньо. Додайте щось із каталогу — знижки вже чекають!</p>
                    <div className={s.emptyActions}>
                        <Link className="btn" to="/products">Перейти в каталог</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={`container ${s.wrap}`}>
            <h1 className={s.title}>Кошик</h1>

            {isLoading && items.length === 0 && (
                <div className="skeleton" style={{ height: 220, borderRadius: 12 }} />
            )}

            <div className={s.grid}>
                {/* Ліва колонка — товари */}
                <div className={`card ${s.itemsCard}`}>
                    <BasketTable
                        items={items}
                        isLoading={isLoading}
                        onQtyChange={onQtyChange}
                        onRemove={onRemove}
                        fmt={fmt}
                    />

                    <div className={s.cardActions}>
                        <button
                            type="button"
                            className={s.linkBtn}
                            onClick={() => d(clearCartRemote())}
                            disabled={isLoading || items.length === 0}
                        >
                            Очистити кошик
                        </button>
                        <Link className={s.linkBtn} to="/products">Продовжити покупки</Link>
                    </div>
                </div>

                {/* Права колонка — підсумок */}
                <aside className={`card ${s.summaryCard}`} aria-label="Підсумок замовлення">
                    <BasketSummary
                        total={Math.round(totals.sum || 0)}
                        isLoading={isLoading}
                        onClear={() => d(clearCartRemote())}
                    />

                    <div className={s.totalRow}>
                        <span>До сплати</span>
                        <b className={s.total}>{totalUAH}</b>
                    </div>

                    <button
                        type="button"
                        className="btn primary"
                        disabled={isLoading || items.length === 0}
                        onClick={() => nav('/checkout')}
                    >
                        Оформити замовлення
                    </button>

                    <p className={s.note}>Безпечна оплата. Дані передаємо захищеним каналом.</p>
                </aside>
            </div>

            {/* Мобільний “липкий” бар оформлення */}
            <div className={s.stickyBar} role="region" aria-label="Швидке оформлення">
                <div className={s.stickySum}>
                    <span>Разом:</span>
                    <b>{totalUAH}</b>
                </div>
                <button
                    type="button"
                    className="btn primary"
                    disabled={isLoading || items.length === 0}
                    onClick={() => nav('/checkout')}
                >
                    Оформити
                </button>
            </div>
        </section>
    );
}
