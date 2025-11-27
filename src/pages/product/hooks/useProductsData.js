import { useEffect, useMemo } from 'react';

export function useProductsData({
                                    dispatch,
                                    fetchAction,
                                    category,
                                    q,
                                    page,
                                    pageSize,
                                    total,
                                    limitFromStore
                                }) {
    const limit = Number(limitFromStore) || pageSize;
    const totalPages = Math.max(1, Math.ceil((Number(total) || 0) / limit));
    const currentPage = Math.min(Math.max(1, page), totalPages);

    useEffect(() => {
        dispatch(
            fetchAction({
                category,     // 🔥 бекенд чекає саме category
                q,
                page: currentPage,
                limit: pageSize,
            })
        );
    }, [dispatch, fetchAction, category, q, currentPage, pageSize]);

    return useMemo(
        () => ({
            totalPages,
            currentPage,
            showEmpty: (Number(total) || 0) === 0,
        }),
        [totalPages, currentPage, total]
    );
}
