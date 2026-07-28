"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from './map.module.css';
import { MaptilerLayer, MapStyle } from "@maptiler/leaflet-maptilersdk";
import { useEffect, useRef, useState } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
    iconRetinaUrl: (markerIcon2x as any).src ?? markerIcon2x,
    iconUrl: (markerIcon as any).src ?? markerIcon,
    shadowUrl: (markerShadow as any).src ?? markerShadow,
});

const customIcon = L.icon({
    iconUrl: '/my-pin.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
});


interface MapProps {
    lat: number;
    lng: number;
    onPositionChange?: (pos: { lat: number; lng: number }) => void;
    mapStyle?: MapStyle;
    origin?: { lat: number; lng: number };
}

const Map: React.FC<MapProps> = ({ lat, lng, onPositionChange, mapStyle = MapStyle.STREETS, origin }) => {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const map = useRef<L.Map | null>(null);
    const marker = useRef<L.Marker | null>(null);
    const originMarker = useRef<L.CircleMarker | null>(null);
    const routeLayer = useRef<L.Polyline | null>(null);
    const mtLayer = useRef<any>(null);
    const center = { lat, lng };
    const [zoom, setZoom] = useState<number>(17);
    const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);


    useEffect(() => {
        if (map.current) return;

        map.current = new L.Map(mapContainer.current, {
            center: L.latLng(center.lat, center.lng),
            zoom: zoom
        });

        const handleZoom = () => {
            if (!map.current) return;
            setZoom(map.current.getZoom());
        };
        map.current.on('zoomend', handleZoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map.current);

        marker.current = L.marker([center.lat, center.lng], { draggable: true }).addTo(map.current);

        marker.current.on('dragend', () => {
            const pos = marker.current.getLatLng();
            onPositionChange?.({ lat: pos.lat, lng: pos.lng });
        });

        const handleClick = (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            marker.current.setLatLng([lat, lng]);
            onPositionChange?.({ lat, lng });
        };

        map.current.on('click', handleClick);
        console.log(`lat: ${lat} lng: ${lng}`)


        return () => {
            if (map.current) {
                map.current.off('zoomend', handleZoom as any);
                map.current.remove();
            }
            map.current = null;
            marker.current = null;
        };
    }, []); // run once on mount only


    useEffect(() => {
        console.log(`lat: ${lat} lng: ${lng} zoom: ${zoom}`)
    }, [center.lat, center.lng, zoom])

    useEffect(() => {
        if (!map.current) return;
        map.current.setView(L.latLng(center.lat, center.lng), zoom);
        marker.current?.setLatLng([center.lat, center.lng]); // move marker to match search/geolocation result
    }, [center.lat, center.lng, zoom]);

    useEffect(() => {
        if (!mtLayer.current) return;
        mtLayer.current.setStyle(mapStyle);
    }, [mapStyle]);

    useEffect(() => {
        if (!map.current || !origin?.lat || !origin?.lng) return;
        if (originMarker.current) return; // only place once

        originMarker.current = L.circleMarker([origin.lat, origin.lng], {
            radius: 8,
            color: "#4285F4",
            fillColor: "#4285F4",
            fillOpacity: 0.8,
        }).addTo(map.current).bindTooltip("You are here");
    }, [origin?.lat, origin?.lng]);

    // Effect: fetch + draw route whenever destination (marker) or origin changes
    useEffect(() => {
        if (!map.current || !origin?.lat || !origin?.lng) return;

        const fetchRoute = async () => {
            try {
                const url = `https://router.project-osrm.org/route/v1/driving/${origin.lng},${origin.lat};${center.lng},${center.lat}?overview=full&geometries=geojson`;
                const res = await fetch(url);
                const data = await res.json();

                const route = data.routes?.[0];
                if (!route) return;

                const latlngs = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);

                if (routeLayer.current) {
                    map.current.removeLayer(routeLayer.current);
                }

                routeLayer.current = L.polyline(latlngs, {
                    color: "#1a73e8",
                    weight: 5,
                    opacity: 0.8,
                }).addTo(map.current);

                // keep current zoom consistent — pan to route center instead of auto-zooming
                try {
                    const boundsCenter = routeLayer.current.getBounds().getCenter();
                    map.current.panTo(boundsCenter);
                } catch (e) {
                    // fallback: do nothing
                }

                setRouteInfo({
                    distance: route.distance, // meters
                    duration: route.duration, // seconds
                });
            } catch (err) {
                console.error("Directions error:", err);
            }
        };

        fetchRoute();
    }, [origin?.lat, origin?.lng, center.lat, center.lng]);

    return (
        <div className={styles.mapWrap}>
            <div ref={mapContainer} className={styles.map} />
            {routeInfo && (
                <div className={styles.routeInfo}>
                    {(routeInfo.distance / 1000).toFixed(1)} km · {Math.round(routeInfo.duration / 60)} min
                </div>
            )}
        </div>
    )
}

export default Map; 
