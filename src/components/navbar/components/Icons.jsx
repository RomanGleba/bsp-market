import s from '../stylesNavbar/Icons.module.scss';

export const IconBurger = () => (
    <svg className={s.icon} viewBox="0 0 24 24">
        <path d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none" />
    </svg>
);

export const IconLogin = () => (
    <svg className={s.icon} viewBox="0 0 24 24">
        <path d="M10 12h10M15 7l5 5-5 5M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round" />
    </svg>
);

export const IconUser = () => (
    <svg className={s.icon} viewBox="0 0 24 24">
        <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round" />
    </svg>
);

export const IconCart = () => (
    <svg className={s.icon} viewBox="0 0 24 24">
        <path d="M6 6h15l-1.5 8.5a2 2 0 0 1-2 1.5H8a2 2 0 0 1-2-1.6L4.3 4H2"
              fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="21" r="1.7" fill="currentColor"/>
        <circle cx="18" cy="21" r="1.7" fill="currentColor"/>
    </svg>
);

export const IconHome = () => (
    <svg className={s.icon} viewBox="0 0 24 24">
        <path d="M3 10.5 12 4l9 6.5V21a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round" />
    </svg>
);
