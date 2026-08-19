"use client";

import { Agent } from "@/app/types/properties";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail } from "lucide-react";

interface AgentCardProps {
    agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
    return (
        <div className="flex flex-col items-start justify-between gap-4 rounded-[18px] border border-slate-200 bg-white p-5 transition-colors duration-300 sm:flex-row sm:items-center dark:border-[#2C2C33] dark:bg-[#15151A]">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Avatar className="h-12 w-12 border border-slate-200 dark:border-[#2C2C33]">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback className="bg-slate-100 text-slate-700 dark:bg-[#1D1D23] dark:text-white">MT</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-[#22C55E] dark:border-[#15151A]" />
                </div>
                <div>
                    <span className="text-[10px] font-bold tracking-wider text-[#6C5CE7]">{agent.managedBy}</span>
                    <h4 className="text-base font-semibold leading-tight text-slate-900 dark:text-white">{agent.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-[#9CA3AF]">{agent.role}</p>
                </div>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-700 transition-all hover:border-[#6C5CE7]/50 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] sm:w-auto dark:border-[#2C2C33] dark:bg-[#1D1D23] dark:text-white dark:hover:bg-[#2C2C33]">
                <Mail className="h-4 w-4" />
                <span>Message Host</span>
            </button>
        </div>
    );
}