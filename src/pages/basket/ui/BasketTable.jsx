import React from 'react';
import { BasketRow } from './BasketRow';
import s from './BasketTable.module.scss';

export function BasketTable({ items = [], isLoading, onQtyChange, onRemove, fmt }) {
    return (
        <table className={s.table}>
            <thead>
            <tr>
                <th>Товар</th>
                <th>Ціна</th>
                <th>Кількість</th>
                <th>Сума</th>
                <th />
            </tr>
            </thead>

            <tbody>
            {items.map((i, idx) => (
                <BasketRow
                    key={i.id ?? i.sku ?? `row-${idx}`}
                    item={i}
                    isLoading={isLoading}
                    onQtyChange={onQtyChange}
                    onRemove={onRemove}
                    fmt={fmt}
                />
            ))}
            </tbody>
        </table>
    );
}
