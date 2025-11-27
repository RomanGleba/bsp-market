// CatalogTrigger.jsx
import { IconBurger } from './Icons';
import s from '../stylesNavbar/CatalogTrigger.module.scss';

export default function CatalogTrigger({ onClick, btnRef, menuOpen }) {
    return (
        <button
            ref={btnRef}
            className={`${s.sideTrigger} ${menuOpen ? s.isOpen : ''}`}
            aria-expanded={menuOpen}
            onClick={onClick}
            type="button"
        >
            <span className={s.ic}>
                <IconBurger />
            </span>
            <span className={s.label}>Каталог</span>
        </button>
    );
}
