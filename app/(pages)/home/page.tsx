"use client";

import { useCheckProfileCompletion, useCurrentUser } from "@/app/hooks/useAuth";
import { useRecommendedRooms, useSearchRooms } from "@/app/hooks/useRoom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, Building2, Navigation } from "lucide-react";
import { filterIcons } from "@/app/utils/FilterIcons";
import { FILTERABLE_ROOM_TYPES } from "@/app/lib/roomTypes";
import Card from "@/components/myui/Card";
import Hero from "@/components/Hero";
import { RoomListItem, RoomSearchParams } from "@/app/services/roomService";

// Category chips map to the real search API. Room-type values come from the shared
// roomTypes source of truth (exact enum names, matched case-sensitively by the
// backend); budget/luxury are price ranges.
const categoryFilters: Record<string, RoomSearchParams> = {
    ...Object.fromEntries(
        FILTERABLE_ROOM_TYPES.map((option) => [option.value.toLowerCase(), { roomType: option.value }]),
    ),
    budget: { maxPrice: 10000 },
    luxury: { minPrice: 30000 },
};

export default function Home() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedQuery, setAppliedQuery] = useState<RoomSearchParams | null>(null);
    const [favorites, setFavorites] = useState<string[]>([]);

    const toggleFavorite = (id: string) => {
        setFavorites((prev) => (prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]));
    };

    const { data: profileData } = useCheckProfileCompletion();
    const currentUser = useCurrentUser();
    const router = useRouter();

    // Search is active whenever a term or a category filter is applied.
    const isSearching = appliedQuery !== null;
    const recommended = useRecommendedRooms();
    const search = useSearchRooms(appliedQuery ?? {}, isSearching);

    const activeQuery = isSearching ? search : recommended;
    const rooms: RoomListItem[] = useMemo(() => {
        const list = (activeQuery.data as RoomListItem[]) ?? [];
        return [...list].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }, [activeQuery.data]);

    useEffect(() => {
        if (!profileData) return;
        const isProfileComplete = (profileData as any)?.data?.isCompleted;
        if (!isProfileComplete) {
            router.push("/complete-profile");
            return;
        }
        const user: any = currentUser.data;
        if (user?.data) {
            localStorage.setItem("userId", user.data.userId || "");
            localStorage.setItem("fname", user.data.fname || "");
            localStorage.setItem("lname", user.data.lname || "");
            localStorage.setItem("email", user.data.email || "");
        }
    }, [profileData, currentUser.data, router]);

    const applySearch = () => {
        const query: RoomSearchParams = {};
        if (searchTerm.trim()) query.location = searchTerm.trim();
        if (activeCategory) Object.assign(query, categoryFilters[activeCategory] ?? {});
        setAppliedQuery(Object.keys(query).length ? query : null);
    };

    const handleCategory = (name: string) => {
        const next = activeCategory === name ? null : name;
        setActiveCategory(next);
        const query: RoomSearchParams = {};
        if (searchTerm.trim()) query.location = searchTerm.trim();
        if (next) Object.assign(query, categoryFilters[next] ?? {});
        setAppliedQuery(Object.keys(query).length ? query : null);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans pb-12 dark:bg-slate-900 mt-15">
            {/* HERO SECTION START */}
            <div className="max-w-full mx-auto px-6 mb-8">
                <Hero />
            </div>

            {/* SEARCH BAR */}
            <div className="max-w-[1400px] mx-auto px-6 mb-2">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-600 rounded-2xl p-2 shadow-sm">
                    <div className="flex-1 flex items-center gap-2 px-3">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && applySearch()}
                            placeholder="Search by location, city or district..."
                            className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none py-2"
                        />
                    </div>
                    <button
                        onClick={applySearch}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Search
                    </button>
                </div>
            </div>

            {/* FIND ROOMS NEAR YOU — opens the interactive nearby-rooms map */}
            <div className="max-w-[1400px] mx-auto px-6 mb-2">
                <Link
                    href="/nearby"
                    className="group flex items-center justify-between gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl px-5 py-4 shadow-sm hover:shadow-md transition-all"
                >
                    <span className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                            <Navigation className="w-4.5 h-4.5" />
                        </span>
                        <span>
                            <span className="block text-sm font-extrabold tracking-tight">Find Rooms Near You</span>
                            <span className="block text-xs text-white/80">Explore available rooms around your location on a live map.</span>
                        </span>
                    </span>
                    <span className="text-xs font-bold bg-white/15 group-hover:bg-white/25 px-3 py-1.5 rounded-lg transition-colors shrink-0">
                        Open map →
                    </span>
                </Link>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {filterIcons.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => handleCategory(cat.name)}
                            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 capitalize transition-all duration-200 ${activeCategory === cat.name
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:bg-indigo-500 dark:text-white dark:shadow-indigo-950/30"
                                : "bg-white border border-slate-200/60 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* PROPERTY CARDS GRID */}
            {activeQuery.isPending ? (
                <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700 overflow-hidden animate-pulse">
                            <div className="aspect-[4/3] w-full bg-slate-200 dark:bg-slate-700" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : activeQuery.isError ? (
                <div className="max-w-[1400px] mx-auto px-6 mb-8">
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Could not load rooms. Please try again.</p>
                    </div>
                </div>
            ) : rooms.length === 0 ? (
                <div className="max-w-[1400px] mx-auto px-6 mb-8">
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                        <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">No rooms found</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            {isSearching ? "Try a different search or category." : "Check back soon for new listings."}
                        </p>
                    </div>
                </div>
            ) : (
                <Card rooms={rooms} favorites={favorites} toggleFavorite={toggleFavorite} />
            )}

            {/* FIXED GLOBAL FAB FILTER CONTROL */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all z-40 hover:scale-105 active:scale-95">
                <SlidersHorizontal className="w-5 h-5" />
            </button>
        </div>
    );
}
