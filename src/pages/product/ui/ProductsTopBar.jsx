import React from 'react';

export function ProductsTopBar({ total, currentPage, totalPages, q, onClear }) {
    return (
        <div className={"topBar"}>
            <div className={"count"}>
                Знайдено: <b>{Number(total) || 0}</b> · стор. {currentPage}/{totalPages}
            </div>
            {!!q && (
                <button className="btn" onClick={onClear} title="Очистити пошук">
                    ✕ Очистити «{q}»
                </button>
            )}
        </div>
    );
}