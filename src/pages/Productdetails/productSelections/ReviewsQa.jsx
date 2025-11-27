import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser, selectIsAuth } from '../../../store/authSlice.js';
import s from './ProductTabs.module.scss';

const lsGet = (k, def = []) => {
    try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(def)); }
    catch { return def; }
};
const lsSet = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const Star = ({ filled, onClick, size = 18, label }) => (
    <button
        type="button"
        className={`${s.starBtn} ${filled ? s.starBtnActive : ''}`}
        title={label}
        aria-pressed={filled}
        onClick={onClick}
        style={{ fontSize: size }}
    >
        {filled ? '★' : '☆'}
    </button>
);

export default function ReviewsQA({ sku }) {
    const revKey = `reviews_${sku}`;
    const qaKey  = `qa_${sku}`;

    const user   = useSelector(selectUser);
    const isAuth = useSelector(selectIsAuth);
    const navigate = useNavigate();

    const [mode, setMode] = useState('reviews'); // 'reviews' | 'qa'
    const [items, setItems] = useState(() => lsGet(revKey, []));
    const [qas, setQas]     = useState(() => lsGet(qaKey, []));

    // форми
    const [text, setText]     = useState('');
    const [rating, setRating] = useState(5);
    const [qText, setQText]   = useState('');
    const topRef = useRef(null);

    // sync з localStorage між вкладками
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === revKey) setItems(lsGet(revKey, []));
            if (e.key === qaKey)  setQas(lsGet(qaKey, []));
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [revKey, qaKey]);

    // агрегати
    const avg = useMemo(() => {
        if (!items.length) return 0;
        const sum = items.reduce((a, c) => a + (+c.rating || 0), 0);
        return +(sum / items.length).toFixed(1);
    }, [items]);

    const dist = useMemo(() => {
        const d = { 5:0, 4:0, 3:0, 2:0, 1:0 };
        items.forEach((r) => d[r.rating] = (d[r.rating] || 0) + 1);
        return d;
    }, [items]);

    // дії — викликаються тільки якщо форма відрендерена (тобто isAuth === true)
    const addReview = (e) => {
        e.preventDefault();
        const t = text.replace(/\s+/g, ' ').trim();
        if (t.length < 10) return;
        const next = [{
            id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,
            sku,
            text: t,
            rating: Math.min(5, Math.max(1, rating)),
            createdAt: Date.now(),
            userName: user?.name || 'Користувач',
        }, ...items];
        lsSet(revKey, next);
        setItems(next);
        setText('');
        setRating(5);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const addQuestion = (e) => {
        e.preventDefault();
        const t = qText.replace(/\s+/g, ' ').trim();
        if (t.length < 5) return;
        const next = [{
            id: `${Date.now().toString(36)}_${Math.random().toString(36).slice(2,8)}`,
            sku,
            text: t,
            createdAt: Date.now(),
            userName: user?.name || 'Користувач',
        }, ...qas];
        lsSet(qaKey, next);
        setQas(next);
        setQText('');
        setMode('qa');
    };

    return (
        <div ref={topRef} className={s.rqWrap}>
            {/* перемикач */}
            <div className={s.switch}>
                <button
                    className={`${s.btn} ${mode === 'reviews' ? s.active : ''}`}
                    onClick={() => setMode('reviews')}
                >
                    Відгуки ({items.length})
                </button>
                <button
                    className={`${s.btn} ${mode === 'qa' ? s.active : ''}`}
                    onClick={() => setMode('qa')}
                >
                    Питання ({qas.length})
                </button>
            </div>

            {/* Зведення + гістограма */}
            <div className={s.grid}>
                <div className={s.summary}>
                    <div className={s.avgNum}>{avg || '—'}</div>
                    <div className={s.muted}>Середня оцінка</div>
                    <div className={s.starsRead} aria-hidden="true">
                        {'★'.repeat(Math.round(avg || 0)).padEnd(5, '☆')}
                    </div>
                    <div className={s.muted}>на основі {items.length} відгуків</div>
                </div>

                <div className={s.bars}>
                    {[5,4,3,2,1].map((n) => {
                        const count = dist[n] || 0;
                        const total = items.length || 1;
                        const pct   = Math.round((count / total) * 100);
                        return (
                            <div key={n} className={s.barRow}>
                                <div className={s.starLabel}>{n} ★</div>
                                <div className={s.barTrack} aria-hidden="true">
                                    <div className={s.barFill} style={{ width: `${pct}%` }} />
                                </div>
                                <div className={s.barCount}>{count}</div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Якщо НЕ залогінений – показуємо кнопку "Залишити відгук", яка веде на логін */}
            {!isAuth && (
                <div className={s.notice}>
                    <p className={s.muted}>
                        Щоб залишити відгук або поставити запитання, будь ласка увійдіть у свій акаунт.
                    </p>
                    <button
                        type="button"
                        className="btn primary"
                        onClick={() => navigate('/login')}
                    >
                        Залишити відгук
                    </button>
                </div>
            )}

            {/* Зміст вкладок */}
            {mode === 'reviews' ? (
                <div className={s.listWrap}>
                    {isAuth && (
                        <form onSubmit={addReview} className={s.form}>
                            <div className={s.stars} aria-label="Оцінка">
                                {[1,2,3,4,5].map((n) =>
                                    <Star
                                        key={n}
                                        filled={n <= rating}
                                        onClick={() => setRating(n)}
                                        label={`${n} з 5`}
                                    />
                                )}
                            </div>
                            <textarea
                                className={s.ta}
                                placeholder="Ваш відгук… (мінімум 10 символів)"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                rows={3}
                                maxLength={1000}
                                required
                            />
                            <button className="btn primary" type="submit">
                                Додати відгук
                            </button>
                        </form>
                    )}

                    {!items.length ? (
                        <div className={s.muted}>Ще немає відгуків. Будьте першим!</div>
                    ) : (
                        <ul className={s.list}>
                            {items.map((r) => (
                                <li key={r.id} className={`${s.revItem} card`}>
                                    <div className={s.revHead}>
                                        <div className={s.revStars}>
                                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                        </div>
                                        <time
                                            className={s.date}
                                            dateTime={new Date(r.createdAt).toISOString()}
                                        >
                                            {new Date(r.createdAt).toLocaleDateString()}
                                        </time>
                                    </div>
                                    {r.userName && (
                                        <div className={s.revAuthor}>{r.userName}</div>
                                    )}
                                    <p className={s.txt}>{r.text}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className={s.listWrap}>
                    {isAuth && (
                        <form onSubmit={addQuestion} className={s.form}>
                            <textarea
                                className={s.ta}
                                placeholder="Ваше запитання до товару… (мінімум 5 символів)"
                                value={qText}
                                onChange={(e) => setQText(e.target.value)}
                                rows={3}
                                maxLength={800}
                                required
                            />
                            <button className="btn" type="submit">
                                Поставити запитання
                            </button>
                        </form>
                    )}

                    {!qas.length ? (
                        <div className={s.muted}>Запитань ще немає.</div>
                    ) : (
                        <ul className={s.list}>
                            {qas.map((q) => (
                                <li key={q.id} className="card">
                                    <div className={s.row}>
                                        <b>Запитання</b>
                                        <time
                                            className={s.date}
                                            dateTime={new Date(q.createdAt).toISOString()}
                                        >
                                            {new Date(q.createdAt).toLocaleDateString()}
                                        </time>
                                    </div>
                                    {q.userName && (
                                        <div className={s.revAuthor}>{q.userName}</div>
                                    )}
                                    <p className={s.txt}>{q.text}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
