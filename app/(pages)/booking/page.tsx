"use client";

import React, { useState } from "react";
import {
    Calendar,
    Clock,
    Users,
    MapPin,
    Search,
    SlidersHorizontal,
    Moon,
    Sun,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    Video,
    Layers,
    ArrowUpRight
} from "lucide-react";

// Mock data array simulating booked/scheduled spaces across the platform
const initialBookings = [
    {
        id: "b1",
        roomName: "The Glass Pavilion",
        type: "Executive Boardroom",
        location: "Malibu Estates, Floor 2",
        meetingTitle: "Q3 Architectural Design Review",
        host: "Julian Thorne",
        hostAvatar: "JT",
        startTime: "10:00 AM",
        endTime: "11:30 AM",
        duration: "1.5 hrs",
        status: "active", // active | upcoming | completed
        attendees: 8,
        hasVideoLink: true,
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: "b2",
        roomName: "Horizon Suite",
        type: "Conference Hall B",
        location: "Main Sector, Ground Floor",
        meetingTitle: "EV Skate Chassis Assembly Alignment",
        host: "Ram Rai",
        hostAvatar: "RR",
        startTime: "01:00 PM",
        endTime: "02:30 PM",
        duration: "1.5 hrs",
        status: "upcoming",
        attendees: 14,
        hasVideoLink: true,
        image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: "b3",
        roomName: "Timber & Clay Studio",
        type: "Creative Workshop Lab",
        location: "North Annex, Room 104",
        meetingTitle: "Skyscraper Facade Material Selection",
        host: "Jane Doe",
        hostAvatar: "JD",
        startTime: "03:30 PM",
        endTime: "05:00 PM",
        duration: "1.5 hrs",
        status: "upcoming",
        attendees: 5,
        hasVideoLink: false,
        image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=300&q=80"
    },
    {
        id: "b4",
        roomName: "Eco-Pod 04",
        type: "Focus Room",
        location: "South Wing, Huddle Zone",
        meetingTitle: "Escrow Contract Compliance Check",
        host: "Sarah Jenkins",
        hostAvatar: "SJ",
        startTime: "08:30 AM",
        endTime: "09:30 AM",
        duration: "1.0 hr",
        status: "completed",
        attendees: 2,
        hasVideoLink: false,
        image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=300&q=80"
    }
];

