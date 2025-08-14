import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, selectProducts } from '../../store/productsSlice';
import ProductCard from '../../components/productcard/ProductCard';
import s from './Home.module.scss';

const Home = () => {
  const d = useDispatch();
  const items = useSelector(selectProducts);
  useEffect(()=>{ d(fetchProducts()); }, [d]);

  return (
    <section className="container">
      <div className={'card ' + s.hero}>
        <h1>Petz Market 🐾</h1>
        <p>Професійний зоомагазин. Швидка доставка. Актуальні ціни.</p>
      </div>
      <h2>Хіти</h2>
      <div className={s.grid}>
        {items.slice(0,8).map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

export default Home;