"use client";

import React, { useEffect, useRef, useState } from "react";
import {
    User,
    MapPin,
    FileImage,
    Camera,
    Check,
    ArrowRight,
    ArrowLeft,
    UploadCloud,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useSubmitKyc, useCurrentUser, useMyKyc } from "@/app/hooks/useAuth";

type FileSlot = "frontImage" | "backImage" | "selfieImage";

const DOCUMENT_TYPES = [
    { value: "NATIONAL_ID", label: "National ID" },
    { value: "CITIZENSHIP", label: "Citizenship" },
    { value: "PASSPORT", label: "Passport" },
    { value: "DRIVERS_LICENSE", label: "Driver's License" },
];

const E164 = /^\+[1-9]\d{7,14}$/;

export default function KycForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const submitKyc = useSubmitKyc();
    const { data: userData } = useCurrentUser();
    const { data: kycResponse, isLoading: isKycLoading } = useMyKyc();

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        middleName: "",
        dateOfBirth: "",
        gender: "MALE",
        documentType: "NATIONAL_ID",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        postalCode: "",
        country: "NP",
        phoneNumber: "",
        alternatePhone: "",
    });

    const [files, setFiles] = useState<Record<FileSlot, File | null>>({
        frontImage: null,
        backImage: null,
        selfieImage: null,
    });

    const inputRefs = {
        frontImage: useRef<HTMLInputElement>(null),
        backImage: useRef<HTMLInputElement>(null),
        selfieImage: useRef<HTMLInputElement>(null),
    };

    // Prefill legal name / DOB from the signed-in user (still editable for KYC).
    useEffect(() => {
        const u = (userData as { data?: { fname?: string; lname?: string; Dob?: string } } | undefined)?.data;
        if (!u) return;
        setForm((prev) => ({
            ...prev,
            firstName: prev.firstName || u.fname || "",
            lastName: prev.lastName || u.lname || "",
            dateOfBirth: prev.dateOfBirth || (u.Dob ? u.Dob.slice(0, 10) : ""),
        }));
    }, [userData]);

    const change = (field: keyof typeof form, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const pickFile = (slot: FileSlot, file?: File | null) =>
        setFiles((prev) => ({ ...prev, [slot]: file ?? null }));

    const steps = [
        { id: 1, label: "Identity & Contact", icon: User },
        { id: 2, label: "Address", icon: MapPin },
        { id: 3, label: "Document", icon: FileImage },
        { id: 4, label: "Selfie", icon: Camera },
    ];

    const step1Valid = form.firstName.trim() && form.lastName.trim() && form.dateOfBirth && E164.test(form.phoneNumber) && (!form.alternatePhone || E164.test(form.alternatePhone));
    const step2Valid = form.addressLine1.trim() && form.city.trim() && form.postalCode.trim() && form.country.trim().length >= 2;
    const step3Valid = !!files.frontImage;
    const step4Valid = !!files.selfieImage;

    const customerId = (userData as { data?: { userId?: string } } | undefined)?.data?.userId ?? "";

    const submit = async () => {
        if (!customerId) {
            toast.error("We couldn't identify your account. Please sign in again.");
            return;
        }
        const kycData = {
            customerId,
            personalInfo: {
                firstName: form.firstName.trim(),
                lastName: form.lastName.trim(),
                middleName: form.middleName.trim() || undefined,
                dateOfBirth: form.dateOfBirth,
                gender: form.gender,
            },
            document: { documentType: form.documentType },
            address: {
                addressLine1: form.addressLine1.trim(),
                addressLine2: form.addressLine2.trim() || undefined,
                city: form.city.trim(),
                state: form.state.trim() || undefined,
                postalCode: form.postalCode.trim(),
                country: form.country.trim().toUpperCase(),
            },
            contact: {
                phoneNumber: form.phoneNumber.trim(),
                alternatePhone: form.alternatePhone.trim() || undefined,
            },
        };

        const fd = new FormData();
        fd.append("kycData", JSON.stringify(kycData));
        if (files.frontImage) fd.append("frontImage", files.frontImage);
        if (files.backImage) fd.append("backImage", files.backImage);
        if (files.selfieImage) fd.append("selfieImage", files.selfieImage);

        try {
            await submitKyc.mutateAsync(fd);
            setIsSubmitted(true);
            toast.success("KYC submitted. We'll review your documents shortly.");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "KYC submission failed. Please try again.");
        }
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 4) setCurrentStep((s) => s + 1);
        else submit();
    };

    const handleBack = () => currentStep > 1 && setCurrentStep((s) => s - 1);

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/50 dark:shadow-none my-24">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-6">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">KYC Submitted</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
                    Your verification is now pending review. You&apos;ll be notified once an administrator approves it.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl shadow-xl shadow-slate-100/40 dark:shadow-none overflow-hidden my-24">
            {/* Kyc Already submitted */}
            {
                kycResponse && (
                    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/50 dark:shadow-none my-24">
                        <div className="w-16 h-5 bg-emerald-50 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto text-emerald-600 dark:text-emerald-400 mb-6">
                            <Check className="w-8 h-8 stroke-[2.5]" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">KYC Submitted</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
                            Your verification is now pending review. You&apos;ll be notified once an administrator approves it.
                        </p>
                    </div>
                )
            }

            {/* PROGRESS TRACKER */}
            <div className="bg-slate-50/70 dark:bg-slate-950/40 border-b border-slate-100 dark:border-slate-800 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, idx) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-1.5 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${isCompleted ? "bg-indigo-600 border-indigo-600 text-white" : isActive ? "bg-white dark:bg-slate-900 border-indigo-600 text-indigo-600 dark:text-indigo-400 ring-4 ring-indigo-50 dark:ring-indigo-950/40" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"}`}>
                                        {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.id}
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-wide uppercase hidden sm:block ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 bg-slate-100 dark:bg-slate-800 relative">
                                        <div className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300" style={{ width: isCompleted ? "100%" : "0%" }} />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleNext} className="p-6 sm:p-8 space-y-6">
                {/* STEP 1: IDENTITY & CONTACT */}
                {currentStep === 1 && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Personal Information</h3>
                            <p className="text-xs text-slate-400 font-medium">Enter your legal identity details exactly as on your document.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="First Name" required value={form.firstName} onChange={(v) => change("firstName", v)} placeholder="Ram" />
                            <Field label="Middle Name" value={form.middleName} onChange={(v) => change("middleName", v)} placeholder="Optional" />
                            <Field label="Last Name" required value={form.lastName} onChange={(v) => change("lastName", v)} placeholder="Rai" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date of Birth</label>
                                <input type="date" value={form.dateOfBirth} onChange={(e) => change("dateOfBirth", e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Gender</label>
                                <select value={form.gender} onChange={(e) => change("gender", e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600">
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="h-px bg-slate-100 dark:bg-slate-800 my-2" />
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Contact</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Primary Phone" required value={form.phoneNumber} onChange={(v) => change("phoneNumber", v)} placeholder="+9779XXXXXXXX" />
                            <Field label="Alternate Phone" value={form.alternatePhone} onChange={(v) => change("alternatePhone", v)} placeholder="Optional +977…" />
                        </div>
                        {form.phoneNumber && !E164.test(form.phoneNumber) && (
                            <p className="text-[11px] font-medium text-red-500">Use E.164 format, e.g. +9779812345678.</p>
                        )}
                    </div>
                )}
                {/* STEP 2: ADDRESS */}
                {currentStep === 2 && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Address</h3>
                            <p className="text-xs text-slate-400 font-medium">Your current residential address.</p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Field label="Address Line 1" required value={form.addressLine1} onChange={(v) => change("addressLine1", v)} placeholder="Street / Tole" />
                            <Field label="Address Line 2" value={form.addressLine2} onChange={(v) => change("addressLine2", v)} placeholder="Optional" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Field label="City" required value={form.city} onChange={(v) => change("city", v)} placeholder="Lalitpur" />
                            <Field label="State / Province" value={form.state} onChange={(v) => change("state", v)} placeholder="Bagmati" />
                            <Field label="Postal Code" required value={form.postalCode} onChange={(v) => change("postalCode", v)} placeholder="44700" />
                        </div>
                        <div className="sm:w-1/3">
                            <Field label="Country (ISO)" required value={form.country} onChange={(v) => change("country", v)} placeholder="NP" />
                        </div>
                    </div>
                )}

                {/* STEP 3: DOCUMENT */}
                {currentStep === 3 && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Identity Document</h3>
                            <p className="text-xs text-slate-400 font-medium">Upload clear, legible photos of your document.</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Type</label>
                            <select value={form.documentType} onChange={(e) => change("documentType", e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-600">
                                {DOCUMENT_TYPES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            <FileDrop label="Front of document" required file={files.frontImage} inputRef={inputRefs.frontImage} onPick={(f) => pickFile("frontImage", f)} />
                            <FileDrop label="Back of document" file={files.backImage} inputRef={inputRefs.backImage} onPick={(f) => pickFile("backImage", f)} />
                        </div>
                    </div>
                )}

                {/* STEP 4: SELFIE + REVIEW */}
                {currentStep === 4 && (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-slate-900 dark:text-white">Selfie Verification</h3>
                            <p className="text-xs text-slate-400 font-medium">Upload a clear portrait so we can match it to your document.</p>
                        </div>
                        <FileDrop label="Your selfie" required large file={files.selfieImage} inputRef={inputRefs.selfieImage} onPick={(f) => pickFile("selfieImage", f)} />
                        <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 text-[11px] font-medium space-y-1.5 text-slate-600 dark:text-slate-300">
                            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block mb-1">Review</span>
                            <div>Name: <strong className="text-slate-800 dark:text-slate-200">{[form.firstName, form.middleName, form.lastName].filter(Boolean).join(" ") || "—"}</strong></div>
                            <div>Document: <strong className="text-slate-800 dark:text-slate-200">{DOCUMENT_TYPES.find((d) => d.value === form.documentType)?.label}</strong></div>
                            <div className="flex gap-4 pt-1 text-[10px] border-t border-slate-200/60 dark:border-slate-800 mt-1">
                                <span className={files.frontImage ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>✓ Front</span>
                                <span className={files.backImage ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>✓ Back (optional)</span>
                                <span className={files.selfieImage ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400"}>✓ Selfie</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTROLS */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4">
                    <button type="button" onClick={handleBack} disabled={currentStep === 1} className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100"}`}>
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>
                    <button
                        type="submit"
                        disabled={
                            submitKyc.isPending ||
                            (currentStep === 1 && !step1Valid) ||
                            (currentStep === 2 && !step2Valid) ||
                            (currentStep === 3 && !step3Valid) ||
                            (currentStep === 4 && !step4Valid)
                        }
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-100 dark:shadow-none transition-all"
                    >
                        {submitKyc.isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                        {currentStep === 4 ? "Submit KYC" : "Continue"}
                        {currentStep < 4 && <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                </div>
            </form>
        </div>
    );
}

