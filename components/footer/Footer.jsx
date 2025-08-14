import React from 'react';
import s from './Footer.module.scss';

const Footer = () => {
  return (
    <footer className={s.footer}>
      <div className={'container ' + s.inner}>
        <div>© {new Date().getFullYear()} BSP Market</div>
        <div style={{opacity:.7}}>Made with ❤️</div>
      </div>
    </footer>
  );
}


export default Footer