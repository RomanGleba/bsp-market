import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import s from "./Layout.module.scss";

export default function Layout() {
    const { pathname } = useLocation();

    const noFooterRoutes = ['/login', '/register', '/checkout'];
    const noHeaderRoutes = ['/login', '/register'];

    const showFooter = !noFooterRoutes.includes(pathname);
    const showNavbar = !noHeaderRoutes.includes(pathname);

    return (
        <div className={s.shell}>
            {showNavbar && <Navbar />}

            <main className={s.main}>
                <Outlet />
            </main>

            {showFooter && <Footer />}
        </div>
    );
}
