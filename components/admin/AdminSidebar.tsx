"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Building2, FileCheck2, LayoutDashboard, LogOut, Menu, Settings, ShieldCheck, UserRound, Users, X } from "lucide-react";
import { useState } from "react";
import { useLogout } from "@/app/hooks/useAuth";

const navigation = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/tenants", label: "Tenants", icon: Users },
    { href: "/admin/landlords", label: "Landlords", icon: Users },
    { href: "/admin/properties", label: "Properties", icon: Building2 },
    { href: "/admin/kyc", label: "KYC review", icon: FileCheck2 },
];

// Account pages available to the super admin as well.
const accountNavigation = [
    { href: "/profile", label: "My Profile", icon: UserRound },
    { href: "/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const logout = useLogout();
    const signOut = async () => { try { await logout.mutateAsync(); } finally { router.replace("/login"); } };
    const renderLink = ({ href, label, icon: Icon, exact }: (typeof navigation)[number]) => {
        const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
        return <Link onClick={() => setOpen(false)} key={href} href={href} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${active ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"}`}><Icon className="h-4 w-4" />{label}</Link>;
    };
    const links = <nav className="space-y-1">{navigation.map(renderLink)}
        <div className="my-3 border-t border-slate-200 dark:border-slate-800" />
        {accountNavigation.map(renderLink)}
    </nav>;
    return <>
        <button aria-label="Open admin navigation" onClick={() => setOpen(true)} className="fixed left-4 top-4 z-40 rounded-lg bg-indigo-600 p-2 text-white lg:hidden"><Menu className="h-5 w-5" /></button>
        {open && <button aria-label="Close navigation" onClick={() => setOpen(false)} className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden" />}
        <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 -translate-x-full flex-col border-r border-slate-200 bg-white p-4 transition-transform dark:border-slate-800 dark:bg-slate-950 lg:static lg:translate-x-0 ${open ? "translate-x-0" : ""}`}>
            <div className="mb-8 flex items-center justify-between px-2"><div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white"><ShieldCheck className="h-6 w-6 text-indigo-600" />Admin Console</div><button onClick={() => setOpen(false)} className="lg:hidden"><X className="h-5 w-5" /></button></div>
            {links}
            <button onClick={signOut} disabled={logout.isPending} className="mt-auto flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-50 dark:hover:bg-rose-950/30"><LogOut className="h-4 w-4" />Logout</button>
        </aside>
    </>;
}
