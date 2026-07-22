"use client";

interface DemographicsProps {
    items: string[];
}

export function Demographics({ items }: DemographicsProps) {
    return (
        <div className="rounded-[18px] border border-[#2C2C33] bg-[#15151A] p-5 space-y-4">
            <h3 className="text-base font-semibold text-white">Curated Demographic</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item, idx) => (
                    <span
                        key={idx}
                        className="rounded-full border border-[#2C2C33] bg-[#1D1D23] px-3 py-1.5 text-xs text-[#9CA3AF]"
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
}