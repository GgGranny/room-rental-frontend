"use client";

import React from "react";
import { Calendar, Clock, ChevronRight } from "lucide-react";

interface ScheduleItem {
    name: string;
    room: string;
    time: string;
    date: string;
    status: "confirmed" | "pending" | "cancelled";
}

const schedules: ScheduleItem[] = [
    { name: "Aarav Sharma", room: "Room 204", time: "10:30 AM", date: "Today", status: "confirmed" },
    { name: "Priya Thapa", room: "Room 112", time: "2:00 PM", date: "Today", status: "pending" },
];

const statusColor: Record<ScheduleItem["status"], string> = {
    confirmed: "bg-emerald-500",
    pending: "bg-amber-600",
    cancelled: "bg-slate-300 dark:bg-slate-700",
};

export default function ScheduleCard() {
    return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-900/80 dark:text-white tracking-wide">
                    Upcoming Visits
                </h3>
                <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-600" />
            </div>
            <div className="h-px bg-slate-100 dark:bg-slate-800" />

            <div className="space-y-3.5">
                {schedules.map((item, idx) => (
                    <div
                        key={idx}
                        className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 group cursor-pointer"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className={`w-2 h-2 rounded-full ${statusColor[item.status]} flex-shrink-0`} />
                            <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-slate-900 dark:text-white">{item.name}</span>
                                <span className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                    {item.room} &middot; {item.date}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 font-mono text-slate-900 dark:text-white font-black">
                                <Clock className="w-3 h-3 text-slate-400 dark:text-slate-600" />
                                <p className="text-xs font-bold text-slate-900/80 dark:text-white tracking-wide">
                                    {item.time}
                                </p>
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}