export default function ScheduledRoomsDashboard() {
    const [darkMode, setDarkMode] = useState(false);
    const [activeFilter, setActiveFilter] = useState("all"); // all | active | upcoming | completed
    const [searchQuery, setSearchQuery] = useState("");

    // Filtering Logic Matrix
    const filteredBookings = initialBookings.filter(booking => {
        const matchesTab = activeFilter === "all" || booking.status === activeFilter;
        const matchesSearch = booking.roomName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.meetingTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
            booking.host.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    return (
        <div className={darkMode ? "dark" : ""}>
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300 pb-16">

                {/* GLOBAL NAVIGATION HEADER */}
                <header className="border-b border-slate-200/80 dark:border-slate-900 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black tracking-tight text-indigo-600 dark:text-indigo-400 uppercase">
                                RoomEase Pro
                            </span>
                            <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-700" />
                            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Master Schedule Engine</span>
                        </div>

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
                </header>

                {/* MAIN LAYOUT WRAPPER */}
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">

                    {/* HEADER TITLE SECTION & SUMMARY COUNTS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">Scheduled Spaces Overview</h1>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time room occupancy allocations and meeting operational statuses.</p>
                        </div>

                        {/* Live Counter Badges */}
                        <div className="flex gap-2 text-xs font-bold">
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-slate-500 dark:text-slate-400">Active Now:</span>
                                <span className="text-slate-900 dark:text-white">1 Room</span>
                            </div>
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-3 py-2 rounded-xl flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                                <span className="text-slate-500 dark:text-slate-400">Upcoming Today:</span>
                                <span className="text-slate-900 dark:text-white">2 Rooms</span>
                            </div>
                        </div>
                    </div>

                    {/* FILTERING CONTROL UTILITY ROW */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Filter Segment Tabs */}
                        <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl w-full md:w-auto">
                            {[
                                { id: "all", label: "All Bookings" },
                                { id: "active", label: "Live Active" },
                                { id: "upcoming", label: "Upcoming" },
                                { id: "completed", label: "Completed" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveFilter(tab.id)}
                                    className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeFilter === tab.id
                                            ? "bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Live Search Filter Inputs */}
                        <div className="flex items-center gap-3 w-full md:w-96">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search rooms, meeting titles, or hosts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500"
                                />
                                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                            </div>
                            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shrink-0">
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                            </button>
                        </div>

                    </div>

                    {/* SCHEDULED SCHEDULE LIST / GRID ARCHITECTURE */}
                    <div className="space-y-4">
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => (
                                <div
                                    key={booking.id}
                                    className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-850 rounded-2xl p-5 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                                >

                                    {/* COL 1: SPACE SNAPSHOT IDENTIFIER (3 COLS SPAN) */}
                                    <div className="lg:col-span-3 flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                            <img src={booking.image} alt={booking.roomName} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">{booking.type}</span>
                                            <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{booking.roomName}</h3>
                                            <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                                <MapPin className="w-3 h-3 text-slate-400" /> {booking.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* COL 2: MEETING META DESCRIPTION DATA (4 COLS SPAN) */}
                                    <div className="lg:col-span-4 space-y-1">
                                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">Scheduled Content</span>
                                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">{booking.meetingTitle}</h4>

                                        {/* Host Profile Avatar Component */}
                                        <div className="flex items-center gap-2 pt-1">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[9px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-mono">
                                                {booking.hostAvatar}
                                            </div>
                                            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Host: <strong className="text-slate-700 dark:text-slate-300">{booking.host}</strong></span>
                                        </div>
                                    </div>

                                    {/* COL 3: TIME SLOT PARAMETERS ALLOCATION (2 COLS SPAN) */}
                                    <div className="lg:col-span-2 space-y-1">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Time Block
                                        </span>
                                        <div className="text-xs font-black text-slate-800 dark:text-slate-200">
                                            {booking.startTime} – {booking.endTime}
                                        </div>
                                        <span className="text-[10px] font-semibold text-slate-400 block">{booking.duration} Allocated</span>
                                    </div>

                                    {/* COL 4: STATUS / ATTENDEE BADGES & UTILITIES (3 COLS SPAN) */}
                                    <div className="lg:col-span-3 flex items-center justify-between lg:justify-end gap-6">

                                        {/* Occupancy Attendee Metric */}
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                                            <Users className="w-3.5 h-3.5 text-slate-400" /> {booking.attendees} Attending
                                        </div>

                                        {/* Status Badge Array */}
                                        <div className="flex items-center gap-2">
                                            {booking.status === "active" && (
                                                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Live Active
                                                </span>
                                            )}
                                            {booking.status === "upcoming" && (
                                                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                                                    Upcoming
                                                </span>
                                            )}
                                            {booking.status === "completed" && (
                                                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                                    Completed
                                                </span>
                                            )}

                                            {/* Video Remote Indicator */}
                                            {booking.hasVideoLink && (
                                                <div className="w-7 h-7 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-indigo-500 rounded-lg flex items-center justify-center cursor-pointer shadow-sm">
                                                    <Video className="w-3.5 h-3.5" />
                                                </div>
                                            )}

                                            {/* Administrative More Options Trigger */}
                                            <button className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>

                                    </div>

                                </div>
                            ))
                        ) : (
                            /* EMPTY MATRIX PLACEHOLDER STATE */
                            <div className="text-center bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-3xl p-12 max-w-md mx-auto my-6 shadow-sm">
                                <Layers className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                                <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Matching Bookings Found</h4>
                                <p className="text-xs text-slate-400 font-medium mt-1">Refine your active search filters or query strings to reveal matching booked parameters.</p>
                            </div>
                        )}
                    </div>

                    {/* BACKGROUND SYSTEM INTEGRATION ASSURANCE BANNER */}
                    <div className="bg-indigo-600 dark:bg-indigo-700 rounded-2xl p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-indigo-600/10">
                        <div className="space-y-0.5">
                            <h4 className="text-sm font-bold tracking-tight flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-indigo-200" /> Space Utilization Metrics Sync Complete
                            </h4>
                            <p className="text-xs text-indigo-100 font-medium max-w-2xl">
                                This schedule aligns layout data arrays instantly with Habitat Pro infrastructure across internal scheduling modules and external landlord asset ledgers.
                            </p>
                        </div>
                        <button className="bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-all shrink-0 flex items-center gap-1">
                            Export Grid Log <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>

                </main>
            </div>
        </div>
    );
}