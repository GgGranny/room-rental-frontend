"use client";

import Image from "next/image";
import { MapPin, Images } from "lucide-react";
import { motion } from "framer-motion";

interface PropertyHeroProps {
    heroImage: string;
    badge: string;
    listingCode: string;
    title: string;
    location: string;
}

export function PropertyHero({
    heroImage,
    badge,
    listingCode,
    title,
    location
}: PropertyHeroProps) {
    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[16/9] w-full overflow-hidden rounded-[18px] border border-[#2C2C33] group"
            >
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg border border-[#2C2C33] bg-[#0B0B0F]/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md transition-all hover:bg-[#0B0B0F]">
                    <Images className="h-3.5 w-3.5" />
                    <span>View all photos</span>
                </button>
            </motion.div>

            <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold tracking-wider">
                    <span className="rounded bg-[#1D1D23] px-2 py-0.5 text-white border border-[#2C2C33]">
                        {badge}
                    </span>
                    <span className="text-[#9CA3AF]">{listingCode}</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
                    {title}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-[#9CA3AF]">
                    <MapPin className="h-4 w-4 text-[#9CA3AF] shrink-0" />
                    <span>{location}</span>
                </div>
            </div>
        </div>
    );
}