"use client";

import { Protocol } from "../types/properties";
import { Ban, Moon, Dog } from "lucide-react";

interface HouseProtocolsProps {
    protocols: Protocol[];
}

const iconMap: Record<string, React.ReactNode> = {
    Ban: <Ban className="h-4 w-4 text-[#9CA3AF] shrink-0" />,
    Moon: <Moon className="h-4 w-4 text-[#9CA3AF] shrink-0" />,
    Dog: <Dog className="h-4 w-4 text-[#9CA3AF] shrink-0" />,
};

export function HouseProtocols({ protocols }: HouseProtocolsProps) {
    return (
        <div className="rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-5 space-y-4">
            <h3 className="text-base font-semibold text-white">House Protocols</h3>
            <ul className="space-y-3">
                {protocols.map((prot, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-xs text-[#9CA3AF]">
                        {iconMap[prot.icon] || <Ban className="h-4 w-4 text-[#9CA3AF]" />}
                        <span>{prot.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}