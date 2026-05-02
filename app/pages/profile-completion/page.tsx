"use client";
import { useState } from "react";
import { roles } from "@/app/utils/Roles";

type FormData = {
    role: string;
    fullName: string;
    dob: string;
}

export default function ProfileCompletionPage() {
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState<FormData>({
        role: "",
        fullName: "",
        dob: "",
    });

    const next = () => {
        console.log(formData);
        setStep((prev) => prev + 1);
    }
    const prev = () => {
        setStep((prev) => prev - 1);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        console.log(formData)
    }

    return (
        <div className="border h-screen flex justify-center items-center">
            {step === 1 && (
                <div className="flex flex-col items-center gap-5">
                    <h2 className="text-4xl font-semibold">Choose your role</h2>
                    <p className="text-sm text-gray-500 text-center">
                        This helps us personalize your experience <br />and show your relevent properties
                    </p>

                    <div className="flex gap-4">
                        {roles.map((item) => (
                            <div
                                key={item.id}
                                onClick={() =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        role: item.id,
                                    }))
                                }
                                className={`cursor-pointer border rounded-xl p-4 w-48 transition-all ${formData.role === item.id
                                    ? "border-indigo-500 bg-indigo-50"
                                    : "border-gray-200 hover:border-indigo-300"
                                    }`}
                            >
                                <h3 className="font-semibold">{item.title}</h3>
                                <p className="text-xs text-gray-500">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <button
                        disabled={!formData.role}
                        onClick={next}
                        className={`w-full max-w-xs py-2 rounded-lg text-white transition ${formData.role
                            ? "bg-indigo-600 hover:bg-indigo-700"
                            : "bg-gray-300 cursor-not-allowed"
                            }`}
                    >
                        Continue
                    </button>

                    <a href="#" className="text-xs text-indigo-500 hover:underline">
                        ← Back to login
                    </a>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col items-center gap-6">

                    {/* Title */}
                    <h2 className="text-xl font-semibold">Tell us about you</h2>
                    <p className="text-sm text-gray-500 text-center">
                        We’ll use this to personalize your profile
                    </p>

                    {/* Input */}
                    <div className="w-full max-w-xs flex flex-col gap-2">
                        <label className="text-[10px] text-gray-500 font-semibold">
                            FULL NAME
                        </label>

                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="w-full max-w-xs flex gap-2">
                        <button
                            onClick={prev}
                            className="w-1/3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            onClick={next}
                            disabled={!formData.fullName}
                            className={`w-2/3 py-2 rounded-lg text-white text-sm transition ${formData.fullName
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Continue
                        </button>
                    </div>

                </div>
            )}
            {step === 3 && (
                <div className="flex flex-col items-center gap-6">

                    {/* Title */}
                    <h2 className="text-xl font-semibold">Your date of birth</h2>
                    <p className="text-sm text-gray-500 text-center">
                        This helps us verify your eligibility
                    </p>

                    {/* Input */}
                    <div className="w-full max-w-xs flex flex-col gap-2">
                        <label className="text-[10px] text-gray-500 font-semibold">
                            DATE OF BIRTH
                        </label>

                        <input
                            type="date"
                            name="dob"
                            value={formData.dob || ""}
                            onChange={handleChange}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm
                            focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="w-full max-w-xs flex gap-2">
                        <button
                            onClick={prev}
                            className="w-1/3 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100"
                        >
                            Back
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={!formData.dob}
                            className={`w-2/3 py-2 rounded-lg text-white text-sm transition ${formData.dob
                                ? "bg-indigo-600 hover:bg-indigo-700"
                                : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Finish
                        </button>
                    </div>

                </div>
            )}
        </div>
    );
}