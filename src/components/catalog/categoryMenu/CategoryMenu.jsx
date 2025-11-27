import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import s from "./CategoryMenu.module.scss";

/**
 * props:
 * - open       : boolean
 * - onClose    : fn
 * - sections   : MENU_SECTIONS (масив)
 * - allLink    : string ("/products?...") для «Всі категорії»
 * - anchorRef  : ref кнопки, щоб правильно позиціонувати
 */
export default function CategoryMenu({
                                         open,
                                         onClose,
                                         sections = [],
                                         allLink = "/products",
                                         anchorRef,
                                     }) {
    const [active, setActive] = useState(sections[0]?.key);
    const panelRef = useRef(null);

    useEffect(() => {
        if (!open) return;
        const onKey = (e) => e.key === "Escape" && onClose?.();
        const onClickOutside = (e) => {
            const p = panelRef.current;
            if (!p) return;
            if (!p.contains(e.target) && !anchorRef?.current?.contains?.(e.target)) {
                onClose?.();
            }
        };
        document.addEventListener("keydown", onKey);
        document.addEventListener("mousedown", onClickOutside);
        return () => {
            document.removeEventListener("keydown", onKey);
            document.removeEventListener("mousedown", onClickOutside);
        };
    }, [open, onClose, anchorRef]);

    if (!open) return null;

    const current = sections.find((x) => x.key === active) || sections[0];

    return (
        <div className={s.wrap} role="dialog" aria-label="Каталог">
            {/* внутрішня панель, по центру */}
            <div className={s.inner} ref={panelRef}>
                {/* Ліва колонка */}
                <aside className={s.left}>
                    <ul className={s.tree} role="menu">
                        {sections.map((sec) => (
                            <li key={sec.key}>
                                <button
                                    type="button"
                                    className={`${s.leftItem} ${
                                        active === sec.key ? s.active : ""
                                    }`}
                                    onMouseEnter={() => setActive(sec.key)}
                                    onFocus={() => setActive(sec.key)}
                                    onClick={() => setActive(sec.key)}
                                >
                                    <span className={s.ic} aria-hidden="true">
                                        {sec.icon}
                                    </span>
                                    <span>{sec.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                    <Link className={s.all} to={allLink} onClick={onClose}>
                        Всі категорії
                    </Link>
                </aside>

                {/* Правий контент (колонки) */}
                <section className={s.right}>
                    {current?.columns?.map((col, i) => (
                        <div className={s.col} key={i}>
                            {col.title && (
                                <div className={s.colTitle}>{col.title}</div>
                            )}
                            <ul className={s.links}>
                                {col.items?.map((it, j) => (
                                    <li key={`${i}-${j}`}>
                                        <Link to={it.to} onClick={onClose}>
                                            {it.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}
