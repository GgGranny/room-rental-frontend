"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface PropertyGalleryProps {
    images: string[];
}

export function PropertyGallery({ images }: PropertyGalleryProps) {
    return (
        <div className="flex flex-col gap-4">
            {images.map((img, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.1 }}
                    className="relative h-[160px] sm:h-[185px] w-full overflow-hidden rounded-[18px] border border-[#2C2C33] group"
                >
                    <Image
                        src={img}
                        alt={`Gallery preview ${idx + 1}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 35vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </motion.div>
            ))}
        </div>
    );
}