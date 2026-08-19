// app/components/search-bar.tsx
"use client";

import { useState, useRef } from "react";
import styles from "./search-bar.module.css";

type SearchResult = {
    id: string;
    place_name: string;
    lat: number;
    lng: number;
};

const SearchBar = ({ onSelect }: { onSelect: (pos: { lat: number; lng: number }) => void }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = async (text: string) => {
        if (!text.trim()) {
            setResults([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(text)}.json?key=mseS7PX8i6psLfEP6Bhy`
            );
            const data = await res.json();
            const mapped: SearchResult[] = (data.features ?? []).map((f: any) => ({
                id: f.id,
                place_name: f.place_name,
                lng: f.center[0],
                lat: f.center[1],
            }));
            setResults(mapped);
        } catch (err) {
            console.error("Geocoding error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(value), 350); // debounce so we're not hitting the API on every keystroke
    };

    const handleSelect = (result: SearchResult) => {
        onSelect({ lat: result.lat, lng: result.lng });
        setQuery(result.place_name);
        setResults([]);
    };

    return (
        <div className={styles.wrap}>
            <input
                className={styles.input}
                type="text"
                value={query}
                placeholder="Search for a location..."
                onChange={(e) => handleChange(e.target.value)}
            />
            {loading && <div className={styles.status}>Searching...</div>}
            {results.length > 0 && (
                <ul className={styles.results}>
                    {results.map((r) => (
                        <li key={r.id} onClick={() => handleSelect(r)} className={styles.resultItem}>
                            {r.place_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;