"use client";

import { Protocol } from "@/app/types/properties";
import { Ban, Moon, Dog } from "lucide-react";

interface HouseProtocolsProps {
    protocols: Protocol[];
}

const iconMap: Record<string, React.ReactNode> = {
    Ban: <Ban className="h-4 w-4 shrink-0 text-slate-500 dark:text-[#9CA3AF]" />,
    Moon: <Moon className="h-4 w-4 shrink-0 text-slate-500 dark:text-[#9CA3AF]" />,
    Dog: <Dog className="h-4 w-4 shrink-0 text-slate-500 dark:text-[#9CA3AF]" />,
};

export function HouseProtocols({ protocols }: HouseProtocolsProps) {
    return (
        <div className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">House Protocols</h3>
            <ul className="space-y-3">
                {protocols.map((prot, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#9CA3AF]">
                        {iconMap[prot.icon] || <Ban className="h-4 w-4 text-slate-500 dark:text-[#9CA3AF]" />}
                        <span>{prot.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}