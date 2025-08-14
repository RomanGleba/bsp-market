import React from 'react';
import { Link } from 'react-router-dom';
import s from './Header.module.scss';
import ThemeToggle from '../themetoggle/ThemeToggle';
import { useSelector, useDispatch } from 'react-redux';
import { selectTotals } from '../../store/cartSlice';
import { selectUser, logout } from '../../store/authSlice';
import logoUrl from "../../assets/react.svg"

const Header = () => {
  const totals = useSelector(selectTotals);
  const user = useSelector(selectUser);
  const d = useDispatch();

  return (
    <header className={s.header}>
      <div className={'container ' + s.inner}>
        <div className={s.brand}>
          <img src={logoUrl} alt="logo" className={s.logo} />
          <Link to="/">BSP Market</Link>
        </div>
        <nav className={s.nav}>
          <Link className={s.link} to="/products">Каталог</Link>
          <Link className={s.link} to="/cart">Кошик ({totals.qty})</Link>
          {user ? (
            <>
              <span className={s.link}>{user.email}</span>
              <button className="btn" onClick={()=> d(logout())}>Вийти</button>
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
}

export default Header;