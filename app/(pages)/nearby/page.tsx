"use client";

// New page: "Find Rooms Near You". Flow — the user arrives here from the home
// CTA, we request browser geolocation permission, and on success we render an
// interactive map of nearby AVAILABLE rooms. Distance filtering is done on the
// backend (GET /rooms/nearby); this page never filters by distance itself. The
// user's coordinates live only in component state and are sent only to the
// nearby-search request.
import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import {
    MapPin,
    Loader2,
    Navigation,
    AlertCircle,
    Clock3,
    XCircle,
    ArrowRight,
    Building2,
    LocateFixed,
    Home,
    Layers,
    Ban,
} from "lucide-react";
import { useGeolocation } from "@/app/hooks/useGeolocation";
import { useMyProfile } from "@/app/hooks/useAuth";
import { useNearbyRooms } from "@/app/hooks/useRoom";
import { useRoommateEvents } from "@/app/hooks/useRoommateRealtime";
import { RADIUS_OPTIONS_KM, DEFAULT_RADIUS_KM, type RadiusKm } from "@/app/lib/nearbyConfig";
import type { NearbyRoom } from "@/app/services/roomService";
import ScheduleViewingModal from "@/components/ScheduleViewingModal";

// Leaflet touches window — load the map client-side only.
const NearbyRoomsMap = dynamic(() => import("@/components/NearbyRoomsMap"), { ssr: false });

