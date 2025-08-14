import React from 'react';
import s from './ThemeToggle.module.scss';
import { useTheme } from '../../theme/ThemeContext';

const ThemeToggle = ({ compact=false }) => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className={s.switch} onClick={toggleTheme} title="Перемкнути тему">
      {theme === 'dark' ? '🌙' : '🌞'}
    </button>
  );
}

export default ThemeToggle;