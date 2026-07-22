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
    ChevronDown,
    TrendingUpIcon,
    DoorClosed,
    Calculator
} from "lucide-react";
import { useRouter } from "next/navigation";
import AnalyticsCard from "@/components/myui/AnalyticsCard";
import ChartAreaInteractive from "@/components/AreaChart";
import ScheduleCard from "@/components/Schedules";
import { BarChartAnalytics } from "@/components/BarCharts";
import InfoCard from "@/components/InfoCard";
import MeetingCalender from "@/components/myui/MyCalander";
import { ChartLineInteractive } from "@/components/MyLineChart";
import { ChartRadialSimple } from "@/components/MyRadialChart";
import UpcomingStays from "@/components/UpCommingStays";


export default function LandlordDashboard() {
    const [isActive, setIsActive] = React.useState(false);
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

    const analyticsData = [
        {
            id: 1,
            title: "Total Sales",
            value: "$612,917",
            icon: TrendingUpIcon,
            subtitle: "vs last month",
            className: "w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center backdrop-blur-sm"
        },
        {
            id: 2,
            title: "Total Bookings",
            value: "1,245",
            icon: Calendar,
            subtitle: "vs last month",
            className: "w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-950/40 flex items-center justify-center backdrop-blur-sm"
        },
        {
            id: 3,
            title: "Total Properties",
            value: "8",
            icon: Building2,
            subtitle: "vs last month",
            className: "w-11 h-11 rounded-xl bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center backdrop-blur-sm"
        },
        {
            id: 4,
            title: "Total Messages",
            value: "1,024",
            icon: MessageSquare,
            subtitle: "vs last month",
            className: "w-11 h-11 rounded-xl bg-indigo-100 dark:bg-indigo-950/40 flex items-center justify-center backdrop-blur-sm"
        }
    ]

    const infoData = [
        {
            title: "Rooms",
            value: 4,
            icon: DoorClosed,
            description: "click to view more"
        },
        {
            title: "Complaints",
            value: 10,
            icon: Calculator,
            description: "click to view more"
        },
        {
            title: "Schedules",
            value: 4,
            icon: Calendar,
            description: "click to view more"
        },
        {
            title: "Payments",
            value: 4,
            icon: DoorClosed,
            description: "click to view more"
        }
    ]

    return (
        <div className="min-h-screen bg-transparent dark:bg-slate-950 flex font-sans antialiased text-slate-900 dark:text-slate-100">
            {/* ================= MAIN INTERFACE WRAPPER PANELS ================= */}
            <div className="w-full flex-1 flex flex-col min-w-0 ">
                {/* CORE WORKSPACE INNER CONTENT HUB */}
                <main className="p-6 max-w-[1400px] w-full mx-auto space-y-6">
                    {/* PRIMARY PORTFOLIO MACRO ANALYTICAL METRICS ROW */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {analyticsData.map((data) => {
                            return (
                                <div key={data.id}>
                                    <AnalyticsCard icon={data.icon} title={data.title} value={data.value} subtitle={data.subtitle} className={data.className} />
                                </div>
                            )
                        })}
                    </div>

                    {/* DUAL WORKSPACE LAYOUT ROW SEGMENT */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                        <div className="lg:col-span-8 space-y-6 h-full">
                            <div className="h-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-bold text-slate-900/80 dark:text-white uppercase tracking-wide">Revenue Trends</h3>
                                </div>
                                <ChartAreaInteractive />
                            </div>
                        </div>

                        {/* RIGHT-SIDE WIDGET META PLATFORM RAIL (4 COLUMNS) */}
                        <div className="h-full lg:col-span-4 space-y-6">
                            <ChartRadialSimple />
                        </div>
                    </div>
                    <div>
                        <UpcomingStays />
                    </div>
                </main>
            </div>

        </div>
    );
}