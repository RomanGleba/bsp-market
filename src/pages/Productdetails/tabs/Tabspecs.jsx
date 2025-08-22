import c from '../productSelections/ProductTabs.module.scss';

export default function TabSpecs({ product }) {
    const attrs = product?.attrs || product?.specs || null;

    if (!attrs || Object.keys(attrs).length === 0) {
        return (
            <div className={c.section}>
                <h2 className={c.h2}>Характеристики</h2>
                <div className={c.muted}>Характеристики з’являться згодом.</div>
            </div>
        );
    }

    const fmtVal = (v) => {
        if (v == null) return '—';
        if (Array.isArray(v)) return v.join(', ');
        if (typeof v === 'boolean') return v ? 'так' : 'ні';
        return String(v);
    };

    const keys = Object.keys(attrs).sort((a,b)=>a.localeCompare(b,'uk'));

    return (
        <div className={c.section}>
            <div className={c.specsGrid}>
                {keys.map(k => {
                    const v = attrs[k];
                    if (v == null || v === '') return null;
                    return (
                        <div key={k} className={c.specRow}>
                            <div className={c.specKey}>{k}</div>
                            <div className={c.specVal}>{fmtVal(v)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
