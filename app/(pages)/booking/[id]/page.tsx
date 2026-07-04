"use client";

import React, { useState } from "react";
import {
    Calendar,
    Clock,
    Download,
    ShieldCheck,
    MapPin,
    MessageSquare,
    Compass,
    Layers,
    Sparkles,
    ArrowUpRight,
    Sun,
    Moon,
    ChevronRight,
    FileText,
    UserCheck
} from "lucide-react";

export default function BookedRoomDetails() {
    const [darkMode, setDarkMode] = useState(true); // Defaulted to true to match image style initial look

    // Exact data mapping matched to the "The Glass Pavilion" design itinerary spec
    const checkInDate = "Oct 14, 2026";
    const checkOutDate = "Oct 21, 2026";
    const ratePerNight = 1900;
    const totalNights = 7;
    const curationFee = 450;
    const maintenanceTax = 530;
    const totalPaid = (ratePerNight * totalNights) + curationFee + maintenanceTax; // $14,280.00

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 pb-20 mt-12">
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

                    {/* MAIN HERO ITINERARY BANNER */}
                    <section className="relative h-[380px] w-full rounded-3xl overflow-hidden shadow-lg border border-slate-200/40 dark:border-slate-800">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                            alt="The Glass Pavilion"
                            className="w-full h-full object-cover"
                        />
                        {/* Dark Scrim Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/40" />

                        {/* Top Badge Overlay Container */}
                        <div className="absolute top-6 left-6 flex items-center gap-2">
                            <span className="px-3 py-1 bg-emerald-500/90 text-white rounded-lg text-[10px] font-black uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Confirmed
                            </span>
                            <span className="text-[10px] text-slate-300 font-bold tracking-wide drop-shadow-sm">REF: RP-9302A5</span>
                        </div>

                        {/* Bottom Content Alignment */}
                        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div className="space-y-1.5">
                                <span className="text-[10px] uppercase font-black tracking-widest text-indigo-400 block">DURATION NO. 07</span>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white">The Glass Pavilion</h1>
                                <p className="text-xs text-slate-300 font-medium max-w-xl">
                                    A dialogue between transparency and the rugged coastline of Big Sur.
                                </p>
                            </div>

                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all flex items-center gap-2 self-start md:self-auto shadow-lg shadow-indigo-600/20">
                                <Download className="w-4 h-4" /> Download Itinerary
                            </button>
                        </div>
                    </section>

                    {/* THREE-CARD TRIP MATRIX BANNER */}
                    <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Check-In</span>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">{checkInDate}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">After 3:00 PM PST</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-1">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Check-Out</span>
                            <h3 className="text-base font-black text-slate-900 dark:text-white">{checkOutDate}</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Before 11:00 AM PST</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-950/40 p-5 rounded-2xl shadow-sm space-y-1 ring-1 ring-indigo-500/5">
                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Total Investment</span>
                            <h3 className="text-base font-black text-indigo-600 dark:text-indigo-400">${totalPaid.toLocaleString()}.00</h3>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded">
                                Fully Instated
                            </span>
                        </div>

                    </section>

                    {/* MAIN 2-COLUMN DETAILS SPLIT WRAPPER */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* LEFT SIDE BLOCK Workspace (8 Columns) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* ARCHITECTURAL DEEP-DIVE MODULE */}
                            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-6 rounded-2xl space-y-4 shadow-sm">
                                <h2 className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Layers className="w-4 h-4" /> Architectural Deep-Dive
                                </h2>

                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed flex-1">
                                        Designed by the renowned firm <strong className="text-slate-900 dark:text-white">Vanguard Structures</strong>, the Glass Pavilion is a masterclass in structural minimalism and material integration. The design philosophy centers on "The Dissolving Boundary," where structural steel is minimized to allow for expansive 12-foot high glass panels that erase the line between interior comfort and the wild coastal environment.
                                        <br /><br />
                                        Materials were sourced specifically to withstand the saline air, using marine-grade stainless steel and reclaimed cedar that will patina to a silver-grey over time, matching the surrounding rock formations.
                                    </p>

                                    {/* Embedded Context Picture Frame Asset */}
                                    <div className="w-full md:w-52 h-32 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 dark:border-slate-800">
                                        <img
                                            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=250&q=80"
                                            alt="Deck view Detail"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* FEATURES MATRIX ACCORDION GRID */}
                            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                {/* Structural Elements Card Block */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Compass className="w-3.5 h-3.5 text-indigo-500" /> Structural Elements
                                    </h4>
                                    <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Cantilevered Infinity Deck
                                        </li>
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Floor-to-Ceiling Performance Glass
                                        </li>
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Brushed Concrete Hearth
                                        </li>
                                    </ul>
                                </div>

                                {/* Premium Amenities Card Block */}
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl space-y-3 shadow-sm">
                                    <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                        <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Premium Amenities
                                    </h4>
                                    <ul className="space-y-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Saltwater Zero-Edge Pool
                                        </li>
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Temperature-Controlled Cellar
                                        </li>
                                        <li className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900">
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500" /> Savant Home Automation
                                        </li>
                                    </ul>
                                </div>

                            </section>

                            {/* LOCATION & ACCESS ROUTING MAP FRAME */}
                            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl space-y-3 shadow-sm">
                                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-indigo-500" /> Location & Access
                                </h4>

                                {/* Visual architectural graphic block mock */}
                                <div className="h-44 w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-70" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative flex flex-col items-center">
                                            <div className="w-10 h-10 bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30 rounded-full flex items-center justify-center animate-bounce">
                                                <MapPin className="w-5 h-5 fill-current" />
                                            </div>
                                            <span className="text-[10px] font-bold mt-2 text-slate-400 dark:text-slate-500">Highway 1, Big Sur, California</span>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* ACCESS MANAGEMENT INSTRUCTIONS AND SITE MANAGER FOOTER MODULES */}
                            <section className="grid grid-cols-1 md:grid-cols-12 gap-4">

                                {/* Check-In Guidelines */}
                                <div className="md:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl space-y-2 shadow-sm">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Check-In Instructions</span>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        The main gate is accessed via a private drive off Highway 1. Your unique access code is <strong className="text-indigo-600 dark:text-indigo-400 font-mono tracking-wider px-1 bg-indigo-50 dark:bg-indigo-950/40 rounded">#4285</strong>. The code will activate exactly at 3:00 PM on your arrival date.
                                    </p>
                                    <a href="#" className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline pt-1">
                                        Get Directions <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                </div>

                                {/* Site Manager Status */}
                                <div className="md:col-span-5 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/60 dark:border-indigo-900/40 p-5 rounded-2xl flex items-start gap-3 shadow-sm">
                                    <UserCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Site Manager</span>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-normal">
                                            Available 24/7 for context-level inquiries regarding smart system structures or site logistics.
                                        </p>
                                    </div>
                                </div>

                            </section>

                        </div>

                        {/* RIGHT SIDE WORKSPACE PANELS (4 Columns) */}
                        <div className="lg:col-span-4 space-y-4">

                            {/* FINANCIAL INVOICE SUMMARY PANEL */}
                            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Financial Summary</h3>
                                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" /> Settled
                                    </span>
                                </div>

                                <div className="space-y-2.5 text-xs font-semibold">
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>${ratePerNight.toLocaleString()}.00 × {totalNights} nights</span>
                                        <span className="text-slate-900 dark:text-white font-bold">${(ratePerNight * totalNights).toLocaleString()}.00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Architectural curation fee</span>
                                        <span className="text-slate-900 dark:text-white font-bold">${curationFee}.00</span>
                                    </div>
                                    <div className="flex justify-between text-slate-500 dark:text-slate-400">
                                        <span>Sustainable maintenance tax</span>
                                        <span className="text-slate-900 dark:text-white font-bold">${maintenanceTax}.00</span>
                                    </div>

                                    <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />

                                    <div className="flex justify-between items-center pt-1">
                                        <div>
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Total Paid</span>
                                            <span className="text-sm font-black text-slate-900 dark:text-white">${totalPaid.toLocaleString()}.00</span>
                                        </div>
                                        <button className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-950 rounded-lg flex items-center gap-1 transition-all">
                                            <FileText className="w-3 h-3" /> Receipt
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* MEET YOUR HOST PROFILE PANEL */}
                            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Meet Your Host</span>

                                <div className="flex gap-3 items-center">
                                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700">
                                        <img
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                            alt="Julian Thorne"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-black text-slate-900 dark:text-white">Julian Thorne</h4>
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 block">Senior Curator</span>
                                    </div>
                                </div>

                                <blockquote className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic border-l-2 border-indigo-500/40 pl-3 leading-relaxed">
                                    "My mission is to connect discerning travelers with spaces that challenge their perception of living, using structural design language as an immersive narrative medium."
                                </blockquote>

                                <button className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs py-2 px-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                                    <MessageSquare className="w-3.5 h-3.5" /> Message Host
                                </button>
                            </section>

                            {/* CURATOR'S PICKS NEIGHBORHOOD INSIGHTS */}
                            <section className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-3">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Curator's Picks</span>

                                <div className="space-y-3">
                                    {[
                                        {
                                            title: "The Henry Miller Library",
                                            tag: "Culture",
                                            img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=120&q=80"
                                        },
                                        {
                                            title: "Nepenthe Terrace",
                                            tag: "Dining",
                                            img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=120&q=80"
                                        }
                                    ].map((pick, index) => (
                                        <div key={index} className="flex gap-3 items-center bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-900 group cursor-pointer hover:border-slate-200 dark:hover:border-slate-800 transition-all">
                                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg overflow-hidden shrink-0">
                                                <img src={pick.img} alt={pick.title} className="w-full h-full object-cover group-hover:scale-105 transition-all" />
                                            </div>
                                            <div className="space-y-0.5">
                                                <span className="text-[9px] uppercase font-bold text-indigo-500 dark:text-indigo-400 tracking-wider block">{pick.tag}</span>
                                                <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{pick.title}</h5>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                        </div>

                    </div>

                </main>
            </div>
        </div>
    );
}