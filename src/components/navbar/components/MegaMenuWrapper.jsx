import CategoryMenu from '../../catalog/categoryMenu/CategoryMenu';
import { MENU_SECTIONS } from '../config/MENU_SECTIONS.js';
import { to } from '../config/linkBuilder.js';
import s from '..//stylesNavbar/MegaMenuWrapper.module.scss';

export default function MegaMenuWrapper({ open, close, anchorRef }) {
    const allLink = to({});

    return (
        <div className={s.wrap}>
            {open && (
                <CategoryMenu
                    open={open}
                    onClose={close}
                    sections={MENU_SECTIONS}
                    allLink={allLink}
                    anchorRef={anchorRef}
                />
            )}
        </div>
    );
}
