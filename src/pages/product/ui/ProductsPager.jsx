import React from 'react';
import { Link } from 'react-router-dom';

export function ProductsPager({ q, currentPage, totalPages, onSetPage }) {
    const pagesToShow = Math.min(totalPages, 7);
    const nums = Array.from({ length: pagesToShow }, (_, i) => i + 1);

    return (
        <nav className="pager" aria-label="Пагінація">
            <button className="btn" disabled={currentPage === 1} onClick={() => onSetPage(currentPage - 1)}>
                ‹ Назад
            </button>

            {nums.map((n) => {
                const params = new URLSearchParams();
                if (q) params.set('q', q);
                if (n > 1) params.set('page', String(n));
                return (
                    <Link
                        key={`pg-${n}`}
                        to={`?${params.toString()}`}
                        className="btn"
                        aria-current={n === currentPage ? 'page' : undefined}
                        onClick={(e) => { e.preventDefault(); onSetPage(n); }}
                    >
                        {n}
                    </Link>
                );
            })}

            <button className="btn" disabled={currentPage === totalPages} onClick={() => onSetPage(currentPage + 1)}>
                Вперед ›
            </button>
        </nav>
    );
}