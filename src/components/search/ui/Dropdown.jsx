import React from 'react';
import s from '../SearchBar.module.scss';

export function Dropdown({ open, showPopular, popular = [], suggestions = [], activeIdx, setActiveIdx, onPick }) {
    if (!open) return null;
    return (
        <div className={s.dropdown} role="listbox">
            {showPopular ? (
                <>
                    <div className={s.sectionTitle}>Популярне</div>
                    <div className={s.chips}>
                        {popular.map((it, i) => (
                            <button key={i} type="button" onClick={()=> onPick(it)} className={s.chip}>
                                {it.label}
                            </button>
                        ))}
                    </div>
                </>
            ) : (
                <div className={s.list}>
                    {suggestions.map((it, i) => (
                        <button
                            key={i}
                            type="button"
                            role="option"
                            aria-selected={activeIdx === i}
                            onMouseEnter={()=> setActiveIdx(i)}
                            onClick={()=> onPick(it)}
                            className={`${s.item} ${activeIdx === i ? s.itemActive : ''}`}
                        >
                            {it.label}
                        </button>
                    ))}
                    {suggestions.length === 0 && (
                        <div className={s.empty}>Нічого не знайдено</div>
                    )}
                </div>
            )}
        </div>
    );
}