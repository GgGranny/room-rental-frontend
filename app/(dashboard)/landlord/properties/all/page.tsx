"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Search,
    Plus,
    MapPin,
    DoorOpen,
    Building2,
    Loader2,
    AlertTriangle,
    Eye,
    Pencil,
    Trash2,
    X,
} from "lucide-react";
import { useGetAllProperty } from "@/app/hooks/useProperty";

export default function PropertiesPage() {
    const [query, setQuery] = useState("");
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
    const { data: response, isLoading, isError, error } = useGetAllProperty();

    const properties = response?.data ?? [];

    const filtered = properties.filter(
        (p) =>
            p.propertyName.toLowerCase().includes(query.toLowerCase()) ||
            p.city.toLowerCase().includes(query.toLowerCase()) ||
            p.district.toLowerCase().includes(query.toLowerCase())
    );

    const activeCount = properties.filter((p) => p.propertyStatus === "ACTIVE").length;

    const statusStyles: Record<string, string> = {
        ACTIVE: "bg-emerald-50 text-emerald-600 border-emerald-200",
        PENDING: "bg-amber-50 text-amber-600 border-amber-200",
        INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
    };

    const handleDelete = () => {
        // TODO: wire up to your delete mutation, e.g. deletePropertyMutation.mutate(deleteTarget.id)
        setDeleteTarget(null);
    };

    return (
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">
                        Properties
                    </h1>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mt-1">
                        {properties.length} total &middot; {activeCount} active
                    </p>
                </div>

                <Link
                    href="/dashboard/landlord/properties/add"
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-all"
                >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    Add Property
                </Link>
            </div>

            {/* Search */}
            <div className="relative max-w-sm my-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name or location..."
                    className="w-full pl-9 pr-3 py-2.5 text-xs font-medium bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-xl placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
            </div>

            {/* Loading state */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Loader2 className="w-6 h-6 text-indigo-500 animate-spin mb-3" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        Loading properties...
                    </p>
                </div>
            )}

            {/* Error state */}
            {isError && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertTriangle className="w-10 h-10 text-rose-400 mb-3" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                        Failed to load properties
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">
                        {error instanceof Error ? error.message : "Please try again."}
                    </p>
                </div>
            )}

            {/* Empty state */}
            {!isLoading && !isError && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-3" />
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No properties found</p>
                    <p className="text-xs text-slate-400 dark:text-slate-600 mt-1">Try a different search term</p>
                </div>
            )}

            {/* List */}
            {!isLoading && !isError && filtered.length > 0 && (
                <div className="rounded-2xl border border-slate-200/60 dark:border-slate-850 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
                    {/* Column headers */}
                    <div className="hidden md:grid grid-cols-[minmax(0,2.5fr)_minmax(0,2fr)_100px_90px_140px] gap-4 px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Property
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Location
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Rooms
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                            Status
                        </span>
                        <span className="text-[11px] font-bold uppercase tracking-wide text-slate-400 text-right">
                            Actions
                        </span>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {filtered.map((property) => (
                            <div
                                key={property.id}
                                className="group grid grid-cols-1 md:grid-cols-[minmax(0,2.5fr)_minmax(0,2fr)_100px_90px_140px] gap-3 md:gap-4 px-5 py-4 items-center hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                            >
                                {/* Property (thumbnail + name) */}
                                <Link
                                    href={`/dashboard/landlord/properties/${property.id}`}
                                    className="flex items-center gap-3 min-w-0"
                                >
                                    <div className="h-11 w-11 shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-800">
                                        <img
                                            src={property.thumbnailUrl}
                                            alt={property.propertyName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 transition-colors">
                                            {property.propertyName}
                                        </p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                                            {property.country}
                                        </p>
                                    </div>
                                </Link>

                                {/* Location */}
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 min-w-0">
                                    <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                    <span className="truncate">
                                        {property.city}, {property.district}
                                    </span>
                                </div>

                                {/* Rooms */}
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    <DoorOpen className="w-3.5 h-3.5 text-slate-400" />
                                    {property.totalRooms}
                                </div>

                                {/* Status */}
                                <div>
                                    <span
                                        className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full border ${statusStyles[property.propertyStatus] ?? statusStyles.INACTIVE
                                            }`}
                                    >
                                        {property.propertyStatus.charAt(0) +
                                            property.propertyStatus.slice(1).toLowerCase()}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-start md:justify-end gap-1.5">
                                    <Link
                                        href={`/landlord/properties/${property.id}`}
                                        title="View"
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Link>
                                    <Link
                                        href={`/landlord/properties/${property.id}/edit`}
                                        title="Edit"
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        type="button"
                                        title="Delete"
                                        onClick={() =>
                                            setDeleteTarget({ id: property.id, name: property.propertyName })
                                        }
                                        className="h-8 w-8 inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Delete confirmation modal */}
            {deleteTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
                    <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-xl p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 shrink-0 flex items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                    <Trash2 className="h-4.5 w-4.5" />
                                </div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                                    Delete property
                                </h3>
                            </div>
                            <button
                                onClick={() => setDeleteTarget(null)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            Are you sure you want to delete{" "}
                            <span className="font-bold text-slate-700 dark:text-slate-200">
                                {deleteTarget.name}
                            </span>
                            ? This action cannot be undone.
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setDeleteTarget(null)}
                                className="h-10 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="h-10 rounded-lg bg-rose-600 hover:bg-rose-700 text-xs font-bold text-white transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}