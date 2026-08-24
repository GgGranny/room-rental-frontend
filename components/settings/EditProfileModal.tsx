"use client";

import { useState } from "react";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useMyProfile, useUpdateProfile } from "@/app/hooks/useAuth";

// Edit the editable fields of the authenticated user's own profile
// (name, phone, date of birth) via PUT /api/v1/profile.
// Parent remounts this modal (via key) each time it opens, so form fields are
// seeded from the cached profile without effects.
export default function EditProfileModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const { data } = useMyProfile();
    const profile = data?.data;
    const updateProfile = useUpdateProfile();

    const [fname, setFname] = useState(profile?.fname ?? "");
    const [lname, setLname] = useState(profile?.lname ?? "");
    const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber ?? "");
    const [dateOfBirth, setDateOfBirth] = useState(profile?.dateOfBirth ?? "");

    if (!open) return null;

    const submit = async () => {
        const phoneDigits = phoneNumber.replace(/\D/g, "");
        if (phoneDigits && phoneDigits.length !== 10) {
            toast.error("Phone number must be exactly 10 digits.");
            return;
        }
        try {
            await updateProfile.mutateAsync({
                fname: fname.trim(),
                lname: lname.trim(),
                phoneNumber: phoneDigits || undefined,
                dateOfBirth: dateOfBirth || undefined,
            });
            toast.success("Profile updated successfully");
            onClose();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not update profile.");
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
                <div className="flex items-start justify-between">
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Edit Profile</h3>
                    <button
                        onClick={onClose}
                        aria-label="Close"
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label htmlFor="edit-fname" className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">First name</label>
                            <input
                                id="edit-fname"
                                type="text"
                                value={fname}
                                onChange={(e) => setFname(e.target.value)}
                                maxLength={50}
                                placeholder="First name"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="edit-lname" className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Last name</label>
                            <input
                                id="edit-lname"
                                type="text"
                                value={lname}
                                onChange={(e) => setLname(e.target.value)}
                                maxLength={50}
                                placeholder="Last name"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="edit-phone" className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Phone number</label>
                        <input
                            id="edit-phone"
                            type="tel"
                            inputMode="numeric"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            maxLength={10}
                            placeholder="98XXXXXXXX"
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="edit-dob" className="text-[11px] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase">Date of birth</label>
                        <input
                            id="edit-dob"
                            type="date"
                            value={dateOfBirth || ""}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <p className="text-xs text-slate-400 dark:text-slate-500">
                        Email addresses cannot be changed. Contact support if you need to update it.
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-1">
                    <button
                        onClick={onClose}
                        disabled={updateProfile.isPending}
                        className="text-sm font-bold px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submit}
                        disabled={updateProfile.isPending}
                        className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-60"
                    >
                        {updateProfile.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                        Save changes
                    </button>
                </div>
            </div>
        </div>
    );
}
