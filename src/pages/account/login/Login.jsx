import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../../../store/authSlice';
import s from './Login.module.scss';

export default function Login() {
  const d = useDispatch();
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');
  const onChange = (k,v)=> setForm(f=>({...f,[k]:v}));

  const submit = (e) => {
    e.preventDefault(); setErr('');
    if (!form.email || !form.password) return setErr('Заповніть email і пароль');
    // демо-логін
    const demo = { id:1, email: form.email, name:'Demo User', phone:'+380000000000' };
    d(setAuth({ user: demo, token: 'demo-token' }));
  };

  return (
    <section className="container">
      <h1>Вхід</h1>
      <form className={'card ' + s.form} onSubmit={submit}>
        <input className={s.input} type="email" placeholder="Email" value={form.email} onChange={e=>onChange('email', e.target.value)} />
        <input className={s.input} type="password" placeholder="Пароль" value={form.password} onChange={e=>onChange('password', e.target.value)} />
        {err && <div style={{color:'#ef4444'}}>{err}</div>}
        <button className="btn primary">Увійти</button>
      </form>
    </section>
  );
}
