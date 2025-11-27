import React, { useEffect } from 'react';
import s from '../SearchBar.module.scss';

export function SearchInput({
                                value,
                                onChange,
                                onClear,
                                onFocus,
                                placeholder,
                                boxRef,
                                open,
                                setOpen,
                                activeIdx,
                                setActiveIdx,
                                activeList,
                                onPick,
                            }) {
    // close on outside click
    useEffect(() => {
        const onDoc = (e) => { if (!boxRef.current?.contains(e.target)) setOpen(false); };
        document.addEventListener('pointerdown', onDoc);
        return () => document.removeEventListener('pointerdown', onDoc);
    }, [boxRef, setOpen]);

    const onKeyDown = (e) => {
        if (!open) return;
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, activeList.length - 1)); }
        if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
        if (e.key === 'Enter' && activeIdx >= 0 && activeList[activeIdx]) {
            e.preventDefault();
            onPick(activeList[activeIdx]);
        }
    };

    return (
        <>
            <input
                value={value}
                onChange={(e)=> onChange(e.target.value)}
                onFocus={onFocus}
                placeholder={placeholder}
                aria-label="Пошук"
                className={s.input}
                onKeyDown={onKeyDown}
            />
            <span className={s.icon}>🔍</span>
            {!!value && (
                <button type="button" onClick={onClear} aria-label="Очистити" className={s.clear}>✕</button>
            )}
        </>
    );
}