"use client";

import React, { useEffect, useState } from "react";
import {
    User,
    MapPin,
    FileImage,
    Camera,
    Check,
    ArrowRight,
    ArrowLeft,
    UploadCloud,
    FileText,
    AlertCircle
} from "lucide-react";
import { useSubmitKyc } from "../hooks/useAuth";

export default function KycForm() {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const query = useSubmitKyc();

    // Unified State Mapping initialized with your exact customer payload structure
    const [formData, setFormData] = useState({
        customerId: "1beecb10-5543-48a8-a481-480e12345678",
        personalInfo: {
            firstName: "Ram",
            lastName: "Rai",
            middleName: "Khal",
            dateOfBirth: "1999-11-01",
            gender: "MALE"
        },
        document: {
            documentType: "NATIONAL_ID",
            documentNumber: "" // Ready for input
        },
        address: {
            addressLine1: "Badikhel",
            addressLine2: "Badikhel",
            city: "Lalitpur",
            state: "Lal",
            postalCode: "21JKL",
            country: "NP"
        },
        contact: {
            phoneNumber: "+977986097265",
            alternatePhone: "+9779800992021"
        }
    });

    useEffect(() => {
    }, []);

    // Dedicated states to manage your three verification file uploads
    const [files, setFiles] = useState({
        frontImage: null as string | null,
        backImage: null as string | null,
        selfie: null as string | null,
    });

    const handleNestedChange = (section: string, field: string, value: string) => {
        setFormData((prev: any) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    // Simulates file selection for testing purposes
    const simulateFileUpload = (slot: "frontImage" | "backImage" | "selfie", filename: string) => {
        setFiles(prev => ({ ...prev, [slot]: filename }));
    };

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        if (currentStep < 4) {
            setCurrentStep(prev => prev + 1);
        } else {
            console.log("Submitting structured KYC Data Layer:", { ...formData, files });
            const response = query.mutate({ ...formData, ...files });
            console.log("KYC submission response:", response);
            setIsSubmitted(true);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const steps = [
        { id: 1, label: "Identity & Contact", icon: User },
        { id: 2, label: "Address Layer", icon: MapPin },
        { id: 3, label: "Document Assets", icon: FileImage },
        { id: 4, label: "Biometric Selfie", icon: Camera },
    ];

    if (isSubmitted) {
        return (
            <div className="max-w-xl mx-auto bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/50 my-12">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-600 mb-6">
                    <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">KYC Transmission Successful</h2>
                <p className="text-sm text-slate-500 font-medium mt-2 leading-relaxed max-w-sm mx-auto">
                    Verification payload for Customer ID <code className="text-xs font-mono bg-slate-50 p-1 text-slate-700 rounded">{formData.customerId.slice(0, 8)}...</code> is processing.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200/60 rounded-3xl shadow-xl shadow-slate-100/40 overflow-hidden my-15">

            {/* PROGRESS TRACKER */}
            <div className="bg-slate-50/70 border-b border-slate-100 px-6 py-5 sm:px-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, idx) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;

                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex flex-col items-center gap-1.5 relative z-10">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border transition-all ${isCompleted ? "bg-indigo-600 border-indigo-600 text-white" : isActive ? "bg-white border-indigo-600 text-indigo-600 ring-4 ring-indigo-50" : "bg-white border-slate-200 text-slate-400"
                                        }`}>
                                        {isCompleted ? <Check className="w-4 h-4 stroke-[2.5]" /> : step.id}
                                    </div>
                                    <span className={`text-[10px] font-bold tracking-wide uppercase hidden sm:block ${isActive ? "text-indigo-600" : "text-slate-400"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 bg-slate-100 relative">
                                        <div className="absolute top-0 left-0 h-full bg-indigo-600 transition-all duration-300" style={{ width: isCompleted ? "100%" : "0%" }}></div>
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
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Personal Information</h3>
                            <p className="text-xs text-slate-400 font-medium">Customer Base Identity Register.</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">First Name</label>
                                <input type="text" value={formData.personalInfo.firstName} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Middle Name</label>
                                <input type="text" value={formData.personalInfo.middleName} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Last Name</label>
                                <input type="text" value={formData.personalInfo.lastName} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Date of Birth</label>
                                <input type="text" disabled value={formData.personalInfo.dateOfBirth} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Gender</label>
                                <input type="text" disabled value={formData.personalInfo.gender} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="h-px bg-slate-100 my-2" />

                        <div>
                            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Contact Communication</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Primary Phone</label>
                                <input type="text" disabled value={formData.contact.phoneNumber} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Alternate Phone</label>
                                <input type="text" disabled value={formData.contact.alternatePhone} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 2: ADDRESS PROFILE LAYER */}
                {currentStep === 2 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Address Details</h3>
                            <p className="text-xs text-slate-400 font-medium">Verified local registry address values.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Address Line 1</label>
                                <input type="text" disabled value={formData.address.addressLine1} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Address Line 2</label>
                                <input type="text" disabled value={formData.address.addressLine2} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">City</label>
                                <input type="text" disabled value={formData.address.city} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">State</label>
                                <input type="text" disabled value={formData.address.state} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Postal Code</label>
                                <input type="text" disabled value={formData.address.postalCode} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Country ISO</label>
                            <input type="text" disabled value={formData.address.country} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed" />
                        </div>
                    </div>
                )}

                {/* STEP 3: DOCUMENT ASSETS (FRONT & BACK IMAGES) */}
                {currentStep === 3 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Document Image Uploads</h3>
                            <p className="text-xs text-slate-400 font-medium">Provide clear, legible photos of your {formData.document.documentType.replace("_", " ")}.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Document Identification Number</label>
                            <input
                                type="text"
                                required
                                value={formData.document.documentNumber}
                                onChange={(e) => handleNestedChange("document", "documentNumber", e.target.value)}
                                placeholder="Enter your document identifier serial"
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50"
                            />
                        </div>

                        {/* TWO COLUMN UPLOAD SYSTEM (FRONT AND BACK SEPARATORS) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">

                            {/* FRONT IMAGE SLOT */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Front Image of Doc</span>
                                <div
                                    onClick={() => simulateFileUpload("frontImage", "national_id_front.jpg")}
                                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${files.frontImage ? "bg-indigo-50/20 border-indigo-500/40" : "bg-slate-50/50 border-slate-200 hover:border-indigo-500/40"
                                        }`}
                                >
                                    <UploadCloud className={`w-6 h-6 mx-auto mb-1.5 ${files.frontImage ? "text-indigo-600" : "text-slate-400"}`} />
                                    {files.frontImage ? (
                                        <div className="flex items-center justify-center gap-1 text-xs text-indigo-700 font-bold">
                                            <Check className="w-3.5 h-3.5" /> {files.frontImage}
                                        </div>
                                    ) : (
                                        <span className="text-[11px] font-bold text-slate-600 block">Click to upload front side</span>
                                    )}
                                </div>
                            </div>

                            {/* BACK IMAGE SLOT */}
                            <div className="space-y-2">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Back Image of Doc</span>
                                <div
                                    onClick={() => simulateFileUpload("backImage", "national_id_back.jpg")}
                                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${files.backImage ? "bg-indigo-50/20 border-indigo-500/40" : "bg-slate-50/50 border-slate-200 hover:border-indigo-500/40"
                                        }`}
                                >
                                    <UploadCloud className={`w-6 h-6 mx-auto mb-1.5 ${files.backImage ? "text-indigo-600" : "text-slate-400"}`} />
                                    {files.backImage ? (
                                        <div className="flex items-center justify-center gap-1 text-xs text-indigo-700 font-bold">
                                            <Check className="w-3.5 h-3.5" /> {files.backImage}
                                        </div>
                                    ) : (
                                        <span className="text-[11px] font-bold text-slate-600 block">Click to upload back side</span>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Hard-validation alert feedback mapping block */}
                        {(!files.frontImage || !files.backImage) && (
                            <div className="flex gap-2 text-slate-400 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <FileText className="w-4 h-4 shrink-0 text-slate-400" />
                                <p className="text-[10px] font-medium leading-relaxed">Both document assets must be attached to move forward in the validation engine.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 4: SELFIE VERIFICATION & REVIEW */}
                {currentStep === 4 && (
                    <div className="space-y-5 animate-fadeIn">
                        <div>
                            <h3 className="text-base font-bold text-slate-900">Biometric Selfie Matching</h3>
                            <p className="text-xs text-slate-400 font-medium">Please provide a clear portrait image holding your document up close to verify physical presence match parameters.</p>
                        </div>

                        {/* BIOMETRIC SELFIE SLOT */}
                        <div
                            onClick={() => simulateFileUpload("selfie", "live_user_selfie.jpg")}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all max-w-md mx-auto ${files.selfie ? "bg-indigo-50/20 border-indigo-500" : "bg-slate-50/50 border-slate-200 hover:border-indigo-500"
                                }`}
                        >
                            <Camera className={`w-10 h-10 mx-auto mb-2.5 ${files.selfie ? "text-indigo-600" : "text-slate-400"}`} />
                            {files.selfie ? (
                                <div className="space-y-1">
                                    <span className="inline-flex items-center gap-1 text-xs text-indigo-700 font-bold bg-indigo-50 px-2.5 py-1 rounded-full">
                                        <Check className="w-3.5 h-3.5" /> Verified Frame Linked
                                    </span>
                                    <p className="text-[11px] font-medium text-slate-400 mt-1">{files.selfie}</p>
                                </div>
                            ) : (
                                <div>
                                    <span className="text-xs font-bold text-slate-700 block">Capture Portrait Frame or Upload Selfie</span>
                                    <span className="text-[10px] font-medium text-slate-400 block mt-1">Ensure face framework details remain unobstructed.</span>
                                </div>
                            )}
                        </div>

                        {/* REVIEW BLOCK PRIOR TO EXECUTION */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-[11px] font-medium space-y-1.5 text-slate-600">
                            <span className="text-slate-400 uppercase font-bold text-[9px] tracking-wider block mb-1">Verify Payload Map</span>
                            <div>Customer Signature: <strong className="text-slate-800">{formData.personalInfo.firstName} {formData.personalInfo.middleName} {formData.personalInfo.lastName}</strong></div>
                            <div>ID Context: <strong className="text-slate-800">{formData.document.documentType} ({formData.document.documentNumber || "Missing"})</strong></div>
                            <div className="flex gap-4 pt-1 text-[10px] border-t border-slate-200/60 mt-1">
                                <span className={files.frontImage ? "text-emerald-600" : "text-slate-400"}>✓ Front Image</span>
                                <span className={files.backImage ? "text-emerald-600" : "text-slate-400"}>✓ Back Image</span>
                                <span className={files.selfie ? "text-emerald-600" : "text-slate-400"}>✓ Selfie Frame</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTROLS BAR */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${currentStep === 1 ? "opacity-0 pointer-events-none" : "text-slate-500 hover:text-slate-700 bg-slate-50 hover:bg-slate-100"
                            }`}
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Back
                    </button>

                    <button
                        type="submit"
                        disabled={currentStep === 3 && (!files.frontImage || !files.backImage) || currentStep === 4 && !files.selfie}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold px-5 py-2.5 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-100 transition-all"
                    >
                        {currentStep === 4 ? "Complete KYC Submission" : "Continue"}
                        <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

            </form>
        </div>
    );
}