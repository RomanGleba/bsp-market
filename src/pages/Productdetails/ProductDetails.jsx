import React, { lazy, Suspense, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import {
    selectProductBySku,
    selectCurrentProduct,
    selectCurrentProductStatus,
    fetchProductBySku,
    clearCurrent,
} from "@/store/productsSlice"
import { addToCartRemote } from "@/store/cartSlice"
import CdnImage from "@/utils/cdnImage"
import s from "./ProductDetails.module.scss"

const ProductSections = lazy(() => import("./productSelections/ProductSelections.jsx"))

const fmt = new Intl.NumberFormat("uk-UA", {
    style: "currency",
    currency: "UAH",
})

export default function ProductDetails() {
    const { sku: rawSku } = useParams()
    const sku = decodeURIComponent(rawSku || "")
    const dispatch = useDispatch()

    const cached = useSelector(selectProductBySku(sku))
    const current = useSelector(selectCurrentProduct)
    const status = useSelector(selectCurrentProductStatus)
    const product = cached || current

    useEffect(() => {
        if (!sku) return
        dispatch(fetchProductBySku(sku))
        return () => dispatch(clearCurrent())
    }, [sku, dispatch])

    if (status === "loading" && !product) {
        return (
            <div className={s.container}>
                <div className={s.skeleton}></div>
            </div>
        )
    }

    if ((status === "succeeded" || status === "failed") && !product) {
        return (
            <div className={s.container}>
                <p>Товар не знайдено.</p>
                <Link to="/products" className="btn primary">Повернутися до каталогу</Link>
            </div>
        )
    }

    if (!product) return null

    const hasPromo = typeof product.promoPrice === "number" && product.promoPrice < product.price
    const price = hasPromo ? product.promoPrice : product.price
    const canBuy = product.isAvailable !== false

    return (
        <div className={s.container}>
            <div className={s.layout}>
                {/* Зображення */}
                <div className={s.media}>
                    {product.image ? (
                        <CdnImage
                            srcKey={product.image}
                            alt={product.title}
                            className={s.photo}
                        />
                    ) : (
                        <div className={s.noimg} aria-label="Зображення відсутнє" />
                    )}
                </div>

                {/* Інформація */}
                <div className={s.info}>
                    <h1 className={s.title}>{product.title}</h1>

                    <div className={s.meta}>
                        <span className={s.sku}>Код: <b>{product.sku}</b></span>
                        {product.brand && <span className={s.brand}>{product.brand}</span>}
                        {product.category && <span className={s.cat}>{product.category}</span>}
                        {!canBuy && <span className={s.badgeOutPill}>Немає в наявності</span>}
                    </div>

                    <div className={s.priceRow}>
                        <span className={s.price}>{fmt.format(price)}</span>
                        {hasPromo && (
                            <>
                                <span className={s.old}><s>{fmt.format(product.price)}</s></span>
                                <span className={s.badge}>Акція</span>
                            </>
                        )}
                    </div>

                    <div className={s.actions}>
                        <button
                            onClick={() =>
                                dispatch(addToCartRemote({
                                    id: product.id,
                                    sku: product.sku,
                                    title: product.title,
                                    price,
                                    image: product.image,
                                    qty: 1,
                                }))
                            }
                            className="btn primary"
                            disabled={!canBuy}
                        >
                            {canBuy ? "Додати в кошик" : "Немає в наявності"}
                        </button>
                        {canBuy && <span className={s.badgeIn}>Є в наявності</span>}
                    </div>
                </div>
            </div>

            {/* Додаткові секції */}
            <div className="mt-8">
                <Suspense
                    fallback={
                        <div className={s.card}>
                            <div className={s.skeleton}></div>
                        </div>
                    }
                >
                    <ProductSections product={product} />
                </Suspense>
            </div>

            <div className="mt-8">
            </div>
        </div>
    )
}
