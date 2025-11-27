import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useProductsSearchParams() {
    const [sp, setSp] = useSearchParams();

    const pageRaw = Number(sp.get('page') || 1);
    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const api = useMemo(() => ({
        setPage: (n) => {
            const next = new URLSearchParams(sp);

            if (n > 1) next.set('page', String(n));
            else next.delete('page');

            setSp(next, { replace: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        clearPage: () => {
            const next = new URLSearchParams(sp);
            next.delete('page');
            setSp(next, { replace: true });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }), [sp, setSp]);

    return { page, ...api };
}