function Field({ label, value, onChange, placeholder, required }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
    return (
        <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {label}{required && <span className="text-red-400"> *</span>}
            </label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
            />
        </div>
    );
}

function FileDrop({
    label,
    file,
    onPick,
    inputRef,
    required,
    large,
}: {
    label: string;
    file: File | null;
    onPick: (f: File | null) => void;
    inputRef: React.RefObject<HTMLInputElement | null>;
    required?: boolean;
    large?: boolean;
}) {
    const previewUrl = file ? URL.createObjectURL(file) : null;
    useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

    return (
        <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {label}{required && <span className="text-red-400"> *</span>}
            </span>
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => onPick(e.target.files?.[0] ?? null)}
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={`w-full border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${large ? "p-8 max-w-md mx-auto block" : "p-4"} ${file ? "bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-500/40" : "bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 hover:border-indigo-500/40"}`}
            >
                {file && previewUrl ? (
                    <div className="space-y-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={previewUrl} alt={label} className={`mx-auto rounded-lg object-cover ${large ? "w-32 h-32" : "w-full h-24"}`} />
                        <div className="flex items-center justify-center gap-1 text-xs text-indigo-700 dark:text-indigo-400 font-bold">
                            <Check className="w-3.5 h-3.5" /> {file.name}
                        </div>
                    </div>
                ) : (
                    <>
                        <UploadCloud className={`${large ? "w-10 h-10" : "w-6 h-6"} mx-auto mb-1.5 text-slate-400`} />
                        <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block">Click to upload</span>
                    </>
                )}
            </button>
        </div>
    );
}
