import { useEffect, useState } from 'react';

export function useSearchSuggestions({ q, suggestFn, open, setActiveIdx }) {
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        setActiveIdx(-1);
        if (!open || !q || !q.trim()) { setSuggestions([]); return; }
        let live = true;
        (async () => {
            const items = suggestFn ? await suggestFn(q) : [];
            if (live) setSuggestions(Array.isArray(items) ? items.slice(0, 8) : []);
        })();
        return () => { live = false; };
    }, [q, suggestFn, open, setActiveIdx]);

    return { suggestions };
}