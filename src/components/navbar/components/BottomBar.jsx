import { Link } from 'react-router-dom';
import { IconBurger, IconCart, IconHome, IconLogin, IconUser } from './Icons.jsx';
import s from '../stylesNavbar/BottomBar.module.scss';

export default function BottomBar({ totals, user, nav, openMobileCatalog }) {
    return (
        <nav className={s.bar}>
            <button className={s.item} onClick={() => nav('/home')}>
                <IconHome /> <span>Головна</span>
            </button>

            {/* Відкриває mobile sheet */}
            <button className={s.item} onClick={openMobileCatalog}>
                <IconBurger /> <span>Каталог</span>
            </button>

            <Link className={`${s.item} ${s.cart}`} to="/cart">
                <IconCart />
                {(totals.qty ?? 0) > 0 && <span className={s.bubble}>{totals.qty}</span>}
            </Link>

            {user ? (
                <button className={s.item} onClick={() => nav('/account')}>
                    <IconUser /> <span>Профіль</span>
                </button>
            ) : (
                <button className={s.item} onClick={() => nav('/login')}>
                    <IconLogin /> <span>Увійти</span>
                </button>
            )}
        </nav>
    );
}
