"use client";

import AdminNav from "@/components/AdminNav";
import PushNotifications from "@/components/PushNotifications";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <AdminNav />
            <main className="max-w-[1400px] mx-auto w-full">{children}</main>
            <PushNotifications />
        </div>
    );
}
