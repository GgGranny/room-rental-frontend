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
        <div className="grid grid-cols-2 gap-3 rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-4 sm:grid-cols-4">
            {items.map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1 border-r border-[#2C2C33] last:border-none pr-2">
                    <span className="text-xs text-[#9CA3AF]">{item.label}</span>
                    <span className="text-base font-semibold text-white sm:text-lg">{item.value}</span>
                </div>
            ))}
        </div>
    );
}