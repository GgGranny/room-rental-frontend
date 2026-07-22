// app/dashboard/landlord/properties/[id]/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    MapPin,
    DoorOpen,
    Pencil,
    Plus,
    Loader2,
    AlertTriangle,
    BadgeCheck,
    Mail,
    Phone,
    Building2,
    Layers,
} from "lucide-react";
import { useGetPropertyById } from "@/app/hooks/useProperty";

// app/types/property.ts

export interface RoomImage {
    id: number;
    url: string;
    fileSize: number;
    contentType: string;
    imageFor: string;
}

export interface Room {
    roomId: string;
    propertyId: string;
    propertyName: string;
    roomTitle: string;
    roomType: string;
    description: string;
    price: number;
    floorNumber: number;
    location: string;
    city: string;
    district: string;
    province: string | null;
    status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE" | string;
    totalRooms: number;
    facilities: string[] | null;
    preferredTenants: string[] | null;
    rules: string[] | null;
    imageUrls: RoomImage[];
}

export interface Landlord {
    userId: string;
    email: string;
    phoneNumber: string;
    role: string;
    fname: string;
    lname: string;
    dateOfBirth: string;
    profilePictureUrl: string;
    provider: string | null;
    verified: boolean;
    active: boolean;
    profileCompleted: boolean;
    kycSubmitted: boolean;
    kycStatus: string | null;
}

export interface PropertyDetail {
    id: string;
    propertyName: string;
    propertyStatus: "ACTIVE" | "INACTIVE" | "PENDING" | string;
    description: string;
    thumbnailUrl: string;
    city: string;
    district: string;
    province: string;
    zipCode: string;
    country: string;
    landlord: Landlord;
    rooms: Room[];
}

export interface ApiResponse<T> {
    status: string;
    success: boolean;
    message: string;
    data: T;
    timeStamp: string;
}

const roomStatusStyles: Record<string, string> = {
    AVAILABLE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    OCCUPIED: "bg-indigo-50 text-indigo-600 border-indigo-200",
    MAINTENANCE: "bg-amber-50 text-amber-600 border-amber-200",
};

const propertyStatusStyles: Record<string, string> = {
    ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
    PENDING: "bg-amber-50 text-amber-600 border-amber-200",
    INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function PropertyDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { data: response, isLoading, isError, error } = useGetPropertyById(id);
    const property = response?.data;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Loading property...
                </p>
            </div>
        );
    }

    if (isError || !property) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <AlertTriangle className="w-10 h-10 text-rose-400 mb-3" />
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                    Failed to load property
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                    {error instanceof Error ? error.message : "Please try again."}
                </p>
            </div>
        );
    }

    const rooms = property.rooms ?? [];
    const availableCount = rooms.filter((r) => r.status === "AVAILABLE").length;

    return (
        <div className="space-y-6">
            {/* Back link */}
            <Link
                href="/dashboard/landlord/properties"
                className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600"
            >
                <ArrowLeft className="h-4 w-4" />
                Properties
            </Link>

            {/* Hero header */}
            <div className="relative h-52 sm:h-64 w-full overflow-hidden rounded-2xl">
                <img
                    src={property.thumbnailUrl}
                    alt={property.propertyName}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

                <div className="absolute top-4 right-4">
                    <Link
                        href={`/dashboard/landlord/properties/${property.id}/edit`}
                        className="inline-flex items-center gap-2 bg-white/90 hover:bg-white text-slate-700 text-xs font-bold py-2 px-3.5 rounded-lg backdrop-blur transition-all"
                    >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                    </Link>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                    <span
                        className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border mb-2 ${propertyStatusStyles[property.propertyStatus] ?? propertyStatusStyles.INACTIVE
                            }`}
                    >
                        {property.propertyStatus}
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {property.propertyName}
                    </h1>
                    <p className="flex items-center gap-1 text-xs font-medium text-white/80 mt-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {property.city}, {property.district}, {property.province}, {property.country} — {property.zipCode}
                    </p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                {/* Main column */}
                <div className="space-y-6">
                    {/* Description */}
                    {property.description && (
                        <section className="rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm">
                            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                                About this property
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                {property.description}
                            </p>
                        </section>
                    )}

                    {/* Rooms */}
                    <section className="rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Rooms
                                </h2>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                    {availableCount}/{rooms.length} available
                                </p>
                            </div>
                            <Link
                                href={`/dashboard/landlord/properties/${property.id}/rooms/add`}
                                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-3.5 rounded-lg transition-all"
                            >
                                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                                Add Room
                            </Link>
                        </div>

                        {rooms.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-14 text-center">
                                <DoorOpen className="w-9 h-9 text-slate-300 dark:text-slate-700 mb-3" />
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    No rooms yet
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                                    Add a room to start listing vacancies.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5">
                                {rooms.map((room) => (
                                    <RoomCard key={room.roomId} room={room} />
                                ))}
                            </div>
                        )}
                    </section>
                </div>

                {/* Sidebar */}
                <aside className="space-y-6">
                    <section className="rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                            Landlord
                        </h2>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="h-11 w-11 shrink-0 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                                {property.landlord.profilePictureUrl ? (
                                    <img
                                        src={property.landlord.profilePictureUrl}
                                        alt={property.landlord.fname}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-slate-300">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                                        {property.landlord.fname} {property.landlord.lname}
                                    </p>
                                    {property.landlord.verified && (
                                        <BadgeCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                    )}
                                </div>
                                <p className="text-xs text-slate-400">Landlord</p>
                            </div>
                        </div>

                        <div className="space-y-2.5 text-xs">
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">{property.landlord.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {property.landlord.phoneNumber}
                            </div>
                        </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 p-5 shadow-sm">
                        <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-4">
                            Summary
                        </h2>
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Total rooms</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{rooms.length}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Available</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{availableCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Status</span>
                                <span className="font-bold text-slate-700 dark:text-slate-200">{property.propertyStatus}</span>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

function RoomCard({ room }: { room: Room }) {
    const [activeImage, setActiveImage] = useState(0);
    const images = room.imageUrls ?? [];

    return (
        <div className="rounded-xl border border-slate-200/60 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-800">
                {images.length > 0 ? (
                    <img
                        src={images[activeImage].url}
                        alt={room.roomTitle}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-slate-300 dark:text-slate-700" />
                    </div>
                )}

                <span
                    className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-1 rounded-full border ${roomStatusStyles[room.status] ?? roomStatusStyles.AVAILABLE
                        }`}
                >
                    {room.status}
                </span>

                {images.length > 1 && (
                    <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((img, idx) => (
                            <button
                                key={img.id}
                                onClick={() => setActiveImage(idx)}
                                className={`h-1.5 rounded-full transition-all ${idx === activeImage ? "w-4 bg-white" : "w-1.5 bg-white/50"
                                    }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="p-3.5 space-y-2">
                <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {room.roomTitle}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {room.location}
                    </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        Floor {room.floorNumber}
                    </span>
                    <span>{room.roomType}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                        Rs {room.price.toLocaleString()}
                        <span className="text-xs font-medium text-slate-400">/mo</span>
                    </span>
                    <Link
                        href={`/landlord/properties/${room.propertyId}/rooms/${room.roomId}`}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                    >
                        View
                    </Link>
                </div>
            </div>
        </div>
    );
}