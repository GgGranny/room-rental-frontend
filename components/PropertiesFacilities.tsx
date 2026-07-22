"use client";

import { Facility } from "../types/properties";
import { Wifi, Utensils, Building, Wind } from "lucide-react";

interface FacilitiesCardProps {
    facilities: Facility[];
}

const iconMap: Record<string, React.ReactNode> = {
    Wifi: <Wifi className="h-4 w-4 text-[#9CA3AF]" />,
    Utensils: <Utensils className="h-4 w-4 text-[#9CA3AF]" />,
    Building: <Building className="h-4 w-4 text-[#9CA3AF]" />,
    Wind: <Wind className="h-4 w-4 text-[#9CA3AF]" />,
};

export function FacilitiesCard({ facilities }: FacilitiesCardProps) {
    return (
        <div className="rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-5 space-y-4">
            <h3 className="text-base font-semibold text-white">Curated Facilities</h3>
            <div className="grid grid-cols-2 gap-3">
                {facilities.map((fac, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col gap-3 rounded-xl border border-[#2C2C33] bg-[#1D1D23] p-3 transition-colors hover:border-[#6C5CE7]/50"
                    >
                        {iconMap[fac.icon] || <Wifi className="h-4 w-4 text-[#9CA3AF]" />}
                        <span className="text-xs font-medium text-white">{fac.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}