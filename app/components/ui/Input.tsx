"use client";

import React, { forwardRef } from "react";

type InputType = "text" | "email" | "password" | "number" | "date";

type InputProps = {
    label?: string;
    type?: InputType;
    placeholder?: string;
    name?: string;
    className?: string;
    value?: string | number | undefined;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    page?: "login" | "signup";
}

export default function Input({
    label,
    type,
    name,
    placeholder,
    value,
    onChange,
    page
}: InputProps) {
    return (
        <div className="flex gap-y-2 flex-col w-full mt-4">
            <div className={
                label == "password" || label == "PASSWORD" ? "flex items-center justify-between" : ""
            }>
                {label && <label htmlFor={name} className="text-[10px] text-gray-500  font-semibold font-stretch-extra-condensed">{label}</label>}
                {label?.toLocaleLowerCase() === "password" && page === "login" && <a href="#" className="text-[10px] text-indigo-500 font-semibold font-stretch-extra-condensed hover:underline">Forgot password?</a>}
            </div>
            <input
                type={type}
                name={name}
                placeholder={placeholder}
                value={value ?? ""}
                onChange={onChange}
                className="
                w-full h-9 px-3
                text-sm text-gray-800 bg-white
                rounded-lg border border-gray-200
                placeholder:text-sm placeholder:text-gray-300
                hover:border-gray-300
                focus:outline-none focus:border-indigo-400 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.15)]
                transition-all duration-200
            "
            />
        </div>
    )
}