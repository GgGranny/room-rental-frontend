"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
    Star,
    MapPin,
    User,
    CheckCircle2,
    Layers,
    Building2,
    Bed,
    Home,
    ListChecks,
    ShieldCheck,
    Phone,
    Mail,
    Clock3,
    Users,
    XCircle,
    AlertCircle,
    ArrowRight,
} from "lucide-react";
import { useGetRoomById } from "@/app/hooks/useRoom";
import { useMyProfile } from "@/app/hooks/useAuth";
import { RoomDetails } from "@/app/services/roomService";
import ScheduleViewingModal from "@/components/ScheduleViewingModal";

// Read-only Leaflet map; loaded client-side only (Leaflet touches window).
const Map = dynamic(() => import("@/components/Map"), { ssr: false });

type HostInfo = {
    fname?: string;
    lname?: string;
    email?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
};

const statusBadge: Record<string, { text: string; cls: string }> = {
    AVAILABLE: { text: "Available", cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" },
    BOOKED: { text: "Booked", cls: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400" },
    MAINTENANCE: { text: "Maintenance", cls: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400" },
    UNAVAILABLE: { text: "Unavailable", cls: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" },
};

function formatNpr(price?: number) {
    if (price == null) return "—";
    return `Rs ${new Intl.NumberFormat("en-IN").format(price)}`;
}

export default function RoomDetailsPage() {
    const params = useParams();
    const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string | undefined);
    const { data, isPending, isError } = useGetRoomById(id);
    const { data: profileData } = useMyProfile();
    const user = profileData?.data;
    const room = data as RoomDetails | undefined;
    const [scheduleOpen, setScheduleOpen] = useState(false);

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-6 max-w-7xl mx-auto">
                <div className="h-[420px] rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-8 h-8 w-1/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-4 h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    if (isError || !room) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <div className="text-center">
                    <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                    <h1 className="text-lg font-bold text-slate-800 dark:text-slate-200">Room not found</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">This listing may have been removed.</p>
                </div>
            </div>
        );
    }

    const host = room.userResponse as HostInfo | undefined;
    const badge = statusBadge[room.status] ?? statusBadge.UNAVAILABLE;
    const place = room.location || [room.city, room.district, room.province].filter(Boolean).join(", ") || "Nepal";
    const images = room.imageUrls ?? [];
    const hostName = [host?.fname, host?.lname].filter(Boolean).join(" ") || "Property Host";
    const canSchedule = room.status === "AVAILABLE";
    const isSharedRoom = room.sharingType === "SHARED";

    const isAdmin = user?.role === "ROLE_ADMIN";
    const kycStatus = user?.kycStatus;
    const kycSubmitted = user?.kycSubmitted;
    const isKycApproved = isAdmin || (kycSubmitted && kycStatus === "APPROVED");
    const kycHref = user?.role === "ROLE_LANDLORD" ? "/landlord/kyc" : "/kyc";
    // Tenant-only feature: landlords/admins manage shared rooms but never use
    // the roommate finder themselves.
    const showRoommateSection = isSharedRoom && user?.role !== "ROLE_LANDLORD" && !isAdmin;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 space-y-8">
                {/* IMAGE GRID */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-md">
                    <div className="md:col-span-2 relative bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                        {images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={images[0].url} alt={room.roomTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600"><Building2 className="w-12 h-12" /></div>
                        )}
                        <span className={`absolute top-4 left-4 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full tracking-wide uppercase shadow-sm ${badge.cls}`}>
                            {badge.text}
                        </span>
                    </div>
                    <div className="hidden md:flex flex-col gap-3 md:col-span-1">
                        {[images[1], images[2]].map((img, i) => (
                            <div key={i} className="flex-1 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                                {img && (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={img.url} alt={`${room.roomTitle} ${i + 2}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="hidden md:block md:col-span-1 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                        {images[3] && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={images[3].url} alt={`${room.roomTitle} 4`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{room.roomTitle}</h1>
                                {room.sharingType && (
                                    <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold ${room.sharingType === "SHARED" ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400" : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400"}`}>
                                        <Home className="w-3.5 h-3.5" /> {room.sharingType === "SHARED" ? "Shared Room" : "Private Room"}
                                    </div>
                                )}
                                {room.roomType && (
                                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-0.5 rounded-lg text-xs font-bold capitalize">
                                        {room.roomType}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                <MapPin className="w-4 h-4 text-slate-400" /> {place}
                            </div>
                            {room.propertyName && (
                                <p className="text-xs text-slate-400 dark:text-slate-500">Part of {room.propertyName}</p>
                            )}
                        </div>

                        <hr className="border-slate-200 dark:border-slate-800/80" />

                        {room.description && (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">About this room</h3>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">{room.description}</p>
                            </div>
                        )}

                        {/* SPECS */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {[
                                { icon: Bed, label: "Type", value: room.roomType || "—" },
                                { icon: Layers, label: "Floor", value: room.floorNumber != null ? String(room.floorNumber) : "—" },
                                { icon: Building2, label: "Units", value: room.totalRooms != null ? String(room.totalRooms) : "—" },
                                { icon: Home, label: "Status", value: badge.text },
                            ].map((s, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
                                    <s.icon className="w-4 h-4 text-indigo-500 mb-2" />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize truncate">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* SHARED ROOM — ROOMMATE FINDER (never shown for private rooms) */}
                        {showRoommateSection && (
                            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-900/50 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
                                <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>Looking for a roommate?</span>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium max-w-xl">
                                    This is a shared room. Express your interest, browse tenants looking to share this room and send a roommate request.
                                    Approved KYC is required to send requests.
                                </p>
                                <Link
                                    href={`/roommates?roomId=${room.roomId}`}
                                    className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-5 rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-600/10"
                                >
                                    Find a Roommate <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        )}

                        {/* FACILITIES & RULES */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {room.facilities && room.facilities.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-indigo-500" /> Facilities</h4>
                                    <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {room.facilities.map((f, i) => <li key={i} className="flex items-center gap-2 capitalize">✔ {f}</li>)}
                                    </ul>
                                </div>
                            )}
                            {room.rules && room.rules.length > 0 && (
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5"><ListChecks className="w-4 h-4 text-indigo-500" /> House Rules</h4>
                                    <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {room.rules.map((r, i) => <li key={i} className="flex items-center gap-2 capitalize">• {r}</li>)}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* LOCATION MAP */}
                        {room.latitude != null && room.Longitude != null && (
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location</h4>
                                {room.address && <p className="text-sm text-slate-600 dark:text-slate-300">{room.address}</p>}
                                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                    <Map lat={room.latitude} lng={room.Longitude} interactive={false} heightClassName="h-64" />
                                </div>
                            </div>
                        )}

                        {/* HOST */}
                        <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 overflow-hidden">
                                    {host?.profilePictureUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={host.profilePictureUrl} alt={hostName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 stroke-[2]" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Managed by</span>
                                    <h4 className="text-base font-bold text-slate-900 dark:text-white">{hostName}</h4>
                                    <div className="flex flex-col gap-0.5 mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                                        {host?.email && <span className="flex items-center gap-1.5"><Mail className="w-3 h-3" /> {host.email}</span>}
                                        {host?.phoneNumber && <span className="flex items-center gap-1.5"><Phone className="w-3 h-3" /> {host.phoneNumber}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* RIGHT COLUMN — STICKY BOOKING PANEL */}
                    <div className="lg:sticky lg:top-24">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{formatNpr(room.price)}</span>
                                    <span className="text-sm font-medium text-slate-400"> / month</span>
                                </div>
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide uppercase ${badge.cls}`}>
                                    {badge.text}
                                </span>
                            </div>

                            <div className="flex items-start gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 rounded-xl p-3">
                                <ShieldCheck className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                                <span>Request a tour with the host. No payment is required to schedule a viewing.</span>
                            </div>

                            {!canSchedule ? (
                                <>
                                    <button
                                        disabled
                                        className="w-full bg-indigo-600 opacity-50 cursor-not-allowed text-white py-3 px-4 rounded-xl text-sm font-bold tracking-wide shadow-md"
                                    >
                                        Not Available
                                    </button>
                                    <p className="text-[11px] text-slate-400 text-center font-medium">
                                        This room is currently {badge.text.toLowerCase()} and can&apos;t be viewed right now.
                                    </p>
                                </>
                            ) : isKycApproved || !user ? (
                                <button
                                    onClick={() => setScheduleOpen(true)}
                                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-indigo-600/10"
                                >
                                    Schedule a Viewing
                                </button>
                            ) : kycSubmitted && kycStatus === "PENDING" ? (
                                <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl p-4 space-y-2">
                                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                                        <Clock3 className="w-4 h-4 shrink-0" />
                                        <span>KYC Under Review</span>
                                    </div>
                                    <p className="text-xs text-amber-700/90 dark:text-amber-400/90 leading-relaxed font-medium">
                                        Your KYC is under review. You can schedule a visit once it is approved.
                                    </p>
                                </div>
                            ) : kycSubmitted && kycStatus === "REJECTED" ? (
                                <div className="bg-red-50/80 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-xs">
                                        <XCircle className="w-4 h-4 shrink-0" />
                                        <span>KYC Verification Rejected</span>
                                    </div>
                                    <p className="text-xs text-red-700/90 dark:text-red-400/90 leading-relaxed font-medium">
                                        Your KYC was rejected. Please resubmit your KYC before scheduling a visit.
                                    </p>
                                    <Link
                                        href={kycHref}
                                        className="w-full inline-flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-sm"
                                    >
                                        Resubmit KYC <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ) : (
                                <div className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 space-y-3">
                                    <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-xs">
                                        <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                                        <span>KYC Verification Required</span>
                                    </div>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        You need approved KYC verification before you can schedule a visit.
                                    </p>
                                    <Link
                                        href={kycHref}
                                        className="w-full inline-flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10"
                                    >
                                        Complete KYC <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
            <ScheduleViewingModal roomId={room.roomId} roomTitle={room.roomTitle} open={scheduleOpen} onClose={() => setScheduleOpen(false)} />
        </div>
    );
}

