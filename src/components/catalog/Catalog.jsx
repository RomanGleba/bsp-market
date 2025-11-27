// src/components/catalog/Catalog.jsx
import React from 'react';

// 👉 якщо інші місця (Navbar/SearchBar) імпортують POPULAR — залишаємо тут
export const POPULAR = [
    { label: 'Корм',     params: { category: 'Корм' } },
    { label: 'Іграшки',  params: { category: 'Іграшки' } },
    { label: 'Амуниція', params: { category: 'Амуниція' } },
];

// Вся логіка фільтрів/URL/запитів тепер у CatalogPanel
import CatalogPanel from './CatalogPanel.jsx';

export default function Catalog() {
    return (
        <aside style={{ display: 'grid', gap: 12 }}>
            <CatalogPanel />
        </aside>
    );
}
