import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import s from './App.module.css';



const Home     = lazy(() => import('./pages/home/Home'));
const Products = lazy(() => import('./pages/product/Product'));
const Basket     = lazy(() => import('./pages/basket/Basket.jsx'));
const Checkout = lazy(() => import('./pages/checkout/Checkout'));
const Login    = lazy(() => import('./pages/account/login/Login'));
const Register = lazy(() => import('./pages/account/register/Register'));
const ProductDetails = lazy(() => import('./pages/Productdetails/ProductDetails.jsx'));
const App = () => {
    return (
        <div className={s.shell}>
            <Header />
            <main>
                <Suspense fallback={<div className="skeleton"></div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/product/:sku" element={<ProductDetails />} />
                        <Route path="/cart" element={<Basket />} />
                        <Route path="/checkout" element={<Checkout />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
};

export default App;
