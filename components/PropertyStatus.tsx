"use client";

import { PropertyStats as StatsType } from "../types/properties";

interface PropertyStatsProps {
    stats: StatsType;
}

export function PropertyStats({ stats }: PropertyStatsProps) {
    const items = [
        { label: "Room Type", value: stats.roomType },
        { label: "Floor Level", value: stats.floorLevel },
        { label: "Total Units", value: stats.totalUnits },
        { label: "Dimensions", value: stats.dimensions },
    ];

    return (
        <div className="grid grid-cols-2 gap-3 rounded-[18px] border border-slate-200 bg-white p-4 transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A] sm:grid-cols-4">
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-r border-slate-200 pr-2 last:border-none dark:border-[#2C2C33]">
                    <span className="text-xs text-slate-500 dark:text-[#9CA3AF]">{item.label}</span>
                    <span className="text-base font-semibold text-slate-900 dark:text-white sm:text-lg">{item.value}</span>
                </div>
            ))}
        </div>
    );
}