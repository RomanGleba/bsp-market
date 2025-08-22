// src/components/header/Header.jsx
import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Header.module.scss';

import { useSelector, useDispatch } from 'react-redux';
import { selectTotals } from '../../store/cartSlice';
import { selectUser, logout } from '../../store/authSlice';

// ⬇️ беремо селектори/санки з нового productsSlice
import {
    selectProducts,
    selectProductsStatus,
    fetchProducts
} from '../../store/productsSlice';

import SearchBar from '../searchbar/SearchBar';
import logoUrl from '../../assets/react.svg';

import { POPULAR} from "../catalog/Catalog.jsx";


const Header = () => {
    const totals  = useSelector(selectTotals);
    const user    = useSelector(selectUser);
    const items   = useSelector(selectProducts);        // масив товарів
    const status  = useSelector(selectProductsStatus);  // 'idle' | 'loading' | ...
    const d = useDispatch();
    const nav = useNavigate();

    // 1) Автозавантаження каталогу (раз на старт)
    useEffect(() => {
        if (status === 'idle') {
            d(fetchProducts({ page: 1, limit: 50 })); // змінюй ліміт як треба
        }
    }, [status, d]);

    // 2) Легкий індекс для пошуку, щоб не тягти важкі поля в SearchBar
    const searchIndex = useMemo(
        () => (items || []).map(({ id, name, sku, brand, category }) => ({
            id, name, sku, brand, category
        })),
        [items]
    );

    return (
        <header className={s.header}>
            <div className={`container ${s.inner}`}>
                {/* семантично можна і <Link> замість кнопки; якщо лишаєш кнопку — додай type="button" */}
                <button
                    type="button"
                    className={s.brand}
                    onClick={() => nav('/')}
                    aria-label="На головну"
                >
                    <img src={logoUrl} alt="BSP Market logo" className={s.logo} />
                    <span>Dasty Pet Food</span>
                </button>

                <div className={s.center}>
                    <SearchBar
                        placeholder="Я шукаю…"
                        popular={POPULAR}
                        products={searchIndex}         // легша структура
                        loading={status === 'loading'} // щоб показати спінер
                    />
                </div>

                <nav className={s.nav}>
                    <Link className={s.link} to="/products">Каталог</Link>

                    <Link className={`${s.link} ${s.basket}`} to="/cart" aria-label="Кошик">
                        <span className={s.cartIcon} aria-hidden="true">🛒</span>
                        {(totals.qty ?? 0) > 0 && <span className={s.bubble}>{totals.qty}</span>}
                    </Link>
                    {user ? (
                        <>
                            <span className={s.link} title={user.email}>👤 {user.email}</span>
                            <button type="button" className="btn" onClick={() => d(logout())}>Вийти</button>
                        </>
                    ) : (
                        <>
                            <Link className={s.link} to="/login">Увійти</Link>
                            <Link className={s.link} to="/register">Реєстрація</Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;
