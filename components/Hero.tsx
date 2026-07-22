"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative w-full h-[85vh] min-h-[600px] max-h-[800px] flex items-center overflow-hidden bg-slate-900">

            {/* Cinematic High-Res Background Image */}
            <img
                src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1920&q=80"
                alt="Luxury architectural villa with infinity pool at sunset"
                className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* Balanced Vignette & Ambient Dark Gradient Overlay for Maximum Text Contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent md:bg-gradient-to-tr" />
            <div className="absolute inset-0 bg-black/20" /> {/* Subtle overall darkening layer */}

            {/* Hero Content Container */}
            <div className="relative w-full max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 z-10">
                <div className="max-w-3xl space-y-5 md:space-y-6">

                    {/* Eyebrow Accent Label */}
                    <span className="text-[11px] sm:text-xs font-bold text-indigo-400 tracking-[0.2em] uppercase block">
                        Premier Architectural Rentals
                    </span>

                    {/* Core Impact Headline */}
                    <h1 className="text-xl md:text-2xl sm:text-xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1] md:leading-[1.15]">
                        Curated Stays for the <br className="hidden sm:inline" />
                        Architectural Soul
                    </h1>

                    {/* Editorial Subheadline Descriptive Copy */}
                    <p className="text-base sm:text-md md:text-lg text-slate-200 font-medium leading-relaxed max-w-2xl opacity-90">
                        Discover the world's most intentionally designed rental properties, from brutalist sanctuaries to glass pavilions.
                    </p>

                    {/* Main Action Call to Action (CTA) */}
                    <div className="pt-4">
                        <button
                            onClick={() => console.log("Navigating to listings...")}
                            className="group bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-950/30 flex items-center gap-2.5 transition-all duration-200 hover:translate-y-[-1px] active:translate-y-0 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        >
                            <span>Explore Listings</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </button>
                    </div>

                </div>
            </div>

            {/* Bottom Subtle Geometric Fade-out Border */}
            <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50/50 to-transparent pointer-events-none" />
        </section>
    );
}