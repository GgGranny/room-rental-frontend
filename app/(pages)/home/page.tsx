"use client";

import { useCheckProfileCompletion, useCurrentUser } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
    Search, SlidersHorizontal, Bell, Settings, Heart, Star,
    MapPin, Bed, Bath, Compass, Square, List, Map, Navigation, Plus, Minus,
    Waves,
    Wifi,
    Mountain,
    Car
} from "lucide-react";
import { filterIcons } from "@/app/utils/FilterIcons";
import Card from "@/app/components/ui/Card";
import Hero from "@/app/components/Hero";

// Mock Data matching image_55dc69.jpg exactly
const properties = [
    {
        id: 1,
        title: "The Glass Pavilion",
        location: "Aspen, Colorado",
        price: "$4,250",
        rating: "4.92",
        badge: "AVAILABLE",
        badgeColor: "bg-emerald-500",
        badgeTextColor: "text-emerald-700",
        badgeBgColor: "bg-emerald-50",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "3 Beds" }, { icon: Bath, text: "2 Baths" }]
    },
    {
        id: 2,
        title: "Concrete Sanctuary",
        location: "Berlin, Germany",
        price: "$2,800",
        rating: "4.85",
        badge: null,
        isFavoriteDefault: true,
        img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "1 Bed" }, { icon: Square, text: "1,200 sqft" }]
    },
    {
        id: 3,
        title: "Mid-Century Haven",
        location: "Palm Springs, CA",
        price: "$3,500",
        rating: "5.00",
        badge: "LIMITED",
        badgeColor: "bg-amber-500",
        badgeTextColor: "text-amber-700",
        badgeBgColor: "bg-amber-50",
        img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "2 Beds" }, { icon: Compass, text: "Patio" }]
    },
    {
        id: 4,
        title: "The Dune Retreat",
        location: "Joshua Tree, CA",
        price: "$5,900",
        rating: "4.97",
        badge: null,
        img: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Compass, text: "Private Pool" }, { icon: Compass, text: "20 Acres" }]
    }, {
        id: 5,
        title: "The Glass Pavilion",
        location: "Aspen, Colorado",
        price: "$4,250",
        rating: "4.92",
        badge: "AVAILABLE",
        badgeColor: "bg-emerald-500",
        badgeTextColor: "text-emerald-700",
        badgeBgColor: "bg-emerald-50",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "3 Beds" }, { icon: Bath, text: "2 Baths" }]
    },
    {
        id: 6,
        title: "Oceanfront Serenity Villa",
        location: "Malibu, California",
        price: "$6,800",
        rating: "4.97",
        badge: "AVAILABLE",
        badgeColor: "bg-emerald-500",
        badgeTextColor: "text-emerald-700",
        badgeBgColor: "bg-emerald-50",
        img: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "5 Beds" }, { icon: Bath, text: "4 Baths" }]
    },
    {
        id: 7,
        title: "Alpine Pine Retreat",
        location: "Whistler, British Columbia",
        price: "$3,100",
        rating: "4.85",
        badge: "BOOKED",
        badgeColor: "bg-red-500",
        badgeTextColor: "text-red-700",
        badgeBgColor: "bg-red-50",
        img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "4 Beds" }, { icon: Mountain, text: "Mountain View" }]
    },
    {
        id: 8,
        title: "Lakeside Horizon Cottage",
        location: "Lake Tahoe, Nevada",
        price: "$2,750",
        rating: "4.88",
        badge: "AVAILABLE",
        badgeColor: "bg-emerald-500",
        badgeTextColor: "text-emerald-700",
        badgeBgColor: "bg-emerald-50",
        img: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "2 Beds" }, { icon: Waves, text: "Lake Access" }]
    },
    {
        id: 9,
        title: "Manhattan Sky Loft",
        location: "New York City, New York",
        price: "$5,500",
        rating: "4.78",
        badge: "LIMITED",
        badgeColor: "bg-amber-500",
        badgeTextColor: "text-amber-700",
        badgeBgColor: "bg-amber-50",
        img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "2 Beds" }, { icon: Wifi, text: "High-Speed WiFi" }]
    },
    {
        id: 10,
        title: "Desert Bloom Estate",
        location: "Scottsdale, Arizona",
        price: "$3,900",
        rating: "4.90",
        badge: "AVAILABLE",
        badgeColor: "bg-emerald-500",
        badgeTextColor: "text-emerald-700",
        badgeBgColor: "bg-emerald-50",
        img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=600&q=80",
        details: [{ icon: Bed, text: "4 Beds" }, { icon: Car, text: "2-Car Garage" }]
    }
];

