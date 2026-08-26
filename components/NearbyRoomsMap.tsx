"use client";

// New: interactive "Find Rooms Near You" map. Reuses the SAME Leaflet library as
// components/Map.tsx and components/RoommateMap.tsx (no second map library). It
// renders the user's current-location marker, the search-radius circle, and one
// marker per nearby AVAILABLE room (price shown on the pin). The user's exact
// coordinates are only ever used to centre the map and draw the radius — they are
// never written into any room marker's data.
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef } from "react";
import type { NearbyRoom } from "@/app/services/roomService";

type Props = {
    center: { lat: number; lng: number };
    radiusKm: number;
    rooms: NearbyRoom[];
    selectedId?: string | null;
    onSelect?: (id: string) => void;
    heightClassName?: string;
};

// Compact price label for a map pin (full price is shown in the room card).
function compactPrice(price?: number) {
    if (price == null) return "";
    if (price >= 1000) {
        const k = price / 1000;
        return `Rs ${Number.isInteger(k) ? k : k.toFixed(1)}k`;
    }
    return `Rs ${price}`;
}

// "You are here" marker — deliberately distinct from room markers.
const userIcon = () =>
    L.divIcon({
        className: "",
        html: `<div style="width:34px;height:34px;border-radius:9999px;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 0 6px rgba(37,99,235,.25),0 6px 16px rgba(37,99,235,.45);border:3px solid #fff;">📍</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
    });

// Room marker: house glyph + price pill. Highlighted when selected.
const roomIcon = (label: string, selected: boolean) =>
    L.divIcon({
        className: "",
        html: `<div style="display:flex;flex-direction:column;align-items:center;transform:translateZ(0);">
            <div style="display:flex;align-items:center;gap:4px;background:${selected ? "#4338ca" : "#4f46e5"};color:#fff;padding:4px 8px;border-radius:9999px;font-size:12px;font-weight:700;white-space:nowrap;box-shadow:0 6px 16px rgba(79,70,229,.45);border:2px solid #fff;">
                <span>🏠</span><span>${label}</span>
            </div>
            <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:7px solid ${selected ? "#4338ca" : "#4f46e5"};margin-top:-1px;"></div>
        </div>`,
        iconSize: [0, 0],
        iconAnchor: [0, 34],
    });

export default function NearbyRoomsMap({ center, radiusKm, rooms, selectedId, onSelect, heightClassName }: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<L.Map | null>(null);
    const layerRef = useRef<L.LayerGroup | null>(null);

    // Initialise the map exactly once, mirroring RoommateMap's lifecycle.
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

    // Redraw the radius circle, the user marker and all room markers on change.
    useEffect(() => {
        const map = mapRef.current;
        const layer = layerRef.current;
        if (!map || !layer) return;

        layer.clearLayers();

        const circle = L.circle([center.lat, center.lng], {
            radius: radiusKm * 1000,
            color: "#4f46e5",
            weight: 1.5,
            fillColor: "#6366f1",
            fillOpacity: 0.08,
        }).addTo(layer);

        L.marker([center.lat, center.lng], {
            icon: userIcon(),
            zIndexOffset: 1000,
            title: "Your location",
        }).addTo(layer);

        rooms.forEach((room) => {
            if (room.latitude == null || room.longitude == null) return;
            const marker = L.marker([room.latitude, room.longitude], {
                icon: roomIcon(compactPrice(room.price), selectedId === room.roomId),
                zIndexOffset: selectedId === room.roomId ? 600 : 300,
                title: room.roomTitle,
            });
            marker.on("click", () => onSelect?.(room.roomId));
            marker.addTo(layer);
        });

        // Keep the whole search radius in view (all matches lie inside it).
        map.fitBounds(circle.getBounds(), { animate: true, padding: [40, 40] });
    }, [center, radiusKm, rooms, selectedId, onSelect]);

    return (
        <div
            ref={containerRef}
            role="application"
            aria-label="Map of rooms near your location"
            // relative z-0 confines Leaflet's own controls (z-index up to 1000) to
            // this container's stacking context, so the page's overlays sitting on
            // top of the map (loading badge, room card) are never covered by them.
            className={`relative z-0 w-full rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${heightClassName ?? "h-[420px] md:h-[560px]"}`}
        />
    );
}
