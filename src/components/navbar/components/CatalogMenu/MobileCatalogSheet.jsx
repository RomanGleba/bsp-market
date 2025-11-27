import s from "./MobileCatalogSheet.module.scss";

export default function MobileCatalogSheet({ open, onClose, categories }) {
    return (
        <aside className={`${s.sheet} ${open ? s.open : ""}`}>
            <div className={s.header}>
                <button className={s.close} onClick={onClose}>✕</button>
                <strong>Каталог товарів</strong>
            </div>

            <div className={s.body}>
                {categories.map(cat => (
                    <button key={cat} className={s.catItem}>
                        {cat}
                    </button>
                ))}
            </div>
        </aside>
    );
}
