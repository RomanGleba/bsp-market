import s from '../stylesNavbar/Brand.module.scss';
import logoUrl from '../../../assets/react.svg';

export default function Brand({ onClick }) {
    return (
        <button className={s.brand} onClick={onClick}>
            <img src={logoUrl} alt="" className={s.logo} />
            <span>Dasty Pet Food</span>
        </button>
    );
}
