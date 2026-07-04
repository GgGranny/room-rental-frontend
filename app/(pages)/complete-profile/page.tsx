"use client";

import React, { useEffect, useState } from "react";
import { User, Home, Check, ArrowLeft, ChevronLeft } from "lucide-react";
import { useCompleteProfile, useCurrentUser } from "@/app/hooks/useAuth";

export type CompleteProfileType = {
    userId: string;
    role: "ROLE_USER" | "ROLE_LANDLORD";
    fname: string;
    lname: string;
    dob: string;
};

export default function MultiStepOnboarding() {
    const [step, setStep] = useState<number>(1);
    const { isPending, data, isError, error } = useCurrentUser();
    const [formData, setFormData] = useState<CompleteProfileType>({
        userId: "",
        role: "ROLE_USER",
        fname: "",
        lname: "",
        dob: "",
    });
    const completeProfileMutation = useCompleteProfile();

    useEffect(() => {
        console.log("Current user data complete profile:", data);
        if ((data as any)?.data?.userId) {
            setFormData((prev) => ({
                ...prev,
                userId: (data as any).data.userId
            }));
        }
    }, [data])

    const handleRoleSelect = (role: "ROLE_USER" | "ROLE_LANDLORD") => {
        setFormData((prev) => ({ ...prev, role }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = () => {
        if (step < 3) setStep((prev) => prev + 1);
        else {
            const response: any = completeProfileMutation.mutate(formData);
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);
            console.log("Profile completion response:", response.data);
        }
    };

    const handleBack = () => {
        if (step > 1) setStep((prev) => prev - 1);
    };

    return (
        <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-800 selection:bg-indigo-500 selection:text-white">

            {/* HEADER */}
            <header className="px-6 py-4 md:px-12 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-xl tracking-tight cursor-pointer">
                    <ChevronLeft className="w-5 h-5 text-indigo-600" />
                    <span>RoomEase</span>
                </div>

                {/* Dynamic Step Indicator */}
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                        <span className={`w-1 h-1 rounded-full ${step >= 1 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
                        <span className={`w-1 h-1 rounded-full ${step >= 2 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
                        <span className={`w-1 h-1 rounded-full ${step >= 3 ? 'bg-indigo-600' : 'bg-slate-200'}`}></span>
                    </div>
                    <span className="text-xs text-slate-400 tracking-wider uppercase font-semibold">Step {step} of 3</span>
                </div>

                <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600">
                    <a href="#" className="hover:text-indigo-600 transition-colors">How it works</a>
                    <a href="#" className="hover:text-indigo-600 transition-colors">Contact Support</a>
                </div>
            </header>

            {/* MAIN FORM BODY */}
            <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 max-w-4xl mx-auto w-full transition-all duration-300">

                {/* STEP 1: CHOOSE ROLE */}
                {step === 1 && (
                    <div className="w-full text-center animate-fadeIn">
                        <h1 className="text-2xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Choose your role
                        </h1>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 text-xs md:text-base">
                            This helps us personalize your experience and show you relevant properties
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto w-full mb-8">
                            {/* Tenant Card */}
                            <div
                                onClick={() => handleRoleSelect("ROLE_USER")}
                                className={`relative p-6 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 bg-white ${formData.role === "ROLE_USER"
                                    ? "border-indigo-600 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50"
                                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                                    }`}
                            >
                                {formData.role === "ROLE_USER" && (
                                    <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                )}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${formData.role === "ROLE_USER" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <User className="w-6 h-6" />
                                </div>
                                <h3 className="text-md font-bold text-slate-900 mb-1">Tenant</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    Find and rent rooms easily with verified listings
                                </p>
                            </div>

                            {/* Landlord Card */}
                            <div
                                onClick={() => handleRoleSelect("ROLE_LANDLORD")}
                                className={`relative p-6 rounded-2xl border-2 text-left cursor-pointer transition-all duration-200 bg-white ${formData.role === "ROLE_LANDLORD"
                                    ? "border-indigo-600 shadow-lg shadow-indigo-100 ring-4 ring-indigo-50"
                                    : "border-slate-200/80 hover:border-slate-300 hover:shadow-md"
                                    }`}
                            >
                                {formData.role === "ROLE_LANDLORD" && (
                                    <div className="absolute top-4 right-4 bg-indigo-600 text-white rounded-full p-1">
                                        <Check className="w-3 h-3 stroke-[3]" />
                                    </div>
                                )}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors ${formData.role === "ROLE_LANDLORD" ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                                    <Home className="w-6 h-6" />
                                </div>
                                <h3 className="text-md font-bold text-slate-900 mb-1">Landlord</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">
                                    List and manage your properties with ease
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: FIRST & LAST NAME INPUT */}
                {step === 2 && (
                    <div className="w-full max-w-md text-center animate-fadeIn">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                            What is your name?
                        </h1>
                        <p className="text-slate-500 mb-8 text-sm">
                            Please provide your legal name for identification and verification purposes.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left w-full mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="fname"
                                    value={formData.fname}
                                    onChange={handleInputChange}
                                    placeholder="Jane"
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white shadow-sm placeholder:text-slate-400 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lname"
                                    value={formData.lname}
                                    onChange={handleInputChange}
                                    placeholder="Doe"
                                    className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white shadow-sm placeholder:text-slate-400 text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: DATE OF BIRTH INPUT */}
                {step === 3 && (
                    <div className="w-full max-w-md text-center animate-fadeIn">
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                            When were you born?
                        </h1>
                        <p className="text-slate-500 mb-8 text-sm">
                            You must meet legal age limits to safely book or host spaces on our platform.
                        </p>
                        <div className="text-left w-full mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3.5 border border-slate-200 rounded-xl bg-white shadow-sm text-slate-800 font-medium focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 transition-all"
                            />
                        </div>
                    </div>
                )}

                {/* CONTROLS (Next, Continue, Back) */}
                <div className="w-full max-w-md flex flex-col items-center gap-4">
                    <button
                        onClick={handleNext}
                        disabled={
                            (step === 2 && (!formData.fname.trim() || !formData.lname.trim())) ||
                            (step === 3 && !formData.dob.trim())
                        }
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-indigo-200 text-center"
                    >
                        {step === 3 ? "Complete Registration" : "Continue"}
                    </button>

                    {step > 1 ? (
                        <button
                            onClick={handleBack}
                            className="flex items-center gap-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors py-1"
                        >
                            <ArrowLeft className="w-4 h-4" /> Go back to previous step
                        </button>
                    ) : (
                        <a href="#" className="flex items-center gap-2 text-sm text-indigo-600 font-semibold hover:text-indigo-700 transition-colors py-1">
                            <ArrowLeft className="w-4 h-4 stroke-[2.5]" /> Back to login
                        </a>
                    )}
                </div>
            </main>

            {/* FOOTER */}
            <footer className="w-full border-t border-slate-100 bg-white py-6 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400">
                <div>
                    <span className="font-bold text-slate-600 mr-2">RoomEase</span>
                    <span>© 2026 RoomEase Inc. All rights reserved.</span>
                </div>
                <div className="flex items-center gap-6">
                    <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 transition-colors">Help Center</a>
                </div>
            </footer>
        </div>
    );
}