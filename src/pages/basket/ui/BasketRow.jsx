import React from "react";
import CdnImage from "@/utils/CdnImage";
import s from "./BasketRow.module.scss";

export function BasketRow({ item, isLoading, onQtyChange, onRemove, fmt }) {
    const price = Number(item.price) || 0;
    const qty = Math.max(1, Number(item.qty) || 1);
    const canMutate = !isLoading && Boolean(item.id);

    return (
        <tr className={s.row}>
            {/* ——— ЗОБРАЖЕННЯ + НАЗВА ——— */}
            <td className={s.productCell}>
                <CdnImage srcKey={item.image} alt={item.title} className={s.thumb} />

                <div className={s.productInfo}>
                    <span className={s.title}>{item.title}</span>
                </div>
            </td>

            {/* ——— ЦІНА ——— */}
            <td className={s.price}>{fmt.format(price)}</td>

            {/* ——— КІЛЬКІСТЬ з кнопками ——— */}
            <td className={s.qtyCell}>
                <div className={s.qtyBox}>
                    <button
                        className={s.qtyBtn}
                        disabled={!canMutate || qty <= 1}
                        onClick={() => onQtyChange(item.id, qty - 1)}
                    >
                        –
                    </button>

                    <span className={s.qtyValue}>{qty}</span>

                    <button
                        className={s.qtyBtn}
                        disabled={!canMutate}
                        onClick={() => onQtyChange(item.id, qty + 1)}
                    >
                        +
                    </button>
                </div>
            </td>

            {/* ——— СУМА ——— */}
            <td className={s.sum}>{fmt.format(price * qty)}</td>

            {/* ——— ВИДАЛИТИ ——— */}
            <td className={s.removeCell}>
                <button
                    className={s.removeBtn}
                    disabled={!canMutate}
                    onClick={() => onRemove(item.id)}
                >
                    ×
                </button>
            </td>
        </tr>
    );
}