export default function Home() {

    const [activeCategory, setActiveCategory] = useState("Luxury");
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const [favorites, setFavorites] = useState<number[]>([2]); // Card 2 active by default

    const toggleFavorite = (id: number) => {
        setFavorites(prev => prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]);
    };
    const { isPending, isError, data, error } = useCheckProfileCompletion();
    const currentUser = useCurrentUser();
    const router = useRouter();

    useEffect(() => {
        const checkProfileCompletion = async () => {
            if (!data) return;
            const isProfileComplete = (data as any)?.data.isCompleted;
            if (!isProfileComplete) {
                router.push("/complete-profile");
            }
            const user: any = currentUser.data;
            console.log("Current user:", user);
            console.log("Profile completion status:", isProfileComplete);
            localStorage.setItem("userId", user?.data?.userId || "");
            localStorage.setItem("fname", user?.data?.fname || "");
            localStorage.setItem("lname", user?.data?.lname || "");
            localStorage.setItem("email", user?.data?.email || "");
        };
        checkProfileCompletion();
    }, [data, currentUser.data]);

    // if (isPending) return <div>Loading...</div>;
    // if (isError) return <div>Error: {error instanceof Error ? error.message : "An error occurred"}</div>;
    return (
        <div className="min-h-screen bg-slate-50/50 text-slate-800 antialiased font-sans pb-12 dark:bg-slate-900 mt-15">
            {/* HERO SECTION START */}
            <div className="max-w-full mx-auto px-6 mb-8">
                <Hero />
            </div>

            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                {/* Categories */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {filterIcons.map((cat) => (
                        <button
                            key={cat.name}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-full text-xs font-medium tracking-wide flex items-center gap-2 transition-all duration-200 ${activeCategory === cat.name
                                ? "bg-indigo-600 text-white shadow-md shadow-indigo-100 dark:bg-indigo-500 dark:text-white dark:shadow-indigo-950/30"
                                : "bg-white border border-slate-200/60 text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:border-slate-500 dark:hover:bg-slate-700"
                                }`}
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* View Switcher */}
                <div className="dark:bg-slate-800 bg-white border border-slate-200/80 p-1 rounded-xl flex items-center self-end sm:self-auto shadow-sm">
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${viewMode === "list" ? "bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"}`}
                    >
                        <List className="w-3.5 h-3.5" /> List
                    </button>
                    <button
                        onClick={() => setViewMode("map")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${viewMode === "map" ? "bg-slate-100 text-slate-800 dark:bg-slate-600 dark:text-white" : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"}`}
                    >
                        <Map className="w-3.5 h-3.5" /> Map
                    </button>
                </div>
            </div>

            {/* PROPERTY CARDS GRID */}
            <Card properties={properties} favorites={favorites} toggleFavorite={toggleFavorite} />

            {/* DISCOVER NEARBY MAP SUB-SECTION */}
            <div className="max-w-[1400px] mx-auto px-6">
                <div className="w-full bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-950/50 dark:to-indigo-900/30 border border-indigo-100/80 dark:border-indigo-800/80 rounded-3xl p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">

                    {/* Left Text Block */}
                    <div className="lg:col-span-4 space-y-4">
                        <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 tracking-widest uppercase block">
                            Discover Nearby
                        </span>
                        <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight leading-tight">
                            Explore Spaces <br />In Your Area
                        </h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-sm">
                            Find the perfect architectural gem within walking distance or a short drive from your current location.
                        </p>
                        <button className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-full flex items-center gap-2 shadow-md shadow-indigo-200 dark:shadow-indigo-900 transition-all hover:translate-y-[-1px]">
                            <Navigation className="w-3.5 h-3.5 fill-current" />
                            Open Live Map
                        </button>
                    </div>

                    {/* Right GIS Vector Simulated Map Frame */}
                    <div className="lg:col-span-8 relative rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-200 dark:bg-slate-800 aspect-[16/9] w-full overflow-hidden shadow-sm">

                        {/* Vector Base Mock */}
                        <div className="absolute inset-0 bg-[#b8c9db] dark:bg-[#1e2d3d] opacity-40 mix-blend-multiply dark:mix-blend-screen bg-[radial-gradient(#ffffff_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:16px_16px]"></div>

                        {/* Custom stylized layout blocks */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-slate-300/60 dark:bg-slate-700/60 relative">

                                {/* Simulated Grid Road Mapping Lines */}
                                <div className="absolute top-1/4 left-0 w-full h-1 bg-white/60 dark:bg-white/20 transform rotate-12"></div>
                                <div className="absolute top-2/3 left-0 w-full h-1 bg-white/60 dark:bg-white/20 transform -rotate-6"></div>
                                <div className="absolute left-1/3 top-0 w-1 h-full bg-white/60 dark:bg-white/20 transform rotate-45"></div>
                                <div className="absolute left-2/3 top-0 w-1 h-full bg-white/60 dark:bg-white/20 transform -rotate-12"></div>

                                {/* Absolute Location Pin Marker */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-10 h-10 bg-indigo-600 dark:bg-indigo-500 rounded-full border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg animate-pulse">
                                        <Compass className="w-4 h-4 text-white fill-current" />
                                    </div>
                                </div>

                                {/* Interactive Absolute Label Indicators */}
                                <div className="absolute top-1/3 right-1/4 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-md border border-slate-100 dark:border-slate-600 flex items-center gap-1">
                                    <span>$4.2k</span>
                                </div>

                                <div className="absolute bottom-1/4 left-1/3 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 shadow-md border border-slate-100 dark:border-slate-600 flex items-center gap-1">
                                    <span>$2.8k</span>
                                    <span className="text-indigo-600 dark:text-indigo-400">⚡</span>
                                </div>

                                {/* Map Floating Controls */}
                                <div className="absolute bottom-4 right-4 flex flex-col gap-1 shadow-sm">
                                    <button className="w-8 h-8 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-t-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <Plus className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                    <button className="w-8 h-8 bg-white dark:bg-slate-800 border-x border-b border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-b-lg flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                                        <Minus className="w-4 h-4 stroke-[2.5]" />
                                    </button>
                                </div>

                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* FIXED GLOBAL FAB FILTER CONTROL */}
            <button className="fixed bottom-6 right-6 w-12 h-12 bg-indigo-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center hover:bg-indigo-700 transition-all z-40 hover:scale-105 active:scale-95">
                <SlidersHorizontal className="w-5 h-5" />
            </button>

        </div>
    );
}