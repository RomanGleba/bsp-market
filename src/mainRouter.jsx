import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import Layout from './layout/Layout';

const Fallback = <div className="skeleton"></div>;

const Home           = lazy(() => import('./pages/home/Home.jsx'));
const Products       = lazy(() => import('./pages/product/ProductsPage.jsx'));
const ProductDetails = lazy(() => import('./pages/productdetails/ProductDetails.jsx'));
const Basket         = lazy(() => import('./pages/basket/BasketPage.jsx'));
const Checkout       = lazy(() => import('./pages/checkout/Checkout.jsx'));
const Login          = lazy(() => import('./pages/account/login/Login.jsx'));
const Register       = lazy(() => import('./pages/account/register/Register.jsx'));

export const mainRouter = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Navigate to="/home" replace /> },

            { path: 'home', element: <Suspense fallback={Fallback}><Home /></Suspense> },

            // 🔥 універсальна сторінка каталогу
            { path: 'products', element: <Suspense fallback={Fallback}><Products /></Suspense> },

            // 🔥 детальна сторінка товару
            { path: 'product/:sku', element: <Suspense fallback={Fallback}><ProductDetails /></Suspense> },

            { path: 'cart', element: <Suspense fallback={Fallback}><Basket /></Suspense> },
            { path: 'checkout', element: <Suspense fallback={Fallback}><Checkout /></Suspense> },
            { path: 'login', element: <Suspense fallback={Fallback}><Login /></Suspense> },
            { path: 'register', element: <Suspense fallback={Fallback}><Register /></Suspense> },

            { path: '*', element: <div className="card">Сторінку не знайдено</div> },
        ]
    }
]);
