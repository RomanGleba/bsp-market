// CategoryDrawer.jsx
import React from "react";
import { Link } from "react-router-dom";
import s from "./CategoryDrawer.module.scss";

export default function CategoryDrawer({
                                           open,
                                           onClose,
                                           sections = [],
                                           allLink = "/products",
                                       }) {
    if (!open) return null;

    return (
        <div className={s.sheet} role="dialog" aria-label="Каталог">
            <div className={s.body}>
                <div className={s.head}>
                    <strong>Каталог</strong>
                    <button
                        className={s.close}
                        onClick={onClose}
                        aria-label="Закрити"
                        type="button"
                    >
                        ✕
                    </button>
                </div>

                <div className={s.bodyInner}>
                    {sections.map((sec) => (
                        <div className={s.block} key={sec.key}>
                            <div className={s.blockTitle}>
                                <span className={s.ic}>{sec.icon}</span>
                                {sec.label}
                            </div>
                            <div className={s.cols}>
                                {sec.columns?.map((col, i) => (
                                    <div className={s.col} key={i}>
                                        {col.title && (
                                            <div className={s.colCap}>
                                                {col.title}
                                            </div>
                                        )}
                                        <ul>
                                            {col.items?.map((it, j) => (
                                                <li key={`${sec.key}-${i}-${j}`}>
                                                    <Link
                                                        to={it.to}
                                                        onClick={onClose}
                                                    >
                                                        {it.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link
                        className={s.all}
                        to={allLink}
                        onClick={onClose}
                    >
                        Всі категорії
                    </Link>
                </div>
            </div>
        </div>
    );
}
