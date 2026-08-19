"use client";

import { MapPin } from "lucide-react";

interface MapCardProps {
    coordinates: {
        lat: string;
        long: string;
    };
}

export function MapCard({ coordinates }: MapCardProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Location Precision</h3>
                <span className="text-xs text-slate-500 dark:text-[#6B7280]">
                    Lat: {coordinates.lat} Long: {coordinates.long}
                </span>
            </div>
            <div className="group relative flex h-[240px] w-full items-center justify-center overflow-hidden rounded-[18px] border border-slate-200 bg-white transition-colors duration-300 dark:border-[#2C2C33] dark:bg-[#15151A]">
                <div className="absolute inset-0 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] opacity-10 [background-size:16px_16px] dark:bg-[radial-gradient(#ffffff_1px,transparent_1px)]" />

                <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-100 shadow-lg dark:border-[#2C2C33] dark:bg-[#1D1D23]">
                        <MapPin className="h-5 w-5 text-slate-700 dark:text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-500 dark:text-[#9CA3AF]">Pinpointing exact location...</span>
                </div>
            </div>
        </div>
    );
}