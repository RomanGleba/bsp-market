import React, {
    useEffect, useMemo, useState,
    useLayoutEffect, useRef
} from 'react';

import { useNavigate } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';
import { selectTotals } from '../../store/cartSlice.js';
import { selectUser, logout } from '../../store/authSlice';
import { selectProducts, selectProductsStatus, fetchProducts } from '../../store/productsSlice';

import SearchBar from '../search/SearchBar';
import { fetchSuggest } from '../../api/suggestApi';
import { POPULAR } from '../catalog/Catalog';

import Brand from './components/Brand';
import CatalogTrigger from './components/CatalogTrigger';
import DesktopNav from './components/DesktopNav';
import BottomBar from './components/BottomBar';
import MobileSearchSheet from './components/MobileSearchSheet';
import MegaMenuWrapper from './components/MegaMenuWrapper';
import MobileCatalogSheet from './components/CatalogMenu/MobileCatalogSheet.jsx';

import s from './Navbar.module.scss';

export default function Navbar() {

    const totals = useSelector(selectTotals);
    const user = useSelector(selectUser);
    const items = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);

    const d = useDispatch();
    const nav = useNavigate();

    useEffect(() => {
        if (status === 'idle') d(fetchProducts({ page: 1, limit: 50 }));
    }, [status, d]);

    const searchIndex = useMemo(
        () => (items || []).map(({ id, title, sku, brand, category }) => ({
            id, title, sku, brand, category
        })),
        [items]
    );

    const [menuOpen, setMenuOpen] = useState(false);              // DESKTOP megamenu
    const [searchOpen, setSearchOpen] = useState(false);          // MOBILE search sheet
    const [mobileCatalogOpen, setMobileCatalogOpen] = useState(false); // MOBILE catalog sheet

    const headerRef = useRef(null);
    const catalogBtnRef = useRef(null);

    useLayoutEffect(() => {
        const el = headerRef.current;
        if (!el) return;
        const apply = () =>
            document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
        apply();
        const ro = new ResizeObserver(apply);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    // універсальна функція (ТОП!)
    const handleCatalogClick = () => {
        if (window.innerWidth <= 640) {
            setMobileCatalogOpen(true);     // mobile sheet
        } else {
            setMenuOpen(v => !v);           // desktop megamenu
        }
    };

    return (
        <>
            <header ref={headerRef} className={s.header}>
                <div className={`${s.inner} container`}>

                    <div className={s.desktopOnly}>
                        <CatalogTrigger
                            btnRef={catalogBtnRef}
                            menuOpen={menuOpen}
                            onClick={handleCatalogClick}
                        />
                    </div>

                    <Brand onClick={() => nav('/')} />

                    <button
                        className={`${s.link} ${s.mobileOnly} ${s.mobileSearchBtn}`}
                        type="button"
                        onClick={() => setSearchOpen(true)}
                    >
                        <span className={s.ic}>🔍</span>Пошук
                    </button>

                    <div className={`${s.center} ${s.desktopOnly}`}>
                        <SearchBar
                            placeholder="Я шукаю…"
                            popular={POPULAR}
                            products={searchIndex}
                            loading={status === 'loading'}
                            suggestFn={(q) => fetchSuggest(q, 8)}
                        />
                    </div>

                    <div className={s.desktopOnly}>
                        <DesktopNav
                            totals={totals}
                            user={user}
                            logout={() => d(logout())}
                        />
                    </div>
                </div>
            </header>

            <MegaMenuWrapper
                open={menuOpen}
                close={() => setMenuOpen(false)}
                anchorRef={catalogBtnRef}
            />

            <MobileSearchSheet
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                searchIndex={searchIndex}
                status={status}
                suggestFn={(q) => fetchSuggest(q, 8)}
            />

            <MobileCatalogSheet
                open={mobileCatalogOpen}
                onClose={() => setMobileCatalogOpen(false)}
                categories={['Корм', 'Іграшки', 'Амуниція', 'Гігієна']}
            />

            <div className={s.mobileOnly}>
                <BottomBar
                    totals={totals}
                    user={user}
                    nav={nav}
                    openMobileCatalog={handleCatalogClick}
                />
            </div>
        </>
    );
}
