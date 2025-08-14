import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import Home from './pages/home/Home';
import Products from './pages/product/Product';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import Login from './pages/account/login/Login';
import Register from './pages/account/register/Register';
import s from './App.module.css';

const  App = () => {
  return (
    <div className={s.shell}>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}


export default App;