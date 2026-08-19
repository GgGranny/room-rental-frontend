"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
    Building2,
    CalendarDays,
    Plus,
    CheckCircle2,
    Clock,
    XCircle,
    ChevronRight,
    Sparkles,
    Calendar
} from "lucide-react";
import { useLandlordSchedules } from "@/app/hooks/useSchedule";
import { useGetAllProperty } from "@/app/hooks/useProperty";

export default function LandLordOverview() {
    const [timeframe, setTimeframe] = useState("30");

    const { data: schedulesData, isLoading: schedulesLoading } = useLandlordSchedules();
    const { data: propertiesData, isLoading: propertiesLoading } = useGetAllProperty();

    const schedules = Array.isArray(schedulesData) ? schedulesData : [];

    // Properties response unwrapping safely
    let properties: any[] = [];
    if (propertiesData) {
        if (Array.isArray(propertiesData)) {
            properties = propertiesData;
        } else if (Array.isArray((propertiesData as any).data)) {
            properties = (propertiesData as any).data;
        }
    }

    const pendingCount = schedules.filter((s) => s.status === "PENDING").length;
    const approvedCount = schedules.filter((s) => s.status === "APPROVED").length;
    const featuredPropertiesCount = properties.filter((p) => p.featured || p.isFeatured).length;

    return (
        <div className="space-y-6">

            {/* 1. MASTER GREETING & INTERACTIVE TIMEFRAME TOGGLE */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-150 dark:border-slate-900 pb-5">
                <div className="space-y-1">
                    <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        Landlord Dashboard <span className="animate-wave origin-bottom-right inline-block">👋</span>
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Real-time overview of your listed properties and tenant viewing schedules.
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
                        href="/landlord/properties/add"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                    >
                        <Plus className="w-3.5 h-3.5" /> Add Property
                    </Link>
                </div>
            </div>

            {/* 2. AGGREGATE CORE METRIC OVERVIEW GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    {
                        label: "Listed Properties",
                        value: propertiesLoading ? "..." : `${properties.length} Active`,
                        change: "Manage portfolio",
                        positive: true,
                        isNeutral: true,
                        icon: Building2,
                        link: "/landlord/properties"
                    },
                    {
                        label: "Pending Viewings",
                        value: schedulesLoading ? "..." : `${pendingCount} Request${pendingCount === 1 ? "" : "s"}`,
                        change: "Requires action",
                        positive: pendingCount === 0,
                        isNeutral: false,
                        icon: Clock,
                        link: "/landlord/schedules"
                    },
                    {
                        label: "Approved Viewings",
                        value: schedulesLoading ? "..." : `${approvedCount} Scheduled`,
                        change: "Confirmed visits",
                        positive: true,
                        isNeutral: true,
                        icon: CalendarDays,
                        link: "/landlord/schedules"
                    },
                    {
                        label: "Featured Properties",
                        value: propertiesLoading ? "..." : `${featuredPropertiesCount} Promoted`,
                        change: "Boost visibility",
                        positive: true,
                        isNeutral: true,
                        icon: Sparkles,
                        link: "/landlord/featured"
                    },
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

                {/* LEFT COLUMN: LIVE RECENT VIEWING SCHEDULES GRID (8 COLUMNS) */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-slate-100 dark:border-slate-850/60 flex items-center justify-between">
                        <div className="space-y-0.5">
                            <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Live Viewing Feed</h3>
                            <p className="text-[11px] text-slate-500 font-medium">Real-time room viewing visit requests from tenants.</p>
                        </div>
                        <Link href="/landlord/schedules" className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 hover:underline">
                            View All Schedules <ChevronRight className="w-3 h-3" />
                        </Link>
                    </div>

                    {schedulesLoading ? (
                        <div className="p-8 text-center text-xs text-slate-400">Loading viewing requests...</div>
                    ) : schedules.length === 0 ? (
                        <div className="p-8 text-center space-y-2">
                            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-xs font-medium text-slate-500">No viewing requests received yet.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-850/60">
                            {schedules.slice(0, 5).map((log) => (
                                <div key={log.scheduleId} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/40 dark:hover:bg-slate-950/20 transition-all">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <div className="mt-0.5 shrink-0">
                                            {log.status === "APPROVED" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                                            {log.status === "PENDING" && <Clock className="w-4 h-4 text-amber-500" />}
                                            {log.status === "REJECTED" && <XCircle className="w-4 h-4 text-rose-500" />}
                                            {log.status === "CANCELLED" && <XCircle className="w-4 h-4 text-slate-400" />}
                                        </div>
                                        <div className="space-y-0.5 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-xs font-black text-slate-900 dark:text-white tracking-tight">
                                                    {log.tenantName || log.tenantEmail || "Tenant"}
                                                </span>
                                                <span className="text-[9px] font-mono font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 px-1 rounded">
                                                    {log.status}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                                                Requested Room Visit: <span className="text-slate-800 dark:text-slate-200">{log.roomTitle || "Room Listing"}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="sm:text-right flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-1 shrink-0">
                                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                                            {new Date(log.scheduledAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* RIGHT COLUMN: ACTION & PROMOTIONS (4 COLUMNS) */}
                <div className="lg:col-span-4 space-y-6">

                    {/* FEATURED PROPERTY PROMOTION CARD */}
                    <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-4 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-28 h-28 bg-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-all" />
                        <div className="space-y-1">
                            <div className="flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                                <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">Feature Listing</span>
                            </div>
                            <h4 className="text-sm font-black tracking-tight">Promote Your Property</h4>
                        </div>

                        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
                            Feature your property on top of tenant search results for 30 days via eSewa or Khalti.
                        </p>

                        <Link
                            href="/landlord/featured"
                            className="inline-block w-full bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-2.5 px-4 rounded-xl text-center transition-all shadow-sm"
                        >
                            Feature Property (500 NPR)
                        </Link>
                    </div>

                    {/* QUICK NAVIGATION */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-3">
                        <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Quick Actions</h3>

                        <div className="space-y-2">
                            <Link
                                href="/landlord/properties/add"
                                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200/40 dark:border-slate-850 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all text-center block"
                            >
                                + List New Property
                            </Link>

                            <Link
                                href="/landlord/properties"
                                className="w-full bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200/40 dark:border-slate-850 py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 transition-all text-center block"
                            >
                                Manage All Properties
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}