import React from 'react';
import { Outlet } from 'react-router-dom';
import s from './App.module.css';
import Navbar from "./components/navbar/Navbar";

export default function App() {
    return (
        <div className={s.shell}>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}
