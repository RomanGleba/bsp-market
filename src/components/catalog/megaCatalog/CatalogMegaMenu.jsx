import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import s from './CatalogMegaMenu.module.scss';





const MEGA = [
  { title: 'Котам', items: [
    { label: 'Корм сухий',   to: '/products?cat=Корм&pet=cat&type=dry' },
    { label: 'Корм вологий', to: '/products?cat=Корм&pet=cat&type=wet' },
    { label: 'Лакомства',    to: '/products?cat=Лакомства&pet=cat' },
    { label: 'Наповнювачі',  to: '/products?cat=Наповнювачі' },
    { label: 'Туалети',      to: '/products?cat=Туалети' },
  ]},
  { title: 'Собакам', items: [
    { label: 'Корм сухий',   to: '/products?cat=Корм&pet=dog&type=dry' },
    { label: 'Корм вологий', to: '/products?cat=Корм&pet=dog&type=wet' },
    { label: 'Амуниція',     to: '/products?cat=Амуниція' },
    { label: 'Лакомства',    to: '/products?cat=Лакомства&pet=dog' },
    { label: 'Грумінг',      to: '/products?cat=Гігієна' },
  ]},
  { title: 'Аксесуари', items: [
    { label: 'Миски та поїлки', to: '/products?cat=Посуд' },
    { label: 'Іграшки',         to: '/products?cat=Іграшки' },
    { label: 'Будинки/лежаки',  to: '/products?cat=Будинки' },
    { label: 'Переноски',       to: '/products?cat=Переноски' },
  ]},
  { title: 'За брендом', items: [
    { label: 'Royal Canin', to: '/products?brands=Royal%20Canin' },
    { label: 'Purina',      to: '/products?brands=Purina' },
    { label: 'Trixie',      to: '/products?brands=Trixie' },
    { label: 'Savic',       to: '/products?brands=Savic' },
  ]},
];

export default function CatalogMegaMenu({ label = 'Всі категорії', data = MEGA }) {
  const [open, setOpen] = useState(false);
  const box = useRef(null);

  useEffect(() => {
    const onDoc = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('pointerdown', onDoc);
    return () => document.removeEventListener('pointerdown', onDoc);
  }, []);

  const onMouseEnter = () => setOpen(true);
  const onMouseLeave = () => setOpen(false);
  const onKeyDown = (e) => {
    if (e.key === 'Escape') setOpen(false);
    if ((e.key === 'Enter' || e.key === ' ') && !open) { e.preventDefault(); setOpen(true); }
  };

  return (
    <div ref={box} className={s.wrap} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <button className={s.trigger} aria-expanded={open} aria-haspopup="menu" onClick={() => setOpen(v => !v)} onKeyDown={onKeyDown}>
        ☰ {label}
      </button>

      {open && (
        <div className={s.panel} role="menu">
          {data.map((col, i) => (
            <div key={i} className={s.col}>
              <div className={s.colTitle}>{col.title}</div>
              <ul className={s.list}>
                {col.items.map((it, j) => (
                  <li key={j}>
                    <Link className={s.link} to={it.to} role="menuitem" onClick={() => setOpen(false)}>
                      {it.icon ? <span className={s.icon}>{it.icon}</span> : null}
                      <span>{it.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}