"use client";

import { Facility } from "@/app/types/properties";
import { Wifi, Utensils, Building, Wind } from "lucide-react";

interface FacilitiesCardProps {
    facilities: Facility[];
}

const iconMap: Record<string, React.ReactNode> = {
    Wifi: <Wifi className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />,
    Utensils: <Utensils className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />,
    Building: <Building className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />,
    Wind: <Wind className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />,
};

export function FacilitiesCard({ facilities }: FacilitiesCardProps) {
    return (
        <div className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Curated Facilities</h3>
            <div className="grid grid-cols-2 gap-3">
                {facilities.map((fac, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:border-[#6C5CE7]/50 dark:border-[#2C2C33] dark:bg-[#1D1D23]"
                    >
                        {iconMap[fac.icon] || <Wifi className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />}
                        <span className="text-xs font-medium text-slate-700 dark:text-white">{fac.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}