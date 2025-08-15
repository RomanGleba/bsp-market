// Header.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import s from './Header.module.scss';
import ThemeToggle from '../themetoggle/ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotals } from '../../store/cartSlice';
import { selectUser, logout } from '../../store/authSlice';
import { selectProducts } from '../../store/productsSlice'; 
import SearchBar from '../searchbar/SearchBar';
import logoUrl from '../../assets/react.svg';

// Мікс: категорії (як фільтри) + ключові слова (рядки)
export const POPULAR = [
  { label: 'Корм', params: { cat: 'Корм' } },
  { label: 'Іграшки', params: { cat: 'Іграшки' } },
  { label: 'Амуниція', params: { cat: 'Амуниція' } },
  { label: 'Посуд', params: { cat: 'Посуд' } },
  { label: 'Лакомства', params: { cat: 'Лакомства' } },
  'Royal Canin',
  'Brit Care',
  'Вітаміни для котів',
  'Автопоїлка для собак'
];

const Header = () => {
  const totals = useSelector(selectTotals);
  const user = useSelector(selectUser);
  const products = useSelector(selectProducts); // 👈 усі товари з Redux
  const d = useDispatch();
  const nav = useNavigate();

  return (
    <header className={s.header}>
      <div className={'container ' + s.inner}>
        <button className={s.brand} onClick={() => nav('/')} aria-label="На головну">
          <img src={logoUrl} alt="logo" className={s.logo} />
          <span>BSP Market</span>
        </button>

        <div className={s.center}>
          <SearchBar
            placeholder="Я шукаю…"
            popular={POPULAR}
            products={products}   
          />
        </div>

        <nav className={s.nav}>
          <Link className={s.link} to="/products">Каталог</Link>
          <Link className={`${s.link} ${s.basket}`} to="/cart" aria-label="Кошик">
            🛒<span className={s.bubble}>{totals.qty}</span>
          </Link>
          {user ? (
            <>
              <span className={s.link} title={user.email}>👤 {user.email}</span>
              <button className="btn" onClick={() => d(logout())}>Вийти</button>
            </>
          ) : (
            <>
              <Link className={s.link} to="/login">Увійти</Link>
              <Link className={s.link} to="/register">Реєстрація</Link>
            </>
          )}
          <ThemeToggle compact />
        </nav>
      </div>
    </header>
  );
};

export default Header;
