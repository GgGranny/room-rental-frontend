"use client";

import React, { useState } from "react";
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
    Pencil,
    Phone,
} from "lucide-react";
import { useMyProfile } from "@/app/hooks/useAuth";
import LogoutButton from "@/components/LogoutButton";
import AvatarPicker from "@/components/settings/AvatarPicker";
import ConfirmDialog from "@/components/settings/ConfirmDialog";
import EditProfileModal from "@/components/settings/EditProfileModal";

const roleLabel: Record<string, string> = {
    ROLE_USER: "Tenant",
    ROLE_LANDLORD: "Landlord",
    ROLE_ADMIN: "Administrator",
};

export default function ProfilePage() {
    const { data, isPending, isError } = useMyProfile();
    const user = data?.data;
    const [editOpen, setEditOpen] = useState(false);
    const [signOutOpen, setSignOutOpen] = useState(false);

    if (isPending) {
        return (
            <div className="pt-24 px-6 max-w-3xl mx-auto" aria-busy="true">
                <div className="h-40 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="mt-6 h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">Could not load your profile. Please try again.</p>
            </div>
        );
    }

    const fullName = [user.fname, user.lname].filter(Boolean).join(" ") || "Your account";

    return (
        <>
            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
                {/* IDENTITY HEADER */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                        <AvatarPicker size="lg" />
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">{fullName}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                {user.role && (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                                        {roleLabel[user.role] ?? user.role}
                                    </span>
                                )}
                                {user.verified ? (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
                                        <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                    </span>
                                ) : (
                                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1">
                                        <ShieldAlert className="w-3.5 h-3.5" /> Unverified
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => setEditOpen(true)}
                            className="inline-flex items-center justify-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all self-start sm:self-center"
                        >
                            <Pencil className="w-4 h-4" /> Edit Profile
                        </button>
                    </div>
                </section>

                {/* ACCOUNT DETAILS */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Details</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: UserIcon, label: "Full name", value: fullName },
                            { icon: Mail, label: "Email", value: user.email || "—" },
                            { icon: Phone, label: "Phone", value: user.phoneNumber || "Not provided" },
                            { icon: Calendar, label: "Date of birth", value: user.dateOfBirth || "—" },
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
                    {!user.kycSubmitted && user.role !== "ROLE_ADMIN" && (
                        <Link
                            href={user.role === "ROLE_LANDLORD" ? "/landlord/kyc" : "/kyc"}
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
                    <button
                        onClick={() => setSignOutOpen(true)}
                        className="inline-flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl transition-all"
                    >
                        Sign out
                    </button>
                </div>
            </main>

            <EditProfileModal key={editOpen ? "open" : "closed"} open={editOpen} onClose={() => setEditOpen(false)} />

            <ConfirmDialog
                open={signOutOpen}
                title="Are you sure you want to sign out?"
                message="You will be returned to the login page."
                destructive
                onCancel={() => setSignOutOpen(false)}
                onConfirm={() => setSignOutOpen(false)}
                confirmSlot={
                    // Existing logout flow: removes FCM token, clears auth cookies,
                    // redirects to /login.
                    <span onClick={() => setSignOutOpen(false)}>
                        <LogoutButton
                            label="Sign Out"
                            showIcon={false}
                            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-60"
                        />
                    </span>
                }
            />
        </>
    );
}
