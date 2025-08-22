import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import s from './ProductTabs.module.scss';

const TabDesc   = lazy(() => import('../tabs/TabDesc'));
const TabSpecs  = lazy(() => import('../tabs/Tabspecs'));   // залишив назву як у тебе
const ReviewsQA = lazy(() => import('./ReviewsQa'));        // компонент нижче

// Рендерить children лише коли блок з’явився у вікні
function LazyOnView({ children, rootMargin = '250px 0px', once = true }) {
    const [show, setShow] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current || show) return;
        const io = new IntersectionObserver(([e]) => {
            if (e.isIntersecting) {
                setShow(true);
                if (once) io.disconnect();
            }
        }, { root: null, rootMargin, threshold: 0.01 });
        io.observe(ref.current);
        return () => io.disconnect();
    }, [show, rootMargin, once]);

    return <div ref={ref}>{show ? children : null}</div>;
}

// Просте «scroll spy», щоб підсвічувати активну вкладку під час скролу
function useScrollSpy(ids = []) {
    const [active, setActive] = useState(ids[0] || '');
    useEffect(() => {
        const obs = new IntersectionObserver(
            (entries) => {
                entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
                    .forEach((e) => setActive(e.target.id));
            },
            { root: null, rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
        );
        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) obs.observe(el);
        });
        return () => obs.disconnect();
    }, [ids]);
    return active;
}

export default function ProductSections({ product }) {
    const ids = useMemo(() => ['desc', 'specs', 'rq'], []);
    const active = useScrollSpy(ids);

    const scrollTo = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 90; // під висоту хедера
        window.scrollTo({ top, behavior: 'smooth' });
    };

    return (
        <section className={s.wrap}>
            {/* Вкладки (стиккі) */}
            <div className={s.tabsBar} role="tablist" aria-label="Вкладки товару">
                <button
                    className={`${s.tabBtn} ${active === 'desc' ? s.active : ''}`}
                    onClick={() => scrollTo('desc')}
                    role="tab"
                    aria-selected={active === 'desc'}
                >
                    Опис
                </button>
                <button
                    className={`${s.tabBtn} ${active === 'specs' ? s.active : ''}`}
                    onClick={() => scrollTo('specs')}
                    role="tab"
                    aria-selected={active === 'specs'}
                >
                    Характеристики
                </button>
                <button
                    className={`${s.tabBtn} ${active === 'rq' ? s.active : ''}`}
                    onClick={() => scrollTo('rq')}
                    role="tab"
                    aria-selected={active === 'rq'}
                >
                    Відгуки та запитання
                </button>
            </div>

            {/* ОПИС */}
            <div className={s.card} id="desc" role="tabpanel" aria-labelledby="desc-tab">
                <div className={s.panel}>
                    <Suspense fallback={<div className="skeleton" style={{height:120}} />}>
                        <TabDesc product={product} />
                    </Suspense>
                </div>
            </div>

            {/* ХАРАКТЕРИСТИКИ (ліниво) */}
            <div className={s.card} id="specs" role="tabpanel" aria-labelledby="specs-tab">
                <div className={s.panel}>
                    <LazyOnView>
                        <Suspense fallback={<div className="skeleton" style={{height:120}} />}>
                            <TabSpecs product={product} />
                        </Suspense>
                    </LazyOnView>
                </div>
            </div>

            {/* ВІДГУКИ / ПИТАННЯ (ліниво) */}
            <div className={s.card} id="rq" role="tabpanel" aria-labelledby="rq-tab">
                <div className={s.panel}>
                    <LazyOnView>
                        <Suspense fallback={<div className="skeleton" style={{height:180}} />}>
                            <ReviewsQA sku={product?.sku} />
                        </Suspense>
                    </LazyOnView>
                </div>
            </div>
        </section>
    );
}
