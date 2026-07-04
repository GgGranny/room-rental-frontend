"use client";

import CheckBox from "@/app/components/ui/CheckBox";
import ImageDisplay from "@/app/components/ui/ImageDisplay";
import Input from "@/app/components/ui/Input";
import { authService } from "@/app/services/authService";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";

export default function Signup() {

    const [data, setData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setData((prevData) => ({
            ...prevData,
            [name]: value
        }));
        console.log(name, value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            toast.error("Password and confirm password do not match");
            return;
        }
        try {
            const response = await authService.signup({ email: data.email, password: data.password });
            toast.success("Signup successful!");
            console.log("Signup successful:", response);
        } catch (error) {
            toast.error("An error occurred while signing up");
            throw new Error("Signup failed");
        }
    }
    return (
        <div className=" flex w-full h-screen max-h-screen">
            <div className="left-container w-1/2 max-w-full h-full ">
                <ImageDisplay
                    src="/login-home-image.jpg"
                    alt="login image"
                    fill={true}
                    loading="eager"
                />
            </div>
            <div className="right-container max-w-full w-1/2 px-20 h-full flex items-center justify-center">
                <form className="w-[75%] mx-auto  max-w-xl flex flex-col gap-3 " onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-y-1">
                        <h1 className="text-2xl font-bold">Create Account</h1>
                        <p className="text-xs text-gray-500">Fill in the details below to create your account</p>
                        <div className="mt-4">
                            <button className="flex items-center justify-center gap-2 bg-[#EFF4FF] text-gray-800 text-xs font-normal px-4 py-2 rounded-md w-full h-10 hover:cursor-pointer"><FcGoogle size={15} /> Sign in with Google</button>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 h-px bg-gray-300"></div>
                        <span className="text-gray-400 text-xs">OR SIGN IN WITH EMAIL</span>
                        <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <div>
                        <Input label="EMAIL ADDRESS" type="email" name="email" value={data.email} placeholder="john.doe@example.com" onChange={handleOnChange} />
                        <Input label="PASSWORD" type="password" name="password" value={data.password} placeholder="Enter your password" onChange={handleOnChange} />
                        <Input label="CONFIRM PASSWORD" type="password" name="confirmPassword" value={data.confirmPassword} placeholder="Confirm your password" onChange={handleOnChange} />
                    </div>
                    <div className="flex flex-col gap-y-5 mt-3 ">
                        <CheckBox label="I agree to the Terms and Conditions" name="terms" />
                        <input className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-3xl w-full" type="submit" value="Sign Up" />
                    </div>
                    <div>
                        <p className="text-center text-[12px] text-gray-500 mt-4">Already have an account? <a href="#" className="text-indigo-500 hover:underline font-bold">Sign In</a></p>
                    </div>
                </form >
            </div>
        </div>
    )

}