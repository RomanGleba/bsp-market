import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { addToCartRemote } from "@/store/cartSlice"
import CdnImage from "@/utils/cdnImage"
import s from "./ProductCard.module.scss"

const fmtUAH = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
    maximumFractionDigits: 0,
})

export default function ProductCard({ product = {} }) {
    const d = useDispatch()

    const priceBase = Number(product.price ?? 0)
    const promo = product.promoPrice != null ? Number(product.promoPrice) : null
    const hasPromo = promo != null && promo < priceBase && promo >= 0
    const priceNow = hasPromo ? promo : priceBase
    const canBuy = !!priceNow && product.isAvailable !== false
    const imgKey = product.thumb || product.image || ""
    const titleText = product.title || product.name || "Без назви"
    const slug = encodeURIComponent(product.sku || product.id || "")

    const handleAdd = () => {
        if (!canBuy) return
        d(addToCartRemote({
            id: product.id,
            sku: product.sku,
            title: titleText,
            price: priceBase,
            promoPrice: promo,
            image: imgKey,
            qty: 1,
        }))
    }

    const out = product.isAvailable === false

    return (
        <div className={`${s.card} ${out ? s.out : ""}`}>
            <Link to={`/product/${slug}`} className={s.media}>
                {imgKey ? (
                    <CdnImage
                        className={s.thumb}
                        srcKey={imgKey}
                        alt={titleText}
                        decoding="async"
                    />
                ) : (
                    <div className={s.noimg} aria-label="Зображення відсутнє" />
                )}
                {out && <span className={s.badgeOut}>Немає в наявності</span>}
            </Link>

            <Link to={`/product/${slug}`} className={s.title}>
                {titleText}
            </Link>

            <div className={s.row}>
                {hasPromo ? (
                    <>
                        <div className={s.priceWrap}>
                            <span className={s.priceNow}>{fmtUAH.format(Math.round(priceNow))}</span>
                            <span className={s.priceOld}>{fmtUAH.format(Math.round(priceBase))}</span>
                        </div>
                        <span className="badge">Акція</span>
                    </>
                ) : (
                    <span className={s.priceNow}>{fmtUAH.format(Math.round(priceNow))}</span>
                )}
            </div>

            <div className={s.row}>
        <span className={`badge ${out ? s.badgeOutPill : s.badgeIn}`}>
          {out ? "Немає в наявності" : "Є в наявності"}
        </span>
                <button
                    className={`${s.buyBtn} btn primary`}
                    disabled={!canBuy}
                    aria-disabled={!canBuy}
                    onClick={handleAdd}
                >
                    Додати
                </button>
            </div>
        </div>
    )
}
