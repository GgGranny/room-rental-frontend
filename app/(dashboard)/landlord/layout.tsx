"use client";

import LandlordSidebar from "@/app/components/LandlordSidebar";
import React from "react";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            {/* Left Fixed Structural Sidebar Navigation Panel */}
            <LandlordSidebar />

            {/* Main Dynamically Swapped Panel Content Viewport */}
            {/* Adjust left padding dynamically via Tailwind matching standard sidebar width expansions */}
            <div className="pl-20 sm:pl-66 md:pl-70 transition-all duration-300">
                <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};