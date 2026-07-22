"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Building2,
    MessageSquare,
    Settings,
    Calendar,
    BarChart3,
    Plus,
    Menu,
    ChevronDown,
    List,
    PlusCircle,
    Tags,
} from "lucide-react";

interface SidebarProps {
    className?: string;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
}

type SubItem = {
    label: string;
    icon: React.ElementType;
    href: string;
};

type SidebarItems = {
    label: string;
    icon: React.ElementType;
    href: string;
    subItems?: SubItem[];
};

export default function LandlordSidebar({ className = "", collapsed, setCollapsed }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();

    // Track open dropdowns
    const [openLabel, setOpenLabel] = useState<string | null>("Properties");

    const sidebarItems: SidebarItems[] = [
        { label: "Overview", icon: LayoutDashboard, href: "/landlord" },
        {
            label: "Properties",
            icon: Building2,
            href: "/landlord/properties",
            subItems: [
                { label: "All Properties", icon: List, href: "/landlord/properties/all" },
                { label: "Add Property", icon: PlusCircle, href: "/landlord/properties/add" },
                { label: "Categories", icon: Tags, href: "/landlord/properties/categories" },
            ],
        },
        { label: "Bookings", icon: Calendar, href: "/dashboard/landlord/bookings" },
        { label: "Analytics", icon: BarChart3, href: "/dashboard/landlord/analytics" },
        { label: "Messages", icon: MessageSquare, href: "/dashboard/landlord/messages" },
        { label: "Settings", icon: Settings, href: "/dashboard/landlord/settings" },
    ];

    // Accurate sub-route and strict match evaluator
    const isActive = (item: SidebarItems) => {
        if (pathname === item.href) return true;
        if (item.subItems) {
            return item.subItems.some((sub) => pathname === sub.href);
        }
        return pathname?.startsWith(item.href + "/");
    };

    const handleParentClick = (item: SidebarItems) => {
        if (item.subItems) {
            setOpenLabel(openLabel === item.label ? null : item.label);
            return;
        }
        router.push(item.href);
    };

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen border-r border-slate-200/80 bg-white p-4 flex flex-col justify-between shrink-0 hidden md:flex dark:border-slate-800/50 dark:bg-slate-950 transition-all duration-300 ease-in-out ${collapsed ? "w-[78px]" : "w-64"
                } ${className}`}
        >
            <div className="space-y-6">
                {/* Brand Logo Header */}
                <div className={`flex items-center h-14 ${collapsed ? "justify-center" : "justify-between px-2"}`}>
                    <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap">
                        <div className="bg-indigo-600 rounded-xl h-9 w-9 flex items-center justify-center shadow-md shadow-indigo-600/20 text-white shrink-0">
                            <span className="font-bold text-base tracking-tight">B</span>
                        </div>
                        <h2
                            className={`text-base font-bold tracking-tight text-slate-900 dark:text-slate-50 transition-opacity duration-200 ${collapsed ? "opacity-0 w-0" : "opacity-100"
                                }`}
                        >
                            Basai
                        </h2>
                    </div>

                    {!collapsed && (
                        <button
                            onClick={() => setCollapsed(!collapsed)}
                            className="p-1.5 rounded-lg border border-slate-200/60 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                        >
                            <Menu className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-1">
                    {sidebarItems.map((item, idx) => {
                        const Icon = item.icon;
                        const active = isActive(item);
                        const isOpen = openLabel === item.label;

                        return (
                            <div key={idx} className="space-y-1">
                                <button
                                    onClick={() => handleParentClick(item)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${active
                                        ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
                                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-slate-200"
                                        }`}
                                    title={collapsed ? item.label : undefined}
                                >
                                    <span className="flex items-center gap-3 min-w-0">
                                        <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"}`} />
                                        <span className={`transition-opacity duration-200 text-xs  overflow-hidden whitespace-nowrap ${collapsed ? "opacity-0 w-0" : "opacity-100"}`}>
                                            {item.label}
                                        </span>
                                    </span>

                                    {item.subItems && !collapsed && (
                                        <ChevronDown
                                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    )}
                                </button>

                                {/* Dropdown Submenu */}
                                {item.subItems && !collapsed && (
                                    <div
                                        className={`overflow-hidden transition-all duration-200 ease-in-out ${isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                                            }`}
                                    >
                                        <div className="ml-[21px] mt-1 flex flex-col gap-1 border-l border-slate-200 dark:border-slate-800 pl-4">
                                            {item.subItems.map((sub) => {
                                                const SubIcon = sub.icon;
                                                const subActive = pathname === sub.href;
                                                return (
                                                    <button
                                                        key={sub.href}
                                                        onClick={() => router.push(sub.href)}
                                                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${subActive
                                                            ? "text-indigo-600 dark:text-indigo-400 font-semibold"
                                                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                                                            }`}
                                                    >
                                                        <SubIcon className="w-3.5 h-3.5 shrink-0" />
                                                        <span>{sub.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>

            {/* Bottom Dynamic Callout / Action Trigger */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-900/60">
                {collapsed ? (
                    <button
                        onClick={() => setCollapsed(false)}
                        className="w-10 h-10 mx-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/10 transition-colors flex items-center justify-center"
                        title="Expand Sidebar"
                    >
                        <Plus className="w-5 h-5 stroke-[2.5]" />
                    </button>
                ) : (
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-md shadow-indigo-600/10 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span className="whitespace-nowrap">List New Property</span>
                    </button>
                )}
            </div>
        </aside>
    );
}