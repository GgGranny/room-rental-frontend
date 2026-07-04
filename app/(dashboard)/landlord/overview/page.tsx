"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    CalendarDays,
    Wallet,
    Users2,
    ArrowUpRight,
    Plus,
    CheckCircle2,
    Clock,
    AlertTriangle,
    ChevronRight,
    TrendingUp,
    MessageSquare,
    Sparkles
} from "lucide-react";

// Mock Data Matrices for the Top-Level Portal Aggregate
const recentActivity = [
    {
        id: "BKG-4402",
        tenant: "Sarah Jenkins",
        space: "The Glass Pavilion",
        action: "New Booking Confirmed",
        time: "12 mins ago",
        amount: 2450,
        status: "confirmed"
    },
    {
        id: "BKG-4399",
        tenant: "Marcus Vance",
        space: "Horizon Suite",
        action: "Check-out Complete",
        time: "2 hours ago",
        amount: 1900,
        status: "completed"
    },
    {
        id: "MNT-1022",
        tenant: "Elena Rostova",
        space: "Timber & Clay Studio",
        action: "HVAC Repair Request",
        time: "4 hours ago",
        amount: 0,
        status: "urgent"
    },
    {
        id: "BKG-4391",
        tenant: "David Cho",
        space: "Eco-Pod 04",
        action: "Extension Pending Escrow",
        time: "1 day ago",
        amount: 650,
        status: "pending"
    }
];

const maintenanceAlerts = [
    { space: "Timber & Clay Studio", issue: "HVAC failure in West Block", level: "critical" },
    { space: "Horizon Suite", issue: "Smart-lock calibration issue", level: "warning" }
];

export default function LandLordOverview() {
    const [timeframe, setTimeframe] = useState("30");

    return (
        <div className="space-y-6">

            {/* 1. MASTER GREETING & INTERACTIVE TIMEFRAME TOGGLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-900 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        Welcome back, Julian <span className="animate-wave origin-bottom-right inline-block">👋</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Here is the operational efficiency index for your real estate portfolio today.
                    </p>
                </div>

                {/* Global Action Triggers */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="text-[11px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 focus:outline-none text-slate-600 dark:text-slate-300 shadow-sm"
                    >
                        <option value="7">Past 7 Days</option>
                        <option value="30">Past 30 Days</option>
                        <option value="90">Past Quarter</option>
                    </select>

                    <Link
                        href="/admin/rooms/new"
                        className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" /> List Space
                    </Link>
                </div>
            </div>

            {/* 2. AGGREGATE CORE METRIC OVERVIEW GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Gross Revenue Index", value: "$18,430.00", change: "+12.4%", positive: true, icon: Wallet, link: "/admin/earnings" },
                    { label: "Portfolio Occupancy", value: "88.4%", change: "+3.2%", positive: true, icon: Building2, link: "/admin/rooms" },
                    { label: "Active Allocations", value: "48 Bookings", change: "6 pending", positive: true, isNeutral: true, icon: CalendarDays, link: "/admin/bookings" },
                    { label: "Unread Tenant Threads", value: "5 Messages", change: "Action required", positive: false, isNeutral: true, icon: MessageSquare, link: "/admin/messages" },
                ].map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Link
                            key={idx}
                            href={stat.link}
                            className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm flex items-center justify-between group hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        >
                            <div className="space-y-1.5 min-w-0">
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{stat.label}</span>
                                <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight block font-mono">{stat.value}</span>
                                <span className={`text-[10px] font-bold block ${stat.isNeutral
                                    ? "text-slate-400 dark:text-slate-500"
                                    : stat.positive
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-amber-600 dark:text-amber-400"
                                    }`}>
                                    {stat.change}
                                </span>
                            </div>
                            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-850 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:bg-indigo-50/30 dark:group-hover:bg-indigo-950/20 transition-all shrink-0">
                                <Icon className="w-4 h-4" />
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* 3. SPLIT COLUMN DATA INTERFACE LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LEFT COLUMN: LIVE RECENT LOGS GRID (8 COLUMNS) */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Live System Feed</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Real-time status changes for room inventory and tenant bookings.</p>
                        </div>
                        <Link href="/admin/bookings" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 hover:underline">
                            View Ledger <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="divide-y divide-slate-100 dark:divide-slate-850/60">
                        {recentActivity.map((log) => (
                            <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-all">
                                <div className="flex items-start gap-3 min-w-0">
                                    {/* Status-specific icon treatments */}
                                    <div className="mt-0.5 shrink-0">
                                        {log.status === "confirmed" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                        {log.status === "completed" && <CheckCircle2 className="w-4 h-4 text-slate-400" />}
                                        {log.status === "pending" && <Clock className="w-4 h-4 text-amber-500" />}
                                        {log.status === "urgent" && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                                    </div>
                                    <div className="space-y-0.5 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">{log.tenant}</span>
                                            <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-1 rounded">{log.id}</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">{log.action} — <span className="text-slate-400 font-medium">{log.space}</span></p>
                                    </div>
                                </div>

                                <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1 shrink-0">
                                    {log.amount > 0 && (
                                        <span className="text-xs font-black font-mono text-slate-900 dark:text-white">
                                            ${log.amount.toLocaleString()}.00
                                        </span>
                                    )}
                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium block">{log.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT COLUMN: ACTION RADIALS & ALERTS (4 COLUMNS) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* CRITICAL INFRASTRUCTURE MAINTENANCE MONITOR */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Property Health Desk</h3>

                        <div className="space-y-2.5">
                            {maintenanceAlerts.map((alert, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-900 rounded-xl flex items-start gap-2.5">
                                    <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${alert.level === "critical" ? "text-rose-500" : "text-amber-500"}`} />
                                    <div className="min-w-0 space-y-0.5">
                                        <h4 className="text-[11px] font-black text-slate-900 dark:text-white truncate tracking-tight">{alert.space}</h4>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-normal">{alert.issue}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Link href="/admin/rooms" className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200/40 dark:border-slate-850 py-2 px-3 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 transition-all text-center block">
                            Manage Space States
                        </Link>
                    </div>

                    {/* METRIC CARD: QUICK SYSTEM PERFORMANCE METADATA */}
                    <div className="bg-gradient-to-tr from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-md space-y-4 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-all" />
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-indigo-400">Optimization Index</span>
                            </div>
                            <h4 className="text-sm font-black tracking-tight">Escrow Velocity Rating</h4>
                        </div>

                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black font-mono">94.2</span>
                            <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5"><TrendingUp className="w-3 h-3" /> Excellent</span>
                        </div>

                        <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                            Your average booking confirmation-to-settlement speed increased by 4.2 hours this week.
                        </p>
                    </div>

                </div>

            </div>

        </div>
    );
}