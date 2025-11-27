import { useEffect, useState } from 'react';
export function useDebounced(v, ms = 250) {
    const [val, setVal] = useState(v);
    useEffect(() => { const t = setTimeout(() => setVal(v), ms); return () => clearTimeout(t); }, [v, ms]);
    return val;
}