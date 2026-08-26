"use client";

import { useCallback, useState } from "react";

// New: browser geolocation wrapper for "Find Rooms Near You". It NEVER runs on
// its own — the caller invokes request() in response to a user action, so the
// permission prompt only appears when the user asks to find nearby rooms. The
// resolved coordinates stay in React state and are used solely for the nearby
// search; they are never persisted or sent anywhere except the search request.
export type GeoStatus = "idle" | "locating" | "granted" | "denied" | "unsupported" | "error";

export type Coords = { lat: number; lng: number };

export function useGeolocation() {
    const [status, setStatus] = useState<GeoStatus>("idle");
    const [coords, setCoords] = useState<Coords | null>(null);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(() => {
        // Case 3: browser has no geolocation support.
        if (typeof window === "undefined" || !("geolocation" in navigator)) {
            setStatus("unsupported");
            setError("Your browser does not support location services.");
            return;
        }

        setStatus("locating");
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // Case 1: permission granted — keep coordinates in memory only.
                setCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
                setStatus("granted");
            },
            (err) => {
                if (err.code === err.PERMISSION_DENIED) {
                    // Case 2: the user denied permission. Do not keep re-prompting.
                    setStatus("denied");
                    setError("Location access is required to find rooms near you.");
                } else {
                    // Case 4: position unavailable / timeout.
                    setStatus("error");
                    setError("Unable to determine your current location. Please try again.");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
        );
    }, []);

    return { status, coords, error, request };
}
