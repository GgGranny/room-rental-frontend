"use client";

import React, { useState } from "react";
import {
    Star,
    MapPin,
    User,
    CheckCircle2,
    Calendar,
    Users,
    ChevronDown,
    Compass,
    Waves,
    Activity,
    ChefHat,
    Layers,
    Moon,
    Sun,
    ShieldCheck,
    MessageSquare
} from "lucide-react";

export default function RoomDetailsPage() {
    const [darkMode, setDarkMode] = useState(false);
    const [checkIn, setCheckIn] = useState("2026-06-15");
    const [checkOut, setCheckOut] = useState("2026-06-19");
    const [guests, setGuests] = useState(2);

    // Structural pricing metrics
    const pricePerNight = 2450;
    const totalNights = 4;
    const cleaningFee = 150;
    const serviceFee = 425;
    const baseTotal = pricePerNight * totalNights;
    const overallTotal = baseTotal + cleaningFee + serviceFee;

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">

                {/* TOP FLOATING TOGGLE UTILITY BAR */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-between items-center">
                    <span className="text-sm font-bold tracking-tight text-indigo-600 dark:text-indigo-400">RoomEase Pro</span>
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm text-xs font-bold transition-all"
                    >
                        {darkMode ? (
                            <>
                                <Sun className="w-3.5 h-3.5 text-amber-500" /> Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="w-3.5 h-3.5 text-indigo-600" /> Dark Mode
                            </>
                        )}
                    </button>
                </div>

                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">

                    {/* IMAGE GRID ARCHITECTURE */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[320px] md:h-[480px] rounded-3xl overflow-hidden shadow-md">
                        {/* Main Prominent Feature Image */}
                        <div className="md:col-span-2 relative bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                                alt="The Glass Pavilion Exterior"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <span className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-[11px] font-bold px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 tracking-wide uppercase shadow-sm">
                                ★ Live Available
                            </span>
                        </div>

                        {/* Secondary Column Stack */}
                        <div className="hidden md:flex flex-col gap-3 md:col-span-1">
                            <div className="flex-1 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
                                    alt="Interior View"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="flex-1 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                                <img
                                    src="https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=600&q=80"
                                    alt="Kitchen Workspace"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>

                        {/* Rightmost Cap Image */}
                        <div className="hidden md:block md:col-span-1 bg-slate-200 dark:bg-slate-800 overflow-hidden group">
                            <img
                                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
                                alt="Ocean Pool Edge View"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    {/* TWO COLUMN MASTER LAYOUT CONTAINER */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT PROFILE & PROPERTY DETAIL MATRIX (2-COL SPAN) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Header Details */}
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                        The Glass Pavilion
                                    </h1>
                                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-lg text-xs font-bold">
                                        <Star className="w-3.5 h-3.5 fill-current" /> 4.92 Curated Rating
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                    <MapPin className="w-4 h-4 text-slate-400" /> Malibu Estates, CA
                                </div>
                            </div>

                            <hr className="border-slate-200 dark:border-slate-800/80" />

                            {/* Description Block */}
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                                    The Golden Hour Philosophy
                                </h3>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                                    Designed as a masterpiece in structural intensity, The Glass Pavilion utilizes a revolutionary exposed steel frame system that allows for unprecedented expanses of column-free living space. The residence was positioned to capture the changing coastal light, transforming the interiors into a living gallery of natural elements.
                                </p>
                            </div>

                            {/* Specifications Subgrids */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                                {/* Structural Breakdown */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Layers className="w-4 h-4 text-indigo-500" /> Structural Elements
                                    </h4>
                                    <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        <li className="flex items-center gap-2">✔ Floor-to-ceiling glass panel walls</li>
                                        <li className="flex items-center gap-2">✔ Solar-glass energy capture array</li>
                                        <li className="flex items-center gap-2">✔ Natural limestone platform base</li>
                                        <li className="flex items-center gap-2">✔ Matte-finish structural framework</li>
                                    </ul>
                                </div>

                                {/* Premium Amenities */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                        <Compass className="w-4 h-4 text-indigo-500" /> Premium Amenities
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                                        <div className="flex items-center gap-1.5"><Waves className="w-3.5 h-3.5 text-slate-400" /> Infinity Pool</div>
                                        <div className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-slate-400" /> Fitness Center</div>
                                        <div className="flex items-center gap-1.5"><ChefHat className="w-3.5 h-3.5 text-slate-400" /> Private Chef</div>
                                        <div className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Luxury Linens</div>
                                    </div>
                                </div>

                            </div>

                            {/* Geographic Context Placeholder Map */}
                            <div className="space-y-3">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Location Context</h4>
                                <div className="w-full h-44 bg-slate-200 dark:bg-slate-900 rounded-2xl overflow-hidden relative border border-slate-200 dark:border-slate-850 shadow-inner">
                                    {/* Mock styled topo pattern layer */}
                                    <div className="absolute inset-0 opacity-40 mix-blend-overlay bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                    <div className="absolute top-1/2 left-1/3 w-4 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full animate-ping"></div>
                                    <div className="absolute top-1/2 left-1/3 w-3.5 h-3.5 bg-indigo-600 dark:bg-indigo-500 rounded-full border-2 border-white dark:border-slate-900 shadow-md"></div>
                                    <span className="absolute bottom-3 left-3 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md">
                                        ⚲ Coastline Landmark Sector
                                    </span>
                                </div>
                            </div>

                            {/* Host Identity Subcard */}
                            <div className="bg-slate-100/60 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                        <User className="w-6 h-6 stroke-[2]" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block">Meet Your Host</span>
                                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Julian Thorne</h4>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">Lead Architect & Curator • 12 Managed Properties</p>
                                    </div>
                                </div>
                                <button className="w-full sm:w-auto px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all flex items-center justify-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5" /> Contact Host
                                </button>
                            </div>

                            {/* Core Quality Badge Banner */}
                            <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-5 text-white flex items-center justify-between gap-4 shadow-lg shadow-indigo-600/10">
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold tracking-tight">Architectural Verification Standards Approved</h4>
                                    <p className="text-xs text-indigo-100 font-medium max-w-xl">
                                        Every element complies layout-for-layout with RoomEase 100-point architectural specifications to balance structural integrity with aesthetic execution.
                                    </p>
                                </div>
                                <CheckCircle2 className="w-8 h-8 text-indigo-200 shrink-0 stroke-[1.5]" />
                            </div>

                        </div>

                        {/* RIGHT STICKY TRANSACTION/BOOKING BAR (1-COL SPAN) */}
                        <div className="lg:sticky lg:top-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 shadow-xl shadow-slate-100/50 dark:shadow-none space-y-6">

                            {/* Pricing Context Header */}
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white">${pricePerNight.toLocaleString()}</span>
                                    <span className="text-xs text-slate-400 font-bold ml-1">/ night</span>
                                </div>
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                    Verified Rate
                                </span>
                            </div>

                            {/* Schedule Form Control Stack */}
                            <div className="space-y-3.5">

                                {/* Date Controls */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl space-y-1">
                                        <label className="text-[9px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Check In
                                        </label>
                                        <input
                                            type="date"
                                            value={checkIn}
                                            onChange={(e) => setCheckIn(e.target.value)}
                                            className="bg-transparent text-xs font-bold w-full outline-none text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-2.5 rounded-xl space-y-1">
                                        <label className="text-[9px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                                            <Calendar className="w-3 h-3" /> Check Out
                                        </label>
                                        <input
                                            type="date"
                                            value={checkOut}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="bg-transparent text-xs font-bold w-full outline-none text-slate-800 dark:text-slate-200"
                                        />
                                    </div>
                                </div>

                                {/* Guest Allocations */}
                                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-3 rounded-xl flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <label className="text-[9px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1">
                                            <Users className="w-3 h-3" /> Guests Count
                                        </label>
                                        <span className="text-xs font-bold block">{guests} Active Guests</span>
                                    </div>
                                    <div className="flex gap-1.5">
                                        <button
                                            type="button"
                                            onClick={() => setGuests(Math.max(1, guests - 1))}
                                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black flex items-center justify-center shadow-sm"
                                        >
                                            -
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setGuests(guests + 1)}
                                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-black flex items-center justify-center shadow-sm"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Execution Request Trigger */}
                            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-xl text-xs font-bold tracking-wide transition-all shadow-md shadow-indigo-600/10">
                                Book This Space
                            </button>

                            <p className="text-[10px] text-slate-400 text-center font-medium">You won't be charged standard layout values yet</p>

                            {/* Accounting Summary Breakdown */}
                            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                                    <span>${pricePerNight.toLocaleString()} × {totalNights} nights</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">${baseTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                                    <span>Cleaning fee allowance</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">${cleaningFee}</span>
                                </div>
                                <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
                                    <span>RoomEase platform service fee</span>
                                    <span className="text-slate-800 dark:text-slate-200 font-bold">${serviceFee}</span>
                                </div>

                                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                                <div className="flex justify-between text-sm font-bold">
                                    <span className="text-slate-900 dark:text-white">Total Framework Cost</span>
                                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">${overallTotal.toLocaleString()}</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}