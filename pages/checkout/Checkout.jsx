import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCart, selectTotals } from '../../store/cartSlice';
import { selectUser } from '../../store/authSlice';
import s from './Checkout.module.scss';

export default function Checkout() {
  const user = useSelector(selectUser);
  const items = useSelector(selectCart);
  const totals = useSelector(selectTotals);
  const [form, setForm] = useState({ name:user?.name||'', email:user?.email||'', phone:user?.phone||'', address:'' });
  const [err, setErr] = useState('');
  const onChange = (k,v)=> setForm(f=>({...f,[k]:v}));

  const submit = (e) => {
    e.preventDefault(); setErr('');
    if (!user) return setErr('Спочатку увійдіть у акаунт');
    if (!form.name.trim()) return setErr('Імʼя обовʼязкове');
    if (!form.email.trim()) return setErr('Email обовʼязковий');
    if (!form.phone.trim()) return setErr('Телефон обовʼязковий');
    if (!items.length) return setErr('Кошик порожній');
    alert('Замовлення оформлено (демо). Підключи бекенд, щоб зберігати замовлення.');
  };

  return (
    <section className="container">
      <h1>Оформлення</h1>
      <form className={'card ' + s.form} onSubmit={submit}>
        <div className={s.row}>
          <input placeholder="Імʼя *" value={form.name} onChange={e=>onChange('name', e.target.value)} />
          <input placeholder="Телефон *" value={form.phone} onChange={e=>onChange('phone', e.target.value)} />
          <input type="email" placeholder="Email *" value={form.email} onChange={e=>onChange('email', e.target.value)} />
        </div>
        <input placeholder="Адреса (не обовʼязково)" value={form.address} onChange={e=>onChange('address', e.target.value)} />
        {err && <div style={{color:'#ef4444'}}>{err}</div>}
        <div className="row" style={{justifyContent:'space-between'}}>
          <div>До сплати: <b className="price">{totals.sum} грн</b></div>
          <button className="btn primary" type="submit">Підтвердити</button>
        </div>
      </form>
    </section>
  );
}
