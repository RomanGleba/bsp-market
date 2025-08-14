import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeItem, selectCart, selectTotals, setQty } from '../../store/cartSlice';
import { Link } from 'react-router-dom';
import s from './Cart.module.scss';

export default function Cart() {
  const items = useSelector(selectCart);
  const totals = useSelector(selectTotals);
  const d = useDispatch();

  return (
    <section className="container card">
      <h1>Кошик</h1>
      {items.length === 0 ? (
        <div>Кошик порожній. <Link to="/products">До каталогу</Link></div>
      ) : (
        <>
          <table className={s.table}>
            <thead><tr><th>Товар</th><th>Ціна</th><th>К-сть</th><th>Сума</th><th/></tr></thead>
            <tbody>
              {items.map(i => (
                <tr key={i.id}>
                  <td>{i.title}</td>
                  <td>{i.price} грн</td>
                  <td><input type="number" min="1" value={i.qty} onChange={e=>d(setQty({id:i.id, qty:Number(e.target.value)||1}))} style={{width:70}}/></td>
                  <td>{i.price * i.qty} грн</td>
                  <td><button className="btn" onClick={()=>d(removeItem(i.id))}>×</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={s.row}>
            <div>Всього: <b className="price">{totals.sum} грн</b></div>
            <Link to="/checkout" className="btn primary">Оформити</Link>
          </div>
        </>
      )}
    </section>
  );
}
