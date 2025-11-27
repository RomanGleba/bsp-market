// src/utils/CdnImage.jsx
import React, { useMemo, useState, useEffect } from 'react';
import { toImgSrcKey, CDN_BASE } from './cdn.js';

const PLACEHOLDER =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="320" height="240"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="14" fill="#9ca3af">no image</text></svg>');

export default function CdnImage({ srcKey, alt = '', className, ...rest }) {
    const [broken, setBroken] = useState(false);
    const src = useMemo(() => toImgSrcKey(srcKey), [srcKey]);

    useEffect(() => {
        if (import.meta.env.DEV && src) {
            // eslint-disable-next-line no-console
            console.log('[CdnImage][SRC]', src);
        }
    }, [src]);

    if (!src) return null;

    return (
        <img
            src={broken ? PLACEHOLDER : src}
            alt={alt}
            className={className}
            loading={rest.loading ?? 'lazy'}
            decoding="async"
            onError={() => {
                setBroken(true);
                if (import.meta.env.DEV) {
                    // eslint-disable-next-line no-console
                    console.error('[CdnImage] onError', { srcKey, src, CDN_BASE });
                }
            }}
            {...rest}
        />
    );
}
