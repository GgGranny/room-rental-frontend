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
                <h3 className="text-base font-semibold text-white">Location Precision</h3>
                <span className="text-xs text-[#6B7280]">
                    Lat: {coordinates.lat} Long: {coordinates.long}
                </span>
            </div>
            <div className="relative flex h-[240px] w-full items-center justify-center rounded-[18px] border border-[#2C2C33] bg-[#15151A] overflow-hidden group">
                {/* Subtle grid pattern background to emulate map styling */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1D1D23] border border-[#2C2C33] shadow-lg">
                        <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-[#9CA3AF]">Pinpointing exact location...</span>
                </div>
            </div>
        </div>
    );
}