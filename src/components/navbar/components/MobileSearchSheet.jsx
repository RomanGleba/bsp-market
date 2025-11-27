import SearchBar from '../../search/SearchBar.jsx';
import { POPULAR } from '../../catalog/Catalog.jsx';
import s from '../stylesNavbar/MobileSearchSheet.module.scss';

export default function MobileSearchSheet({ open, onClose, searchIndex, status, suggestFn }) {
    return (
        <aside className={`${s.sheet} ${open ? s.open : ''}`}>

            {/* HEADER */}
            <div className={s.header}>
                <button className={s.close} onClick={onClose}>✕</button>
                <strong>Пошук</strong>
            </div>

            {/* SEARCH BAR */}
            <div className={s.searchWrap}>
                <SearchBar
                    autoFocus
                    placeholder="Я шукаю…"
                    popular={POPULAR}
                    products={searchIndex}
                    loading={status === 'loading'}
                    suggestFn={suggestFn}
                    onPicked={onClose}
                />
            </div>
        </aside>
    );
}