const statusBadge: Record<string, { text: string; cls: string }> = {
    AVAILABLE: { text: "Available", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    BOOKED: { text: "Booked", cls: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
    RENTED: { text: "Rented", cls: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
    MAINTENANCE: { text: "Maintenance", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    UNAVAILABLE: { text: "Unavailable", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

function formatNpr(price?: number) {
    if (price == null) return "—";
    return `Rs ${new Intl.NumberFormat("en-IN").format(price)}`;
}

// Full-screen centred state (used for the pre-map permission / loading / error views).
function CenteredState({ children }: { children: React.ReactNode }) {
    return (
        <div className="max-w-md mx-auto mt-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center shadow-sm">
            {children}
        </div>
    );
}

export default function NearbyRoomsPage() {
    const { status, coords, error, request } = useGeolocation();
    const { data: profileData } = useMyProfile();
    const user = profileData?.data;
    const queryClient = useQueryClient();

    const [radius, setRadius] = useState<RadiusKm>(DEFAULT_RADIUS_KM);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [scheduleOpen, setScheduleOpen] = useState(false);

    // Request permission once, as the direct result of the user opening this page
    // from the "Find Rooms Near You" CTA. We never silently re-prompt afterwards.
    const requestedRef = useRef(false);
    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;
        request();
    }, [request]);

    const nearbyParams = useMemo(
        () => (coords ? { latitude: coords.lat, longitude: coords.lng, radius } : null),
        [coords, radius],
    );
    const nearby = useNearbyRooms(nearbyParams);
    const rooms: NearbyRoom[] = useMemo(() => nearby.data ?? [], [nearby.data]);
    const selectedRoom = useMemo(
        () => rooms.find((r) => r.roomId === selectedRoomId) ?? null,
        [rooms, selectedRoomId],
    );

    // Best-effort real-time: subscribe to the selected room's topic. If the room's
    // status changes away from AVAILABLE, drop the selection and refresh the map.
    // This is a UI-sync convenience only — the backend re-validates room status on
    // every viewing request, so a stale marker can never produce a valid booking.
    useRoommateEvents(selectedRoomId ?? undefined, (event) => {
        if (event.type !== "ROOM_STATUS_CHANGED") return;
        queryClient.invalidateQueries({ queryKey: ["ROOM", "nearby"] });
        if (event.roomId === selectedRoomId && event.status !== "AVAILABLE") {
            toast.info("This room is no longer available.");
            setScheduleOpen(false);
            setSelectedRoomId(null);
        }
    });

    // KYC gating — identical rules to the room-details page. The backend is still
    // authoritative; this only controls what the user sees.
    const isAdmin = user?.role === "ROLE_ADMIN";
    const kycStatus = user?.kycStatus;
    const kycSubmitted = user?.kycSubmitted;
    const isKycApproved = isAdmin || (kycSubmitted && kycStatus === "APPROVED");
    const kycHref = user?.role === "ROLE_LANDLORD" ? "/landlord/kyc" : "/kyc";

    const nextRadius = RADIUS_OPTIONS_KM.find((r) => r > radius) as RadiusKm | undefined;

    // ---- Pre-map states (permission / errors / locating) ----
    const renderGate = () => {
        if (status === "unsupported") {
            return (
                <CenteredState>
                    <Ban className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Location not supported</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Your browser does not support location services.
                    </p>
                </CenteredState>
            );
        }
        if (status === "denied") {
            return (
                <CenteredState>
                    <MapPin className="w-10 h-10 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Location access needed</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        Location access is required to find rooms near you. Please enable location for this site in your
                        browser settings, then try again.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 justify-center mt-5">
                        <button
                            onClick={request}
                            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-xl text-sm font-bold transition-all"
                        >
                            <LocateFixed className="w-4 h-4" /> Enable Location
                        </button>
                        <button
                            onClick={request}
                            className="inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-5 rounded-xl text-sm font-bold transition-all"
                        >
                            Try Again
                        </button>
                    </div>
                </CenteredState>
            );
        }
        if (status === "error") {
            return (
                <CenteredState>
                    <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-4" />
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Couldn&apos;t find your location</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                        {error ?? "Unable to determine your current location. Please try again."}
                    </p>
                    <button
                        onClick={request}
                        className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-5 rounded-xl text-sm font-bold transition-all mt-5"
                    >
                        <LocateFixed className="w-4 h-4" /> Try Again
                    </button>
                </CenteredState>
            );
        }
        // idle / locating (and granted-but-coords-not-set-yet)
        return (
            <CenteredState>
                <Loader2 className="w-10 h-10 text-indigo-500 mx-auto mb-4 animate-spin" />
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Getting your location…</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Please allow location access when your browser asks.
                </p>
            </CenteredState>
        );
    };

    const showMap = status === "granted" && !!coords;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-6">
                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
                            <Navigation className="w-6 h-6 text-indigo-600" /> Find Rooms Near You
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            Available rooms within{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-200">{radius} km</span> of your
                            current location.
                        </p>
                    </div>
                    {showMap && (
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            {nearby.isPending ? "Searching…" : `${rooms.length} room${rooms.length === 1 ? "" : "s"} found`}
                        </span>
                    )}
                </div>

                {/* RADIUS SELECTOR — the single source of the search radius (nearbyConfig). */}
                {showMap && (
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Radius</span>
                        {RADIUS_OPTIONS_KM.map((r) => (
                            <button
                                key={r}
                                onClick={() => setRadius(r)}
                                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                                    radius === r
                                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                                        : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                                }`}
                            >
                                {r} km
                            </button>
                        ))}
                    </div>
                )}

                {/* BODY */}
                {!showMap ? (
                    renderGate()
                ) : (
                    <div className="relative">
                        <NearbyRoomsMap
                            center={coords}
                            radiusKm={radius}
                            rooms={rooms}
                            selectedId={selectedRoomId}
                            onSelect={setSelectedRoomId}
                        />

                        {/* Loading overlay while the nearby search runs. */}
                        {nearby.isPending && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-full px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-semibold">
                                <Loader2 className="w-4 h-4 animate-spin text-indigo-500" /> Finding rooms near you…
                            </div>
                        )}

                        {/* Error overlay. */}
                        {nearby.isError && !nearby.isPending && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] bg-white/95 dark:bg-slate-900/95 border border-red-200 dark:border-red-900 rounded-2xl px-5 py-3 shadow-lg text-center">
                                <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                    Could not load nearby rooms.
                                </p>
                                <button
                                    onClick={() => nearby.refetch()}
                                    className="mt-2 text-xs font-bold text-indigo-600 hover:underline"
                                >
                                    Try again
                                </button>
                            </div>
                        )}

                        {/* Empty state. */}
                        {!nearby.isPending && !nearby.isError && rooms.length === 0 && (
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[500] w-[min(92%,26rem)] bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 shadow-lg text-center">
                                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    No available rooms found within {radius} km.
                                </p>
                                {nextRadius && (
                                    <button
                                        onClick={() => setRadius(nextRadius)}
                                        className="mt-3 inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-all"
                                    >
                                        Increase radius to {nextRadius} km <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* SELECTED ROOM CARD — overlays the map (map stays visible). */}
                        {selectedRoom && (
                            <RoomCard
                                room={selectedRoom}
                                onClose={() => setSelectedRoomId(null)}
                                onRequestVisit={() => setScheduleOpen(true)}
                                isKycApproved={Boolean(isKycApproved)}
                                hasUser={Boolean(user)}
                                kycStatus={kycStatus}
                                kycSubmitted={Boolean(kycSubmitted)}
                                kycHref={kycHref}
                            />
                        )}
                    </div>
                )}

                <p className="text-[11px] text-slate-400 text-center font-medium">
                    Your location is used only to search for nearby rooms. It is never shared with landlords or other users.
                </p>
            </main>

            {selectedRoom && (
                <ScheduleViewingModal
                    roomId={selectedRoom.roomId}
                    roomTitle={selectedRoom.roomTitle}
                    open={scheduleOpen}
                    onClose={() => setScheduleOpen(false)}
                />
            )}
        </div>
    );
}

// The card shown when a room marker is clicked. Actions mirror the room-details
// page: [View Details] navigates to the full listing, [Request Visit] is gated by
// APPROVED KYC and room availability.
function RoomCard({
    room,
    onClose,
    onRequestVisit,
    isKycApproved,
    hasUser,
    kycStatus,
    kycSubmitted,
    kycHref,
}: {
    room: NearbyRoom;
    onClose: () => void;
    onRequestVisit: () => void;
    isKycApproved: boolean;
    hasUser: boolean;
    kycStatus?: string | null;
    kycSubmitted: boolean;
    kycHref: string;
}) {
    const badge = statusBadge[room.status] ?? statusBadge.UNAVAILABLE;
    const canRequest = room.status === "AVAILABLE";
    const image = room.imageUrls?.[0]?.url;

    return (
        <div className="absolute z-[600] inset-x-3 bottom-3 sm:inset-x-auto sm:left-4 sm:bottom-4 sm:w-[22rem]">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
                <div className="relative h-32 bg-slate-200 dark:bg-slate-800">
                    {image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={image} alt={room.roomTitle} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
                            <Building2 className="w-8 h-8" />
                        </div>
                    )}
                    <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.cls}`}>
                        {badge.text}
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-sm"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-4 space-y-3">
                    <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">{room.roomTitle}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {room.propertyName && (
                                <span className="inline-flex items-center gap-1 truncate">
                                    <Building2 className="w-3 h-3" /> {room.propertyName}
                                </span>
                            )}
                            {room.distanceKm != null && (
                                <span className="inline-flex items-center gap-1 shrink-0">
                                    <MapPin className="w-3 h-3" /> {room.distanceKm.toFixed(1)} km away
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-lg font-extrabold text-slate-900 dark:text-white">{formatNpr(room.price)}</span>
                            <span className="text-xs font-medium text-slate-400"> / month</span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                            {room.sharingType && (
                                <span className="inline-flex items-center gap-1">
                                    <Home className="w-3 h-3" /> {room.sharingType === "SHARED" ? "Shared" : "Private"}
                                </span>
                            )}
                            {room.roomType && (
                                <span className="inline-flex items-center gap-1 capitalize">
                                    <Layers className="w-3 h-3" /> {room.roomType}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link
                            href={`/room/${room.roomId}`}
                            className="flex-1 text-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                        >
                            View Details
                        </Link>

                        {!canRequest ? (
                            <button
                                disabled
                                className="flex-1 bg-indigo-600 opacity-50 cursor-not-allowed text-white py-2.5 px-3 rounded-xl text-xs font-bold"
                            >
                                Unavailable
                            </button>
                        ) : isKycApproved || !hasUser ? (
                            <button
                                onClick={onRequestVisit}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
                            >
                                Request Visit
                            </button>
                        ) : (
                            <Link
                                href={kycHref}
                                className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold transition-all"
                            >
                                {kycSubmitted && kycStatus === "REJECTED" ? "Resubmit KYC" : "Complete KYC"}
                            </Link>
                        )}
                    </div>

                    {/* KYC status hint under the actions (only for signed-in, non-approved users). */}
                    {canRequest && hasUser && !isKycApproved && (
                        <div
                            className={`flex items-start gap-2 text-[11px] font-medium rounded-xl p-2.5 ${
                                kycSubmitted && kycStatus === "PENDING"
                                    ? "bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                                    : kycSubmitted && kycStatus === "REJECTED"
                                    ? "bg-red-50/80 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                                    : "bg-slate-50 dark:bg-slate-950/60 text-slate-600 dark:text-slate-300"
                            }`}
                        >
                            {kycSubmitted && kycStatus === "PENDING" ? (
                                <>
                                    <Clock3 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>Your KYC is under review. You can request a visit once it is approved.</span>
                                </>
                            ) : kycSubmitted && kycStatus === "REJECTED" ? (
                                <>
                                    <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>Your KYC was rejected. Please resubmit it before requesting a visit.</span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                                    <span>Approved KYC is required before you can request a visit.</span>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
