import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import s from './Register.module.scss';

export default function Register() {
  const d = useDispatch();
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', address:'' });
  const [err, setErr] = useState('');
  const onChange = (k,v)=> setForm(f=>({...f,[k]:v}));

  const submit = (e) => {
    e.preventDefault(); setErr('');
    if (!form.name) return setErr('Імʼя обовʼязкове');
    if (!form.email) return setErr('Email обовʼязковий');
    if (!form.phone) return setErr('Телефон обовʼязковий');
    if (!form.password || form.password.length < 6) return setErr('Пароль мін. 6 символів');
    // демо-реєстрація
    const user = { id: Date.now(), email: form.email, name: form.name, phone: form.phone, address: form.address };
    d(setAuth({ user, token: 'demo-token' }));
  };

  return (
    <section className="container">
      <h1>Реєстрація</h1>
      <form className={'card ' + s.form} onSubmit={submit}>
        <input className={s.input} placeholder="Імʼя *" value={form.name} onChange={e=>onChange('name', e.target.value)} />
        <input className={s.input} placeholder="Телефон *" value={form.phone} onChange={e=>onChange('phone', e.target.value)} />
        <input className={s.input} type="email" placeholder="Email *" value={form.email} onChange={e=>onChange('email', e.target.value)} />
        <input className={s.input} type="password" placeholder="Пароль *" value={form.password} onChange={e=>onChange('password', e.target.value)} />
        <input className={s.input} placeholder="Адреса (не обовʼязково)" value={form.address} onChange={e=>onChange('address', e.target.value)} />
        {err && <div style={{color:'#ef4444'}}>{err}</div>}
        <button className="btn primary">Створити акаунт</button>
      </form>
    </section>
  );
}
