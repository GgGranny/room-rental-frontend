"use client";

import AdminNav from "@/components/AdminNav";
import LandlordSidebar from "@/components/LandlordSidebar";
import React from "react";

export default function LandlordLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <LandlordSidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
            <div className={`flex-auto transition-all duration-300 ${isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64"}`}>
                <main className=" max-w-full mx-auto">
                    <AdminNav />
                    {children}
                </main>
            </div>
        </div>
    );
};