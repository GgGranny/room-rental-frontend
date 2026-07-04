// Location: src/app/(admin)/admin/dashboard/page.tsx
"use client";

import React from "react";
import {
    LayoutDashboard,
    Building2,
    Calendar,
    BarChart3,
    MessageSquare,
    Settings,
    Plus,
    Search,
    Bell,
    HelpCircle,
    TrendingUp,
    MoreVertical,
    ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";


export default function LandlordDashboard() {
    const upcomingStays = [
        {
            id: 1,
            title: "The Glass Pavilion",
            guest: "Julianna Vance",
            dates: "Oct 12 — Oct 18",
            status: "Confirmed",
            statusStyle: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400",
            image: "https://images.unsplash.com/photo-1508333706533-1ab43ecb1606?auto=format&fit=crop&w=120&q=80"
        },
        {
            id: 2,
            title: "Concrete Sanctuary",
            guest: "Marcus Thorne",
            dates: "Oct 15 — Oct 22",
            status: "Checked In",
            statusStyle: "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
            image: "https://images.unsplash.com/photo-1549144511-f099e773c147?auto=format&fit=crop&w=120&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-slate-100">
            {/* ================= MAIN INTERFACE WRAPPER PANELS ================= */}
            <div className="flex-1  flex flex-col min-w-0">

                {/* TOP COMPONENT INTERACTIVE NAVIGATION HEADER */}
                <header className="h-16 border-b border-slate-200/60 bg-white dark:border-slate-900 dark:bg-slate-950 px-6 flex items-center justify-between sticky top-0 z-30">
                    {/* Search Inputs Frame */}
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search portfolio, bookings, or guests..."
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                    </div>

                    {/* User Identity Utility Tray */}
                    <div className="flex items-center gap-4 shrink-0">
                        <button className="p-2 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 relative transition-all">
                            <Bell className="w-4 h-4" />
                            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                        </button>
                        <button className="p-2 rounded-xl border border-slate-150 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-all">
                            <HelpCircle className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <img
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                                alt="Account Holder Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </header>

                {/* CORE WORKSPACE INNER CONTENT HUB */}
                <main className="p-6 max-w-[1400px] w-full mx-auto space-y-6">

                    {/* WELCOME SHEET STRIP SECTION */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold tracking-wider text-indigo-600 dark:text-indigo-400 uppercase">Portfolio Dashboard</span>
                            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Welcome back, Adrian</h1>
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <button className="px-3.5 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800 transition-all bg-white dark:bg-slate-950">
                                View Reports
                            </button>
                            <button className="px-3.5 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100/60 rounded-xl transition-all">
                                Message Guests
                            </button>
                        </div>
                    </div>

                    {/* PRIMARY PORTFOLIO MACRO ANALYTICAL METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Metric Cell 1: Gross Monthly Revenue */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Total Monthly Revenue</span>
                            <h2 className="text-2xl font-black font-sans tracking-tight text-indigo-600 dark:text-white">$42,850.00</h2>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> 12.5% increase from last month
                            </span>
                        </div>

                        {/* Metric Cell 2: System Rental Occupancy Capacity */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-3">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Avg. Occupancy</span>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">94%</h2>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-600 dark:bg-emerald-500 h-full w-[94%] rounded-full" />
                            </div>
                        </div>

                        {/* Metric Cell 3: Calculated Portfolio Value */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Portfolio Value</span>
                            <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">$12.4M</h2>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold block">8 Active Listings</span>
                        </div>
                    </div>

                    {/* DUAL WORKSPACE LAYOUT ROW SEGMENT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                        {/* LEFT-SIDE PRIMARY BLOCK VIEWPORT (8 COLUMNS) */}
                        <div className="lg:col-span-8 space-y-6">

                            {/* Chart Base Placeholder Canvas Panel */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Revenue Trends</h3>
                                    <button className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 p-1.5 px-2.5 rounded-lg">
                                        Last 6 Months <ChevronDown className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Visual Chart Structural Grid Frame */}
                                <div className="h-44 flex items-end justify-between px-2 pt-6 border-b border-slate-100 dark:border-slate-800/60 text-[10px] font-bold text-slate-400">
                                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => (
                                        <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                                            {/* Placeholder chart curves bars */}
                                            <div className={`w-8 bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-500/30 rounded-t-md transition-all ${month === "Apr" ? "h-28 bg-indigo-50 dark:bg-indigo-950/40 border-t-2 border-indigo-600" : "h-20"}`} />
                                            <span className={`pb-2 ${month === "Apr" ? "text-indigo-600 font-extrabold" : ""}`}>{month}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Live Active Reservation Schedules Ledger */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Active & Upcoming Stays</h3>
                                    <a href="#" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline">View All Bookings</a>
                                </div>

                                <div className="space-y-3">
                                    {upcomingStays.map((stay) => (
                                        <div key={stay.id} className="p-3 border border-slate-150 dark:border-slate-850/80 bg-white dark:bg-slate-950 rounded-xl flex items-center justify-between gap-4 hover:border-slate-200 transition-all">
                                            <div className="flex items-center gap-3.5 min-w-0">
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                    <img src={stay.image} alt={stay.title} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 space-y-0.5">
                                                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate tracking-tight">{stay.title}</h4>
                                                    <p className="text-[11px] text-slate-400 font-medium">Guest: {stay.guest}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold font-mono hidden sm:block">{stay.dates}</span>
                                                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${stay.statusStyle}`}>
                                                    {stay.status}
                                                </span>
                                                <button className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* RIGHT-SIDE WIDGET META PLATFORM RAIL (4 COLUMNS) */}
                        <div className="lg:col-span-4 space-y-6">

                            {/* Asset Management Distribution Widget Card */}
                            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Property Status</h3>

                                <div className="space-y-3.5">
                                    {[
                                        { label: "Active Listings", count: 8, color: "bg-emerald-500" },
                                        { label: "Maintenance", count: 2, color: "bg-amber-600" },
                                        { label: "Vacant", count: 0, color: "bg-slate-300 dark:bg-slate-700" }
                                    ].map((row, idx) => (
                                        <div key={idx} className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                                            <div className="flex items-center gap-2.5 font-semibold">
                                                <span className={`w-2 h-2 rounded-full ${row.color}`} />
                                                {row.label}
                                            </div>
                                            <span className="font-mono text-slate-900 dark:text-white font-black">{row.count}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold py-2.5 px-4 rounded-xl transition-all text-center mt-2">
                                    Manage Inventory
                                </button>
                            </div>

                            {/* Contextual Market Insights Marketing Promo Block Card */}
                            <div className="rounded-2xl shadow-sm overflow-hidden border border-slate-200/40 dark:border-slate-900 relative h-64 group bg-slate-900">
                                {/* Background Banner Graphic Frame */}
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80"
                                    alt="Modern architectural interior"
                                    className="w-full h-full object-cover absolute inset-0 opacity-40 group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />

                                {/* Text Content Absolute Layer Overlays */}
                                <div className="absolute inset-0 p-5 flex flex-col justify-end space-y-2 text-white">
                                    <span className="text-[9px] font-black tracking-widest text-indigo-400 uppercase">Market Insights</span>
                                    <h4 className="text-sm font-black tracking-tight leading-snug">
                                        Why Curated Design Increases Booking Rates by 34%
                                    </h4>
                                    <p className="text-[10px] text-slate-300 font-medium leading-normal">
                                        Read the latest report from our architectural consultants.
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </main>
            </div>

        </div>
    );
}