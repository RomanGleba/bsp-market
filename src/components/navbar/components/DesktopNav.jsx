import { Link, NavLink } from 'react-router-dom';
import { IconCart, IconLogin, IconUser } from './Icons';
import s from '../stylesNavbar/DesktopNav.module.scss';

export default function DesktopNav({ totals, user, logout }) {
    return (
        <nav className={s.nav}>
            <NavLink className={s.link} to="/products">Товари</NavLink>

            <Link className={`${s.link} ${s.basket}`} to="/cart">
                <span><IconCart /></span>
                {(totals.qty ?? 0) > 0 && <span className={s.bubble}>{totals.qty}</span>}
            </Link>

            {user ? (
                <>
          <span className={s.link}>
            <IconUser /> {user.email || user.phone}
          </span>
                    <button className={s.btn} onClick={logout}>Вийти</button>
                </>
            ) : (
                <>
                    <NavLink className={s.link} to="/login"><IconLogin /> Увійти</NavLink>
                    <NavLink className={s.link} to="/register">Реєстрація</NavLink>
                </>
            )}
        </nav>
    );
}
