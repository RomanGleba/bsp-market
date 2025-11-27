import React from 'react';
import { Link } from 'react-router-dom';
import s from './Footer.module.scss';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className={s.footer}>
            <div className={'container ' + s.inner}>
                {/* Логотип + слоган */}
                <div className={s.colBrand}>
                    <div className={s.logo}>
                        <span className={s.logoMark}>●</span>
                        <span>Dasty Pet Food</span>
                    </div>
                    <p className={s.description}>
                        Онлайн-маркет корисних товарів для бізнесу та дому. Швидка доставка по Україні.
                    </p>
                    <div className={s.hotline}>
                        <div className={s.hotlineLabel}>Гаряча лінія</div>
                        <a href="tel:+380000000000" className={s.hotlinePhone}>
                            +38 (000) 000-00-00
                        </a>
                        <div className={s.hotlineTime}>щодня з 9:00 до 20:00</div>
                    </div>
                </div>

                {/* Каталог */}
                <div className={s.column}>
                    <h4 className={s.title}>Каталог</h4>
                    <ul className={s.list}>
                        <li><Link to="/products?category=electronics">Електроніка</Link></li>
                        <li><Link to="/products?category=home">Для дому</Link></li>
                        <li><Link to="/products?category=office">Офіс</Link></li>
                        <li><Link to="/products">Усі товари</Link></li>
                    </ul>
                </div>

                {/* Інформація */}
                <div className={s.column}>
                    <h4 className={s.title}>Інформація</h4>
                    <ul className={s.list}>
                        <li><Link to="/about">Про компанію</Link></li>
                        <li><Link to="/delivery">Доставка та оплата</Link></li>
                        <li><Link to="/returns">Повернення товару</Link></li>
                        <li><Link to="/contacts">Контакти</Link></li>
                    </ul>
                </div>

                {/* Контакти + соцмережі */}
                <div className={s.column}>
                    <h4 className={s.title}>Контакти</h4>
                    <ul className={s.list}>
                        <li>
                            <a href="mailto:support@bsp-market.com">
                                support@bsp-market.com
                            </a>
                        </li>
                        <li>м. Київ, вул. Прикладна, 10</li>
                    </ul>

                    <h4 className={s.title} style={{ marginTop: 16 }}>Ми в соцмережах</h4>
                    <div className={s.socials}>
                        <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                            <span>Fb</span>
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                            <span>Ig</span>
                        </a>
                        <a href="https://t.me/yourshop" target="_blank" rel="noreferrer" aria-label="Telegram">
                            <span>Te</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className={s.bottom}>
                <div className="container">
                    <div className={s.bottomRow}>
                        <div className={s.bottomLeft}>
                            © {year} BSP Market. Усі права захищено.
                        </div>
                        <div className={s.bottomLinks}>
                            <Link to="/privacy">Політика конфіденційності</Link>
                            <Link to="/terms">Умови використання</Link>
                        </div>
                        <div className={s.made}>
                            Made with <span>❤️</span> by BSP Team
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
