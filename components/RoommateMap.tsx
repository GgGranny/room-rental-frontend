"use client";

// New API: multi-marker roommate map for a shared room. Reuses the SAME Leaflet
// library as components/Map.tsx (no second map library). Markers are placed
// deterministically around the ROOM's own coordinates — tenant home locations
// are never exposed; marker spread is purely presentational.
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";

export type RoommateMapMarker = {
    id: string;
    kind: "room" | "person";
    label: string;
    lat: number;
    lng: number;
};

type Props = {
    center: { lat: number; lng: number };
    markers: RoommateMapMarker[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    heightClassName?: string;
};

const roomIcon = () =>
    L.divIcon({
        className: "",
        html: `<div style="width:38px;height:38px;border-radius:9999px;background:#4f46e5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 6px 16px rgba(79,70,229,.45);border:3px solid #fff;">🏠</div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
    });

const personIcon = (selected: boolean) =>
    L.divIcon({
        className: "",
        html: `<div style="width:${selected ? 34 : 30}px;height:${selected ? 34 : 30}px;border-radius:9999px;background:${selected ? "#059669" : "#10b981"};color:#fff;display:flex;align-items:center;justify-content:center;font-size:${selected ? 16 : 14}px;box-shadow:0 4px 12px rgba(16,185,129,.5);border:2.5px solid #fff;">👤</div>`,
        iconSize: selected ? [34, 34] : [30, 30],
        iconAnchor: [selected ? 17 : 15, selected ? 17 : 15],
    });

// Deterministic ring placement around the room (golden-angle spread, ~90-220m).
function offsetPosition(center: { lat: number; lng: number }, index: number) {
    const angle = index * 2.399963; // golden angle in radians
    const radius = 95 + (index % 4) * 42;
    const dLat = (radius * Math.cos(angle)) / 111320;
    const dLng = (radius * Math.sin(angle)) / (111320 * Math.max(Math.cos((center.lat * Math.PI) / 180), 0.1));
    return { lat: center.lat + dLat, lng: center.lng + dLng };
}

export default function RoommateMap({ center, markers, selectedId, onSelect, heightClassName }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;
        const leafletMap = L.map(containerRef.current, {
            center: [center.lat, center.lng],
            zoom: 14,
            zoomControl: true,
            scrollWheelZoom: true,
        });
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 18,
        }).addTo(leafletMap);
        layerRef.current = L.layerGroup().addTo(leafletMap);
        mapRef.current = leafletMap;
        const observer = new ResizeObserver(() => leafletMap.invalidateSize());
        observer.observe(containerRef.current);
        return () => {
            observer.disconnect();
            leafletMap.remove();
            mapRef.current = null;
            layerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const map = mapRef.current;
        const layer = layerRef.current;
        if (!map || !layer) return;

        // Recompute person-marker positions from the room centre on every render.
        let personIndex = 0;
        layer.clearLayers();
        const points: L.LatLngExpression[] = [[center.lat, center.lng]];

        markers.forEach((marker) => {
            const position =
                marker.kind === "person" ? offsetPosition(center, personIndex++) : { lat: marker.lat, lng: marker.lng };
            points.push([position.lat, position.lng]);
            const leafletMarker = L.marker([position.lat, position.lng], {
                icon: marker.kind === "room" ? roomIcon() : personIcon(selectedId === marker.id),
                zIndexOffset: marker.kind === "room" ? 500 : selectedId === marker.id ? 400 : 0,
                title: marker.label,
            });
            leafletMarker.on("click", () => onSelect?.(marker.id));
            leafletMarker.addTo(layer);
        });

        if (points.length > 1) {
            map.fitBounds(L.latLngBounds(points).pad(0.35), { animate: true, maxZoom: 15 });
        } else {
            map.setView([center.lat, center.lng], 15, { animate: true });
        }
    }, [markers, selectedId, center, onSelect]);

    return (
        <div
            ref={containerRef}
            role="application"
            aria-label="Roommate map"
            className={`w-full rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${heightClassName ?? "h-[420px] md:h-[520px]"}`}
        />
    );
}
