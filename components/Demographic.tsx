"use client";

interface DemographicsProps {
    items: string[];
}

export function Demographics({ items }: DemographicsProps) {
    return (
        <div className="space-y-4 rounded-[18px] border border-slate-200 bg-white p-5 transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A]">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">Curated Demographic</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span
                        key={idx}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 dark:border-[#2C2C33] dark:bg-[#1D1D23] dark:text-[#9CA3AF]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}