import React from 'react';
import { Link } from 'react-router-dom';
import s from '../BasketPage.module.scss';


const fmt = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
});


export function BasketSummary({ total = 0, isLoading, onClear }) {
    return (
        <div className={s.row}>
            <div>
                Всього: <b className="price">{fmt.format(total)}</b>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" disabled={isLoading} onClick={onClear}>
                    Очистити
                </button>
                <Link
                    to="/checkout"
                    className={`btn primary${isLoading ? ' disabled' : ''}`}
                    aria-disabled={isLoading}
                >
                    Оформити
                </Link>
            </div>
        </div>
    );
}