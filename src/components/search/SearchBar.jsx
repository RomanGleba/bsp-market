import React, { useMemo, useRef, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useDebounced } from './hooks/useDebounced.js';
import { useSearchSuggestions } from './hooks/useSearchSuggestions';
import { normalizeItem } from './utils/normalizeItem';
import { buildProductsUrl } from './utils/buildProductsUrl';
import { SearchInput } from './ui/SearchInput';
import { Dropdown } from './ui/Dropdown';
import s from './SearchBar.module.scss';

export default function SearchBar({
                                      placeholder = 'Я шукаю…',
                                      suggestFn,               // async (q) => (string[] | {label, params}|{label,q})[]
                                      popular = [],            // string[] | {label, params}[] | {label,q}[]
                                      products = [],           // масив усіх товарів для фільтрації чіпів
                                  }) {
    const nav = useNavigate();
    const loc = useLocation();
    const [sp] = useSearchParams();

    const [q, setQ] = useState(sp.get('q') || '');
    const qd = useDebounced(q, 200);

    const [open, setOpen] = useState(false);
    const [activeIdx, setActiveIdx] = useState(-1);
    const box = useRef(null);

    // Suggestions (normalized)
    const { suggestions } = useSearchSuggestions({ q: qd, suggestFn, open, setActiveIdx });
    const sugNorm = useMemo(
        () => (suggestions || []).map(normalizeItem).filter(Boolean),
        [suggestions]
    );

    // Popular (normalized + filtered by products availability)
    const popularNormRaw = useMemo(
        () => (popular || []).map(normalizeItem).filter(Boolean),
        [popular]
    );
    const popularNorm = useMemo(() => {
        if (!Array.isArray(products) || products.length === 0) {
            return popularNormRaw.filter(it => it.type !== 'cat');
        }
        return popularNormRaw.filter(it => {
            if (it.type !== 'cat') return true;
            const cat = it.action?.cat;
            if (!cat) return false;
            const catLc = String(cat).toLowerCase();
            return products.some(p => (p.category || '').toLowerCase() === catLc);
        });
    }, [popularNormRaw, products]);

    // Navigation helper
    const goSearch = (normalizedItem) => {
        if (!normalizedItem) return;
        const url = buildProductsUrl({
            locationSearch: loc.search,
            action: normalizedItem.action || {},
        });
        nav(url);
        setOpen(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const url = buildProductsUrl({ locationSearch: loc.search, action: { q } });
        nav(url);
        setOpen(false);
    };

    const showPopular = open && !qd.trim() && popularNorm.length > 0;
    const activeList = showPopular ? popularNorm : sugNorm;

    return (
        <form
            ref={box}
            onSubmit={onSubmit}
            className={s.form}
            role="search"
        >
            <div className={s.inputWrap}>
                <SearchInput
                    value={q}
                    onChange={(v) => { setQ(v); setOpen(true); }}
                    onFocus={() => setOpen(true)}
                    onClear={() => setQ('')}
                    placeholder={placeholder}
                    boxRef={box}
                    open={open}
                    setOpen={setOpen}
                    activeIdx={activeIdx}
                    setActiveIdx={setActiveIdx}
                    activeList={activeList}
                    onPick={(it) => goSearch(it)}
                />
            </div>

            <button className={`btn ${s.submit}`} type="submit">Знайти</button>

            <Dropdown
                open={open}
                showPopular={showPopular}
                popular={popularNorm}
                suggestions={sugNorm}
                activeIdx={activeIdx}
                setActiveIdx={setActiveIdx}
                onPick={(it) => goSearch(it)}
            />
        </form>
    );
}
