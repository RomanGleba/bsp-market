import { useDeferredValue } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

import {
    fetchProducts,
    selectProducts,
    selectProductsStatus,
    selectProductsError,
    selectProductsTotal,
    selectProductsLimit
} from "../../store/productsSlice";

import { useProductsData } from "./hooks/useProductsData";

import { ProductsTopBar } from "./ui/ProductsTopBar";
import { ProductsGrid } from "./ui/ProductsGrid";
import { ProductsPager } from "./ui/ProductsPager";
import s from "./ProductsPage.module.scss";

const PAGE_SIZE = 12;

export default function ProductsPage() {
    const d = useDispatch();

    const [sp] = useSearchParams();
    const category = sp.get("category") || "";
    const q = sp.get("q") || "";
    const pageUrl = Number(sp.get("page") || 1);

    const qDeferred = useDeferredValue(q);

    const items = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsError);
    const total = useSelector(selectProductsTotal);
    const limitFromStore = useSelector(selectProductsLimit);

    const {
        totalPages,
        currentPage,
        showEmpty,
        setPage
    } = useProductsData({
        dispatch: d,
        fetchAction: fetchProducts,
        category,
        q: qDeferred,
        page: pageUrl,
        pageSize: PAGE_SIZE,
        total,
        limitFromStore
    });

    const showError = status === "failed";
    const showLoadingInline =
        status === "loading" && (items?.length ?? 0) === 0;

    return (
        <section className="container">
            <div className={s.layout}>
                <ProductsTopBar
                    title={category || q || "Усі товари"}
                    total={total}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />

                {showLoadingInline && <div className="skeleton" style={{ height: 120 }} />}

                {showError && (
                    <div className="card">Помилка: {error || "Не вдалося завантажити товари"}</div>
                )}

                {!showError && (
                    <>
                        <ProductsGrid items={items} />

                        {showEmpty && (
                            <div className={`card ${s.empty}`}>
                                Нічого не знайдено.
                            </div>
                        )}

                        {totalPages > 1 && (
                            <ProductsPager
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onSetPage={setPage}
                            />
                        )}
                    </>
                )}
            </div>
        </section>
    );
}
