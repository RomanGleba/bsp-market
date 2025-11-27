// src/pages/Checkout/Checkout.jsx
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, selectTotals, clearCartRemote } from '../../store/cartSlice';
import { selectUser } from '../../store/authSlice.js';
import { useNavigate, Link } from 'react-router-dom';
import { searchNpcities, getNpWarehouses } from '../../api/NovaPoshtaApi.js';
import s from './Checkout.module.scss';

const fmt = new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
});

const isEmail = (v) => /\S+@\S+\.\S+/.test(v);
const isPhone = (v) => /^[+0-9() \-]{7,}$/.test(v);

export default function Checkout() {
    const d   = useDispatch();
    const nav = useNavigate();

    const user   = useSelector(selectUser);
    const items  = useSelector(selectCartItems);
    const totals = useSelector(selectTotals);

    const [form, setForm] = useState({
        name:    user?.name  || '',
        email:   user?.email || '',
        phone:   user?.phone || '',
        address: '',
    });

    const [err, setErr] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // 🔹 Доставка
    const [deliveryType, setDeliveryType] = useState('nova_poshta_warehouse');

    // 🔹 Оплата
    const [paymentMethod, setPaymentMethod] = useState('card_online'); // 'card_online' | 'cod'

    // 🔹 Нова пошта
    const [npCityQuery, setNpCityQuery] = useState('');
    const [npCities, setNpCities] = useState([]);
    const [npCityRef, setNpCityRef] = useState('');
    const [npCityName, setNpCityName] = useState('');
    const [npWarehouses, setNpWarehouses] = useState([]);
    const [npWarehouseRef, setNpWarehouseRef] = useState('');
    const [npLoading, setNpLoading] = useState(false);

    const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    // Прокрутка до блоку за id (для кнопок кроків зверху)
    const scrollToStep = (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        const top = el.getBoundingClientRect().top + window.scrollY - 90; // під хедер
        window.scrollTo({ top, behavior: 'smooth' });
    };

    // 🔎 Пошук міст Нової пошти
    const handleSearchCity = async () => {
        const q = npCityQuery.trim();
        if (!q) return;

        try {
            setNpLoading(true);
            setErr('');
            const list = await searchNpcities(q);
            setNpCities(list);
        } catch (e) {
            console.error(e);
            setErr('Помилка пошуку міста Нової пошти');
        } finally {
            setNpLoading(false);
        }
    };

    // 🏙 Вибір міста → підтягуємо відділення за cityName
    const handleSelectCity = async (e) => {
        const ref = e.target.value;
        setNpCityRef(ref);
        setNpWarehouseRef('');
        setNpWarehouses([]);

        if (!ref) {
            setNpCityName('');
            return;
        }

        const selected = npCities.find((c) => c.ref === ref) || null;
        const cityName = selected?.cityName || '';
        setNpCityName(cityName);

        if (!cityName) return;

        try {
            setNpLoading(true);
            setErr('');
            const list = await getNpWarehouses(cityName);
            setNpWarehouses(list);
        } catch (e2) {
            console.error(e2);
            setErr('Помилка завантаження відділень Нової пошти');
        } finally {
            setNpLoading(false);
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        setErr('');

        if (!user)                 return setErr('Спочатку увійдіть у акаунт');
        if (!form.name.trim())     return setErr('Імʼя обовʼязкове');
        if (!isPhone(form.phone))  return setErr('Вкажіть коректний телефон');
        if (!isEmail(form.email))  return setErr('Вкажіть коректний email');
        if (!items.length)         return setErr('Кошик порожній');
        if (!paymentMethod)        return setErr('Оберіть спосіб оплати');

        if (deliveryType === 'nova_poshta_warehouse') {
            if (!npCityRef || !npCityName)   return setErr('Оберіть місто доставки Новою поштою');
            if (!npWarehouseRef)             return setErr('Оберіть відділення Нової пошти');
        }

        const selectedCity =
            npCities.find((c) => c.ref === npCityRef) || null;
        const selectedWarehouse =
            npWarehouses.find((w) => w.ref === npWarehouseRef) || null;

        const delivery = {
            type: deliveryType,
            npCityRef,
            npCityName,
            npCity: selectedCity?.present || '',
            npWarehouseRef,
            npWarehouse: selectedWarehouse
                ? `Відділення №${selectedWarehouse.number}: ${selectedWarehouse.description}`
                : '',
        };

        console.log('[NP] delivery payload:', delivery);
        console.log('[PAYMENT] method:', paymentMethod);

        setSubmitting(true);
        try {
            const base =
                import.meta.env.VITE_API_BASE_URL ??
                'http://localhost:5000';

            await fetch(`${base}/api/orders`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customer: form,
                    items: items.map(({ productId, sku, title, price, qty, image }) => ({
                        productId,
                        sku,
                        title,
                        price,
                        qty,
                        image,
                    })),
                    total: Math.round(totals.sum || 0),
                    delivery,
                    paymentMethod,
                }),
            }).catch(() => {
                // no-op, щоб не ламати UI, якщо бек ще не готовий
            });

            await d(clearCartRemote());
            nav('/thank-you', { replace: true });
        } catch (e2) {
            console.error(e2);
            setErr(e2?.message || 'Помилка під час оформлення');
        } finally {
            setSubmitting(false);
        }
    };

    if (!items.length) {
        return (
            <section className={s.page}>
                <div className="container card">
                    <h1>Оформлення</h1>
                    <div>
                        Кошик порожній. <Link to="/products">До каталогу</Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className={s.page}>
            <div className="container">
                <h1 className={s.title}>Оформлення замовлення</h1>

                {/* 🔹 Верхній прогрес-бар кроків, як у Comfy */}
                <div className={s.stepsBar}>
                    <button
                        type="button"
                        className={`${s.stepItem} ${s.stepItemActive}`}
                        onClick={() => scrollToStep('step-contacts')}
                    >
                        <span className={s.stepCircle}>1</span>
                        <span className={s.stepText}>Контактні дані</span>
                    </button>

                    <div className={s.stepDivider} />

                    <button
                        type="button"
                        className={s.stepItem}
                        onClick={() => scrollToStep('step-delivery')}
                    >
                        <span className={s.stepCircle}>2</span>
                        <span className={s.stepText}>Доставка</span>
                    </button>

                    <div className={s.stepDivider} />

                    <button
                        type="button"
                        className={s.stepItem}
                        onClick={() => scrollToStep('step-payment')}
                    >
                        <span className={s.stepCircle}>3</span>
                        <span className={s.stepText}>Оплата</span>
                    </button>
                </div>

                <form className={s.form} onSubmit={submit} noValidate>
                    <div className={s.layout}>
                        {/* Ліва колонка – кроки */}
                        <div className={s.colMain}>
                            {/* 1. Контактні дані */}
                            <div className={s.block} id="step-contacts">
                                <div className={s.blockHeader}>
                                    <span className={s.stepBadge}>1</span>
                                    <div>
                                        <div className={s.blockTitle}>Контактні дані</div>
                                        <div className={s.blockHint}>Використаємо для звʼязку та повідомлень про замовлення</div>
                                    </div>
                                </div>
                                <div className={s.blockBody}>
                                    <div className={s.row}>
                                        <input
                                            name="name"
                                            placeholder="Імʼя *"
                                            value={form.name}
                                            onChange={(e) => onChange('name', e.target.value)}
                                            autoComplete="name"
                                        />
                                        <input
                                            name="phone"
                                            placeholder="Телефон *"
                                            value={form.phone}
                                            onChange={(e) => onChange('phone', e.target.value)}
                                            autoComplete="tel"
                                            inputMode="tel"
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="Email *"
                                            value={form.email}
                                            onChange={(e) => onChange('email', e.target.value)}
                                            autoComplete="email"
                                        />
                                    </div>

                                    <input
                                        name="address"
                                        placeholder="Адреса (не обовʼязково)"
                                        value={form.address}
                                        onChange={(e) => onChange('address', e.target.value)}
                                        autoComplete="street-address"
                                        className={s.mtSmall}
                                    />
                                </div>
                            </div>

                            {/* 2. Доставка */}
                            <div className={s.block} id="step-delivery">
                                <div className={s.blockHeader}>
                                    <span className={s.stepBadge}>2</span>
                                    <div>
                                        <div className={s.blockTitle}>Доставка</div>
                                        <div className={s.blockHint}>Оберіть спосіб доставки товару</div>
                                    </div>
                                </div>

                                <div className={s.blockBody}>
                                    <div className={s.deliveryRow}>
                                        <label className={s.deliveryRadio}>
                                            <input
                                                type="radio"
                                                name="deliveryType"
                                                value="nova_poshta_warehouse"
                                                checked={deliveryType === 'nova_poshta_warehouse'}
                                                onChange={(e) => setDeliveryType(e.target.value)}
                                            />
                                            <span>Нова пошта у відділення</span>
                                        </label>
                                    </div>

                                    {deliveryType === 'nova_poshta_warehouse' && (
                                        <div className={s.npBlock}>
                                            {/* МІСТО */}
                                            <div className={s.npField}>
                                                <label className={s.npLabel}>Місто</label>
                                                <div className={s.row} style={{ gap: 8 }}>
                                                    <input
                                                        placeholder="Почніть вводити назву міста"
                                                        value={npCityQuery}
                                                        onChange={(e) => setNpCityQuery(e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn"
                                                        onClick={handleSearchCity}
                                                        disabled={npLoading || !npCityQuery.trim()}
                                                    >
                                                        {npLoading ? 'Пошук…' : 'Знайти'}
                                                    </button>
                                                </div>

                                                {npCities.length > 0 && (
                                                    <select
                                                        className={s.npSelect}
                                                        value={npCityRef}
                                                        onChange={handleSelectCity}
                                                    >
                                                        <option value="">Оберіть місто</option>
                                                        {npCities.map((c) => (
                                                            <option key={c.ref} value={c.ref}>
                                                                {c.present}
                                                            </option>
                                                        ))}
                                                    </select>
                                                )}
                                            </div>

                                            {/* ВІДДІЛЕННЯ */}
                                            <div className={s.npField}>
                                                <label className={s.npLabel}>Відділення в обраному місті</label>
                                                <select
                                                    className={s.npSelect}
                                                    value={npWarehouseRef}
                                                    onChange={(e) => setNpWarehouseRef(e.target.value)}
                                                    disabled={!npCityRef || npWarehouses.length === 0}
                                                >
                                                    {!npCityRef && (
                                                        <option value="">
                                                            Спочатку оберіть місто
                                                        </option>
                                                    )}
                                                    {npCityRef && npWarehouses.length === 0 && (
                                                        <option value="">
                                                            Відділення не знайдені
                                                        </option>
                                                    )}
                                                    {npCityRef && npWarehouses.length > 0 && (
                                                        <>
                                                            <option value="">Оберіть відділення</option>
                                                            {npWarehouses.map((w) => (
                                                                <option key={w.ref} value={w.ref}>
                                                                    {`Відділення №${w.number}: ${w.description}`}
                                                                </option>
                                                            ))}
                                                        </>
                                                    )}
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. Оплата */}
                            <div className={s.block} id="step-payment">
                                <div className={s.blockHeader}>
                                    <span className={s.stepBadge}>3</span>
                                    <div>
                                        <div className={s.blockTitle}>Оплата</div>
                                        <div className={s.blockHint}>Оберіть зручний спосіб оплати</div>
                                    </div>
                                </div>

                                <div className={s.blockBody}>
                                    <div className={s.payOptions}>
                                        <label
                                            className={
                                                s.payOption +
                                                ' ' +
                                                (paymentMethod === 'card_online' ? ' ' + s.payOptionActive : '')
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="card_online"
                                                checked={paymentMethod === 'card_online'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className={s.payBody}>
                                                <div className={s.payName}>Оплата карткою онлайн</div>
                                                <div className={s.payHint}>
                                                    💳 Visa / Mastercard, Apple Pay, Google Pay
                                                </div>
                                            </div>
                                        </label>

                                        <label
                                            className={
                                                s.payOption +
                                                ' ' +
                                                (paymentMethod === 'cod' ? ' ' + s.payOptionActive : '')
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={paymentMethod === 'cod'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                            />
                                            <div className={s.payBody}>
                                                <div className={s.payName}>Оплата при отриманні</div>
                                                <div className={s.payHint}>
                                                    🏤 У відділенні Нової пошти готівкою або карткою
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {err && <div className={s.error}>{err}</div>}
                        </div>

                        {/* Права колонка – підсумок замовлення */}
                        <aside className={s.colAside}>
                            <div className={s.summaryCard}>
                                <div className={s.summaryTitle}>Ваше замовлення</div>

                                <ul className={s.summaryList}>
                                    {items.map((it) => (
                                        <li
                                            key={it.id || it.cartItemId || it.productId}
                                            className={s.summaryItem}
                                        >
                                            <div className={s.summaryItemInfo}>
                                                <div className={s.summaryName}>{it.title}</div>
                                                <div className={s.summaryMeta}>
                                                    {it.sku && <>Код: {it.sku} · </>}
                                                    {it.qty} шт
                                                </div>
                                            </div>
                                            <div className={s.summaryPrice}>
                                                {fmt.format((it.price || 0) * (it.qty || 1))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className={s.summaryTotalRow}>
                                    <span>Сума до сплати</span>
                                    <span className={s.summaryTotal}>
                    {fmt.format(Math.round(totals.sum || 0))}
                  </span>
                                </div>

                                <button
                                    className={s.summaryBtn + ' btn primary'}
                                    type="submit"
                                    disabled={submitting}
                                >
                                    {submitting ? 'Оформлюємо…' : 'Підтвердити замовлення'}
                                </button>

                                <div className={s.summaryNote}>
                                    Натискаючи кнопку, ви погоджуєтесь з умовами покупки та політикою конфіденційності.
                                </div>
                            </div>
                        </aside>
                    </div>
                </form>
            </div>
        </section>
    );
}
