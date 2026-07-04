"use client";

import React, { useState } from "react";
import {
    LayoutDashboard,
    Calendar,
    Layers,
    BarChart3,
    Settings,
    HelpCircle,
    ShieldAlert,
    User,
    Shield,
    Bell,
    Sliders,
    X,
    Plus,
    Sun,
    Moon,
    Check
} from "lucide-react";

export default function ProfessionalSettings() {
    // Navigation & Interactive States
    const [activeTab, setActiveTab] = useState("Profile");
    const [interests, setInterests] = useState(["Minimalism", "Brutalism", "Biophilic Design"]);
    const [twoFactor, setTwoFactor] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Notification states
    const [notifications, setNotifications] = useState({
        bookingEmail: true,
        bookingPush: true,
        messagesEmail: true,
        messagesPush: false,
        updatesEmail: false,
        updatesPush: true,
    });

    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const removeInterest = (indexToRemove: number) => {
        setInterests(interests.filter((_, index) => index !== indexToRemove));
    };

    return (
        <div className="min-h-screen bg-[#090a0f] text-slate-100 flex font-sans selection:bg-indigo-500/30">

            {/* 1. LEFT MAIN APPLICATION SIDEBAR */}
            <aside className="w-64 bg-[#0d0e12] border-r border-slate-900 flex flex-col justify-between shrink-0 hidden md:flex">
                <div className="p-6 space-y-8">
                    {/* Brand Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                            <Layers className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm tracking-tight text-white leading-none">Habitat Pro</h2>
                            <span className="text-[11px] text-slate-500 font-medium">Professional Suite</span>
                        </div>
                    </div>

                    {/* Nav Links */}
                    <nav className="space-y-1.5">
                        {[
                            { name: "Dashboard", icon: LayoutDashboard },
                            { name: "Bookings", icon: Calendar },
                            { name: "Spaces", icon: Layers },
                            { name: "Analytics", icon: BarChart3 },
                            { name: "Settings", icon: Settings, active: true },
                        ].map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.name}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${item.active
                                        ? "bg-[#161820] text-indigo-400 border border-indigo-500/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 stroke-[2]" />
                                    {item.name}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Footer Support/Privacy Stack */}
                <div className="p-4 border-t border-slate-900 space-y-1">
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
                        <HelpCircle className="w-4 h-4" /> Support
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors">
                        <ShieldAlert className="w-4 h-4" /> Privacy
                    </button>
                </div>
            </aside>

            {/* 2. MAIN WORKSPACE CONTAINER */}
            <main className="flex-1 min-w-0 overflow-y-auto pb-28">
                <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">

                    {/* Header Description Block */}
                    <div className="space-y-1.5">
                        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Professional Settings</h1>
                        <p className="text-xs md:text-sm text-slate-400 font-medium">
                            Manage your account identity, security, and notification preferences.
                        </p>
                    </div>

                    {/* TWO COLUMN SUB-PANEL */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                        {/* Left Setting Tab Pillar Navigation */}
                        <nav className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                            {[
                                { name: "Profile", icon: User },
                                { name: "Security", icon: Shield },
                                { name: "Notifications", icon: Bell },
                                { name: "Preferences", icon: Sliders },
                            ].map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.name;
                                return (
                                    <button
                                        key={tab.name}
                                        onClick={() => setActiveTab(tab.name)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${isActive
                                            ? "bg-[#141620] text-indigo-300 border-indigo-500/30"
                                            : "bg-[#111317] text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-800"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.name}
                                    </button>
                                );
                            })}
                        </nav>

                        {/* Right Configuration Card Modules */}
                        <div className="lg:col-span-9 space-y-6">

                            {/* CARD 1: PROFESSIONAL PROFILE */}
                            <section className="bg-[#111317] border border-slate-900 rounded-2xl p-6 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-white">Professional Profile</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">How your information appears to clients and partners.</p>
                                </div>

                                {/* Avatar Row */}
                                <div className="flex items-center gap-4 pt-2">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-800 bg-slate-800">
                                        <img
                                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                            alt="Julian Thorne Profile Avatar"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <button className="px-3 py-1.5 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-bold transition-all">
                                            Change Photo
                                        </button>
                                        <p className="text-[10px] text-slate-500 font-medium">Recommended size: 400x400px. JPG or PNG.</p>
                                    </div>
                                </div>

                                {/* Grid Inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Julian Thorne"
                                            className="w-full bg-[#16181f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Professional Title</label>
                                        <input
                                            type="text"
                                            defaultValue="Senior Design Curator"
                                            className="w-full bg-[#16181f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 font-medium focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                                        />
                                    </div>
                                </div>

                                {/* Bio Field */}
                                <div className="space-y-2">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bio</label>
                                    <textarea
                                        rows={3}
                                        defaultValue="Passionate about minimalist structures and tonal layering in urban environments. 12+ years of experience in curating high-end residential spaces with a focus on sustainable materials."
                                        className="w-full bg-[#16181f] border border-slate-800 rounded-xl p-4 text-xs text-slate-300 font-medium leading-relaxed resize-none focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20"
                                    />
                                </div>

                                {/* Architectural Interest Tag Array Layout */}
                                <div className="space-y-2.5">
                                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Architectural Interests</label>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {interests.map((interest, idx) => (
                                            <span key={interest} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#16181f] border border-slate-800 text-slate-300 text-xs font-semibold rounded-full">
                                                {interest}
                                                <button type="button" onClick={() => removeInterest(idx)} className="text-slate-500 hover:text-slate-300 transition-colors">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </span>
                                        ))}
                                        <button className="inline-flex items-center gap-1 px-3 py-1.5 border border-dashed border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 text-xs font-bold rounded-full transition-all">
                                            <Plus className="w-3 h-3" /> Add Interest
                                        </button>
                                    </div>
                                </div>
                            </section>

                            {/* CARD 2: SECURITY & ACCESS */}
                            <section className="bg-[#111317] border border-slate-900 rounded-2xl p-6 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-white">Security & Access</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Manage your password and account protection settings.</p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-[#16181f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Password</label>
                                        <input type="password" placeholder="••••••••" className="w-full bg-[#16181f] border border-slate-800 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50" />
                                    </div>
                                </div>

                                <button className="px-4 py-2 bg-[#16181f] hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all">
                                    Update Password
                                </button>

                                <div className="h-px bg-slate-900" />

                                {/* 2FA Toggle Row */}
                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-bold text-white">Two-Factor Authentication</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">Add an extra layer of security to your account.</p>
                                    </div>
                                    <button
                                        onClick={() => setTwoFactor(!twoFactor)}
                                        className={`w-10 h-6 rounded-full p-1 transition-all duration-200 focus:outline-none ${twoFactor ? "bg-indigo-500 flex justify-end" : "bg-slate-800 flex justify-start"}`}
                                    >
                                        <span className="w-4 h-4 bg-white rounded-full shadow-sm block" />
                                    </button>
                                </div>
                            </section>

                            {/* CARD 3: NOTIFICATION PREFERENCES */}
                            <section className="bg-[#111317] border border-slate-900 rounded-2xl p-6 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Choose how you want to be notified of activity.</p>
                                </div>

                                {/* Sub Notification Table / List Layout */}
                                <div className="space-y-5">
                                    {[
                                        { id: "booking", label: "Booking Requests", desc: "Get notified when a client requests a viewing or booking." },
                                        { id: "messages", label: "New Messages", desc: "Direct messages from partners and potential leads." },
                                        { id: "updates", label: "Platform Updates", desc: "New features, maintenance alerts, and architectural insights." },
                                    ].map((row) => {
                                        const emailKey = `${row.id}Email` as keyof typeof notifications;
                                        const pushKey = `${row.id}Push` as keyof typeof notifications;

                                        return (
                                            <div key={row.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-1.5 border-b border-slate-900/40 last:border-0">
                                                <div className="space-y-0.5 max-w-md">
                                                    <h4 className="text-xs font-bold text-white">{row.label}</h4>
                                                    <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{row.desc}</p>
                                                </div>

                                                {/* Custom Form Styling Controls */}
                                                <div className="flex items-center gap-6 text-xs font-semibold text-slate-400 self-end sm:self-auto">
                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <span className="text-[11px]">Email</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleNotification(emailKey)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${notifications[emailKey] ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-700 bg-[#16181f]"}`}
                                                        >
                                                            {notifications[emailKey] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                        </button>
                                                    </label>

                                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                                        <span className="text-[11px]">Push</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleNotification(pushKey)}
                                                            className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${notifications[pushKey] ? "bg-indigo-500 border-indigo-500 text-white" : "border-slate-700 bg-[#16181f]"}`}
                                                        >
                                                            {notifications[pushKey] && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                                        </button>
                                                    </label>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>

                            {/* CARD 4: VISUAL PREFERENCES */}
                            <section className="bg-[#111317] border border-slate-900 rounded-2xl p-6 space-y-6">
                                <div>
                                    <h3 className="text-base font-bold text-white">Visual Preferences</h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Tailor the Habitat Pro interface to your workspace environment.</p>
                                </div>

                                <div className="flex items-center justify-between gap-4">
                                    <div className="space-y-0.5">
                                        <h4 className="text-xs font-bold text-white">Dark Mode</h4>
                                        <p className="text-[11px] text-slate-500 font-medium">Optimized for low-light architectural focus.</p>
                                    </div>

                                    {/* Sun / Moon Icon Toggle Pill Container */}
                                    <div className="bg-[#16181f] border border-slate-800 p-1 rounded-xl flex items-center shadow-inner">
                                        <button
                                            onClick={() => setIsDarkMode(false)}
                                            className={`p-2 rounded-lg transition-all ${!isDarkMode ? "bg-[#1f222e] text-amber-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                        >
                                            <Sun className="w-3.5 h-3.5" />
                                        </button>
                                        <button
                                            onClick={() => setIsDarkMode(true)}
                                            className={`p-2 rounded-lg transition-all ${isDarkMode ? "bg-[#1f222e] text-indigo-400 shadow-sm" : "text-slate-500 hover:text-slate-300"}`}
                                        >
                                            <Moon className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </section>

                        </div>

                    </div>

                </div>
            </main>

            {/* 3. STICKY GLOBAL BOTTOM SUB-ACTION SAVE BAR */}
            <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-[#090a0f]/90 backdrop-blur-md border-t border-slate-900 py-4 px-6 flex items-center justify-end gap-4 z-40 shadow-xl shadow-black">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-200 transition-colors">
                    Discard Changes
                </button>
                <button className="bg-indigo-200 hover:bg-indigo-300 text-indigo-950 text-xs font-extrabold px-5 py-3 rounded-xl transition-all shadow-md shadow-indigo-500/5 active:scale-[0.99]">
                    Save Profile
                </button>
            </div>

        </div>
    );
}