"use client";

import Image from "next/image";

type ImageDisplayProps = {
    src: string;
    alt: string;
    fill?: boolean;
    width?: number | `${number}`;
    height?: number | `${number}`;
    className?: string;
    loading?: "lazy" | "eager";
    logoSrc?: string;
    logoAlt?: string;
    headline?: string;
    subtext?: string;
};

export default function ImageDisplay({
    src,
    alt,
    width,
    height,
    className = "",
    loading = "lazy",
    fill,
    logoSrc,
    logoAlt = "Logo",
    headline = "The simplest way to manage your workflow.",
    subtext = "Trusted by thousands of teams worldwide to stay organized and move faster.",
}: ImageDisplayProps) {
    return (
        <div className={`relative h-full w-full overflow-hidden rounded-2xl ${className}`}>

            {/* Background Image */}
            <Image
                src={src}
                alt={alt}
                {...(fill ? { fill: true } : { width: width || 500, height: height || 500 })}
                loading={loading}
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-between p-8">

                {/* Logo */}
                <div>
                    {logoSrc ? (
                        <Image
                            src={logoSrc}
                            alt={logoAlt}
                            width={120}
                            height={36}
                            className="object-contain"
                        />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                                <div className="w-3.5 h-3.5 rounded-sm bg-white" />
                            </div>
                            <span className="text-white font-semibold text-lg tracking-tight">
                                {logoAlt}
                            </span>
                        </div>
                    )}
                </div>

                {/* Bottom Text */}
                <div className="space-y-3">
                    {/* Quote mark */}
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="none" className="opacity-60">
                        <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.6 6 7.2 10.4H13V24H0zm18 0V14.4C18 6.4 22.8 1.6 32.4 0L34 2.4C28.4 3.6 25.6 6 25.2 10.4H31V24H18z" fill="white" />
                    </svg>

                    <h2 className="text-white text-2xl font-bold leading-snug tracking-tight max-w-xs">
                        {headline}
                    </h2>

                    <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                        {subtext}
                    </p>

                    {/* Decorative dots */}
                    <div className="flex gap-1.5 pt-2">
                        <div className="w-5 h-1 rounded-full bg-white" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                        <div className="w-1 h-1 rounded-full bg-white/40" />
                    </div>
                </div>

            </div>
        </div>
    );
}