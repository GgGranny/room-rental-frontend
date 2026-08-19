"use client";

import React from "react";
import Link from "next/link";
import {
    User as UserIcon,
    Mail,
    Calendar,
    ShieldCheck,
    ShieldAlert,
    BadgeCheck,
    Home,
    ChevronRight,
} from "lucide-react";
import { useCurrentUser } from "@/app/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";

type CurrentUser = {
    userId?: string;
    landlordId?: string;
    role?: string;
    fname?: string;
    lname?: string;
    email?: string;
    Dob?: string;
    isVerifird?: boolean;
};

const roleLabel: Record<string, string> = {
    ROLE_USER: "Tenant",
    ROLE_LANDLORD: "Landlord",
    ROLE_ADMIN: "Administrator",
};

export default function ProfilePage() {
    const { data, isPending, isError } = useCurrentUser();
    const user = ((data as { data?: CurrentUser } | undefined)?.data ?? {}) as CurrentUser;

    const fullName = [user.fname, user.lname].filter(Boolean).join(" ") || "Your account";
    const initials =
        [user.fname?.[0], user.lname?.[0]].filter(Boolean).join("").toUpperCase() || "U";
    const verified = !!user.isVerifird;

    if (isPending) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 px-6 max-w-3xl mx-auto">
                <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-6 h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Could not load your profile. Please try again.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
                {/* IDENTITY HEADER */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-black shrink-0">
                            {initials}
                        </div>
                        <div className="space-y-1.5 min-w-0">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">{fullName}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                {user.role && (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                                        {roleLabel[user.role] ?? user.role}
                                    </span>
                                )}
                                {verified ? (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ACCOUNT DETAILS */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Details</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: UserIcon, label: "First name", value: user.fname || "—" },
                            { icon: UserIcon, label: "Last name", value: user.lname || "—" },
                            { icon: Mail, label: "Email", value: user.email || "—" },
                            { icon: Calendar, label: "Date of birth", value: user.Dob || "—" },
                        ].map((row) => (
                            <div key={row.label} className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
                                <dt className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <row.icon className="w-3.5 h-3.5" /> {row.label}
                                </dt>
                                <dd className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{row.value}</dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* VERIFICATION / QUICK LINKS */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-2 shadow-sm">
                    {!verified && (
                        <Link
                            href="/kyc"
                            className="flex items-center justify-between gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                                    <ShieldCheck className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Verify your identity (KYC)</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Complete verification to unlock all features.</p>
                                </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        </Link>
                    )}
                    <Link
                        href="/booking"
                        className="flex items-center justify-between gap-3 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                                <Home className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">My viewing requests</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Track the room tours you&apos;ve scheduled.</p>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                    </Link>
                </section>

                {/* SIGN OUT */}
                <div className="flex justify-end">
                    <LogoutButton
                        label="Sign out"
                        showIcon
                        className="inline-flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 border border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-800 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl transition-all"
                    />
                </div>
            </main>
        </div>
    );
}
