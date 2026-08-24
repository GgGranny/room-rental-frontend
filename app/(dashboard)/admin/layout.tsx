"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";
import PushNotifications from "@/components/PushNotifications";
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminRouteGuard><div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100 lg:flex">
            <AdminSidebar />
            <main className="min-w-0 flex-1 p-6 pt-20 lg:p-8">{children}</main>
            <PushNotifications />
        </div></AdminRouteGuard>
    );
}
