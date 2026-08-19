"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Loader2, MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import styles from "./map.module.css";

type ImportedImage = string | { src: string };
const imagePath = (image: ImportedImage) => typeof image === "string" ? image : image.src;
L.Icon.Default.mergeOptions({ iconRetinaUrl: imagePath(markerIcon2x), iconUrl: imagePath(markerIcon), shadowUrl: imagePath(markerShadow) });

type Position = { lat: number; lng: number };
type LocationSelection = Position & { address: string };
type SearchResult = LocationSelection & { id: string };
type GeocodingFeature = { id: string; center: [number, number]; place_name: string };

interface MapProps extends Position {
    onPositionChange?: (position: Position) => void;
    onLocationChange?: (location: LocationSelection) => void;
    searchable?: boolean;
    interactive?: boolean;
    heightClassName?: string;
}

const fallbackAddress = (position: Position) => `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_API_KEY || "mseS7PX8i6psLfEP6Bhy";

export default function Map({ lat, lng, onPositionChange, onLocationChange, searchable = false, interactive = true, heightClassName }: MapProps) {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<L.Map | null>(null);
    const marker = useRef<L.Marker | null>(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const emitLocation = async (position: Position, knownAddress?: string) => {
        onPositionChange?.(position);
        if (!onLocationChange) return;
        if (knownAddress) return onLocationChange({ ...position, address: knownAddress });
        try {
            const response = await fetch(`https://api.maptiler.com/geocoding/${position.lng},${position.lat}.json?key=${MAPTILER_KEY}`);
            const data = await response.json();
            onLocationChange({ ...position, address: data.features?.[0]?.place_name ?? fallbackAddress(position) });
        } catch {
            onLocationChange({ ...position, address: fallbackAddress(position) });
        }
    };

    const moveMarker = (position: Position, options: { animate?: boolean; address?: string } = {}) => {
        if (!map.current || !marker.current) return;
        marker.current.setLatLng([position.lat, position.lng]);
        map.current.setView([position.lat, position.lng], Math.max(map.current.getZoom(), 13), { animate: options.animate ?? true });
        void emitLocation(position, options.address);
    };

    useEffect(() => {
        if (!mapContainer.current || map.current) return;
        const leafletMap = L.map(mapContainer.current, {
            center: [lat, lng], zoom: 13, zoomControl: true,
            scrollWheelZoom: interactive, doubleClickZoom: interactive, dragging: interactive, touchZoom: interactive,
        });
        map.current = leafletMap;
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors', maxZoom: 13,
        }).addTo(leafletMap);
        marker.current = L.marker([lat, lng], { draggable: interactive, keyboard: interactive }).addTo(leafletMap);
        marker.current.on("dragend", () => { const point = marker.current?.getLatLng(); if (point) moveMarker(point); });
        leafletMap.on("click", (event: L.LeafletMouseEvent) => { if (interactive) moveMarker(event.latlng); });
        const observer = new ResizeObserver(() => leafletMap.invalidateSize());
        observer.observe(mapContainer.current);
        return () => { observer.disconnect(); leafletMap.remove(); map.current = null; marker.current = null; };
        // Leaflet must initialize only once; later coordinates are handled by the controlled update below.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!map.current || !marker.current || !Number.isFinite(lat) || !Number.isFinite(lng)) return;
        marker.current.setLatLng([lat, lng]);
        map.current.setView([lat, lng], map.current.getZoom(), { animate: true });
    }, [lat, lng]);

    const search = async (value: string) => {
        if (!value.trim()) { setResults([]); return; }
        setIsSearching(true);
        try {
            const response = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${MAPTILER_KEY}&limit=5`);
            const data = await response.json();
            const features = (data.features ?? []) as GeocodingFeature[];
            setResults(features.map(feature => ({ id: feature.id, lat: feature.center[1], lng: feature.center[0], address: feature.place_name })));
        } catch { setResults([]); } finally { setIsSearching(false); }
    };

    const updateQuery = (value: string) => {
        setQuery(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => void search(value), 300);
    };

    return <div className={`${styles.mapWrap} ${heightClassName ?? ""}`}>
        {searchable && <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} />
            <input value={query} onChange={(event) => updateQuery(event.target.value)} placeholder="Search for an address or landmark" className={styles.searchInput} aria-label="Search for a location" />
            {isSearching && <Loader2 className={`${styles.loadingIcon} animate-spin`} />}
            {results.length > 0 && <ul className={styles.results}>{results.map(result => <li key={result.id}><button type="button" onClick={() => { setQuery(result.address); setResults([]); moveMarker(result, { address: result.address }); }}><MapPin /><span>{result.address}</span></button></li>)}</ul>}
        </div>}
        <div ref={mapContainer} className={styles.map} />
    </div>;
}
