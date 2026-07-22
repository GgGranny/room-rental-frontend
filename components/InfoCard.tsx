import React from "react";

interface infoItems {
    title: string;
    value: number;
    icon: React.ComponentType<{ className?: string }>;
    description?: string;
}

interface infoDataProps {
    infoData: infoItems[];
}

export default function InfoCard({ infoData }: infoDataProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {infoData.map((data, index) => {
                const Icon = data.icon;
                return (
                    <div
                        key={index}
                        className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-3 hover:shadow-md transition-shadow"
                    >
                        {/* Value shown as a notification badge, top-right of the card */}
                        {data.value > 0 && (
                            <span className="absolute -top-2 -right-2 min-w-[22px] h-[22px] px-1.5 flex items-center justify-center rounded-full bg-rose-500 text-white text-[11px] font-bold shadow-sm shadow-rose-500/30">
                                {data.value > 99 ? "99+" : data.value}
                            </span>
                        )}

                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                                {data.title}
                            </span>
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            </div>
                        </div>

                        {data.description && (
                            <p className="text-xs font-normal text-slate-400 dark:text-slate-500">
                                {data.description}
                            </p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}