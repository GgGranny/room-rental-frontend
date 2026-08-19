"use client";

import React, { useState } from "react";
import { Mail, ArrowRight, Globe } from "lucide-react";
import { socialIcons } from "@/app/utils/SocialIcons";

export default function Footer() {
    const [email, setEmail] = useState("");

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Subscribed:", email);
        alert(`Thank you for subscribing with: ${email}`);
        setEmail("");
    };

    return (
        <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-sans">
            {/* TOP SECTION: BRAND & NEWSLETTER */}
            <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-slate-100 dark:border-slate-800">

                {/* Brand Description */}
                <div className="lg:col-span-5 space-y-4">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 tracking-tight block">RoomEase</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                        Simplifying property management, room discoveries, and modern hosting layouts across verified spaces worldwide.
                    </p>
                    {/* Social Links */}
                    <div className="flex items-center gap-4 pt-2">
                        {socialIcons.map((social, index) => {
                            const Icon = social.icon;
                            return (
                                <a
                                    key={index}
                                    href={social.href}
                                    className="p-2 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/50 rounded-lg transition-all duration-200"
                                >
                                    <Icon className="w-4 h-4 stroke-[2]" />
                                </a>
                            );
                        })}
                    </div>
                </div>

                {/* Newsletter Form */}
                <div className="lg:col-span-7 lg:justify-self-end w-full max-w-md space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">Stay updated</h4>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        Subscribe to our weekly digest for the latest architectural updates, market drops, and product feature releases.
                    </p>
                    <form onSubmit={handleSubscribe} className="relative w-full flex items-center mt-2">
                        <div className="relative w-full">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="w-full pl-11 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-600 dark:focus:border-indigo-500 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center shadow-md shadow-indigo-100 dark:shadow-indigo-900"
                            >
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* MIDDLE SECTION: LINK GRID MAP */}
            <div className="max-w-[1400px] mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-100 dark:border-slate-800">

                {/* Column 1 */}
                <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Explore</h5>
                    <ul className="space-y-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Premium Spaces</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Trending Locations</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Virtual Walkthroughs</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Pricing Structure</a></li>
                    </ul>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">For Hosts</h5>
                    <ul className="space-y-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">List a Property</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Hosting Resources</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Community Forums</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Insurance Protections</a></li>
                    </ul>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Company</h5>
                    <ul className="space-y-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Our Vision</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Press & Media</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Careers <span className="ml-1 px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold rounded-md">Hiring</span></a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Sustainability</a></li>
                    </ul>
                </div>

                {/* Column 4 */}
                <div className="space-y-4">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">Support</h5>
                    <ul className="space-y-2.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Safety Guidelines</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Cancellation Options</a></li>
                        <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact Support</a></li>
                    </ul>
                </div>

            </div>

            {/* BOTTOM SECTION */}
            <div className="max-w-[1400px] mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-400 dark:text-slate-500">

                {/* Left */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2 gap-y-1 text-center md:text-left">
                    <span className="font-bold text-slate-600 dark:text-slate-300">RoomEase</span>
                    <span>© {new Date().getFullYear()} RoomEase Inc. All rights reserved.</span>
                </div>

                {/* Right */}
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Sitemap</a>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

                    <button className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        <Globe className="w-3.5 h-3.5" />
                        <span>English (US)</span>
                    </button>
                </div>

            </div>
        </footer >
    );
}