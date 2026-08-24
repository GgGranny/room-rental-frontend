"use client";

import React, { useState } from "react";
import { BadgeCheck, Calendar, Mail, Pencil, Phone, ShieldAlert, User as UserIcon } from "lucide-react";
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

export default function SettingsProfilePage() {
    const { data, isPending, isError } = useMyProfile();
    const user = data?.data;
    const [editOpen, setEditOpen] = useState(false);

    if (isPending) {
        return (
            <div className="space-y-6" aria-busy="true">
                <div className="h-44 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
                <div className="h-56 rounded-3xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
            </div>
        );
    }

    if (isError || !user) {
        return (
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Could not load your profile. Please refresh the page and try again.
            </p>
        );
    }

    return (
        <>
            {/* IDENTITY HEADER */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                    <AvatarPicker size="xl" />
                    <div className="space-y-1.5 min-w-0 flex-1">
                        <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white truncate">
                            {[user.fname, user.lname].filter(Boolean).join(" ") || "Your account"}
                        </h2>
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
                <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">Click your profile picture to change it.</p>
            </section>

            {/* ACCOUNT DETAILS */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account Details</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: UserIcon, label: "Full name", value: [user.fname, user.lname].filter(Boolean).join(" ") || "—" },
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

            {/* SIGN OUT */}
            <SignOutCard />

            <EditProfileModal key={editOpen ? "open" : "closed"} open={editOpen} onClose={() => setEditOpen(false)} />
        </>
    );
}

// Sign out card with a confirmation dialog before logging out.
function SignOutCard() {
    const [confirmOpen, setConfirmOpen] = useState(false);

    return (
        <>
            <section className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div>
                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Sign out of this device</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">You will need to log in again to access your account.</p>
                </div>
                <button
                    onClick={() => setConfirmOpen(true)}
                    className="shrink-0 inline-flex items-center gap-2 text-sm font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/60 hover:bg-red-50 dark:hover:bg-red-950/30 px-4 py-2.5 rounded-xl transition-colors"
                >
                    Sign Out
                </button>
            </section>

            <ConfirmDialog
                open={confirmOpen}
                title="Are you sure you want to sign out?"
                message="You will be returned to the login page."
                destructive
                onCancel={() => setConfirmOpen(false)}
                onConfirm={() => setConfirmOpen(false)}
                confirmSlot={
                    // Reuses the existing logout flow (clears cookies + FCM token,
                    // redirects to /login). Clicking bubbles up to close the dialog.
                    <span onClick={() => setConfirmOpen(false)}>
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
