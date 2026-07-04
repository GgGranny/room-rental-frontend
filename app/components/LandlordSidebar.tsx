"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    LayoutDashboard,
    Building2,
    CalendarDays,
    Wallet,
    Users2,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Bell,
    Calendar,
    BarChart3,
    Plus,
    Menu
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarProps {
    className?: string;
}

type SidebarItems = {
    label: string;
    icon: React.ElementType;
    active: boolean;
    href: string;
}

export default function LandlordSidebar({ className = "" }: SidebarProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const router = useRouter();

    // Structural Navigation Layout Matrix for Landlord Assets
    // Navigation mapping array matching sidebar items
    const sidebarItems: SidebarItems[] = [
        { label: "Overview", icon: LayoutDashboard, active: true, href: "/dashboard/landlord" },
        { label: "Properties", icon: Building2, active: false, href: "/dashboard/landlord/properties" },
        { label: "Bookings", icon: Calendar, active: false, href: "/dashboard/landlord/bookings" },
        { label: "Analytics", icon: BarChart3, active: false, href: "/dashboard/landlord/analytics" },
        { label: "Messages", icon: MessageSquare, active: false, href: "/dashboard/landlord/messages" },
        { label: "Settings", icon: Settings, active: false, href: "/dashboard/landlord/settings" },
    ];

    return (
        <aside className="w-64 border-r border-slate-200/80 bg-primary-light dark:border-slate-900 dark:bg-slate-950 px-4 py-6 flex flex-col justify-between shrink-0 hidden md:flex h-screen fixed top-0 left-0" >
            <div className="space-y-8">
                {/* Brand Logo Header */}
                <div className="flex items-center justify-between">  
                    <div className="px-3 gap-3 flex items-center ">
                        <div className="bg-white rounded-full h-10 w-10 dark:bg-indigo-400 flex items-center justify-center ">
                            <h1 className="font-black tracking-tight text-primary-light flex items-center gap-3  dark:text-indigo-400">B</h1>
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-white dark:text-indigo-400">Basai</h2>
                    </div>
                    <div className="p-2 rounded-lg group cursor-pointer" onClick={() => setIsCollapsed(!isCollapsed)}>
                        <Menu className="w-5 h-5 text-white dark:text-slate-400 group-hover:scale-125 transition-all" />
                    </div>
                </div>

                {/* Navigation Matrix Link Stacks */}
                <nav className="space-y-1">
                    {sidebarItems.map((item, idx) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={idx}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-bold transition-all ${item.active
                                    ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${item.active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Dynamic Global Add Trigger Anchor Callout */}
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center justify-center gap-2">
                <Plus className="w-4 h-4 stroke-[3]" /> List New Property
            </button>
        </aside>
    );
}