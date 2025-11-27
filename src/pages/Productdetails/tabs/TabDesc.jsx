import styles from '../productSelections/ProductTabs.module.scss';

export default function TabDesc({ product }) {
    const { description, descriptionHtml } = product || {};

    return (
        <div className={styles.section}>
            <h2 className={styles.h2}>Опис</h2>
            {descriptionHtml ? (
                <div
                    className={styles.descHtml}
                    dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                />
            ) : description ? (
                <p>{description}</p>
            ) : (
                <p>Опис з’явиться згодом.</p>
            )}
        </div>
    );
}
