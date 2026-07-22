"use client";

import { Agent } from "@/app/types/properties";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface AgentCardProps {
    agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-5">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-12 w-12 border border-[#2C2C33]">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback className="bg-[#1D1D23] text-white">MT</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#15151A] bg-[#22C55E]" />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#6C5CE7]">{agent.managedBy}</span>
                    <h4 className="text-base font-semibold text-white leading-tight">{agent.name}</h4>
                    <p className="text-xs text-[#9CA3AF]">{agent.role}</p>
                </div>
            </div>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-[#2C2C33] bg-[#1D1D23] px-4 py-2.5 text-xs font-medium text-white transition-all hover:bg-[#2C2C33] hover:border-[#6C5CE7]/50 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] w-full sm:w-auto">
                <Mail className="h-4 w-4" />
                <span>Message Host</span>
            </button>
        </div>
    );
}