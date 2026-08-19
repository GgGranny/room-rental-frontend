"use client";

import React from "react";
import { FileText } from "lucide-react";
import ChartAreaInteractive from "../AreaChart";

interface AnalyticsCardProps {
    icon?: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    subtitle?: string;
    active?: boolean;
    className?: string;
}

export default function AnalyticsCard({ icon: Icon = FileText, title, value, subtitle, active, className = "" }: AnalyticsCardProps) {
    return (
        <div className="w-full max-w-xs rounded-2xl p-5 bg-white dark:from-indigo-950 dark:to-slate-900 dark:border dark:border-indigo-900/50 shadow-lg shadow-indigo-500/20 dark:shadow-none">
            <div className="flex items-center justify-between mb-5">
                <p className="text-xs tracking-tight text-black/80 dark:text-indigo-200/70 mb-1.5">
                    {title}
                </p>
                <div className={className ? className : "w-11 h-11 rounded-xl bg-white/20 dark:bg-white/10 flex items-center justify-center backdrop-blur-sm"}>
                    <Icon className="w-5 h-5 text-black/80 dark:text-indigo-200/70" />
                </div>
            </div>


            <div className="flex flex-col items-start justify-between">
                <h2 className="text-2xl text-indigo-800 dark:text-indigo-200/70 tracking-tight">
                    {value.startsWith("$") ? value[0] + " " + value.slice(1, value.length) : value}
                </h2>
                <p className="text-xs tracking-tight text-gray-500 dark:text-indigo-200/60 text-right max-w-[90px]">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}