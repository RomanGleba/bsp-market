import ProductCard from '../../../components/productcard/ProductCard';
import s from '../ProductsPage.module.scss';
const keyOf = (p, i) => `prod-${p?.sku || p?.id || 'x'}-${i}`;

export function ProductsGrid({ items = [] }) {
    return (
        <div className={s.grid}>
            {items.map((p, i) => (
                <ProductCard key={keyOf(p, i)} product={p} />
            ))}
        </div>
    );
}
