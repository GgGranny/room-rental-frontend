"use client";

import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useMyProfile, useUploadAvatar } from "@/app/hooks/useAuth";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // matches backend 5MB limit

// Clickable avatar that uploads a new profile picture via the existing
// authenticated profile API and refreshes everywhere (query invalidation).
export default function AvatarPicker({ size = "lg" }: { size?: "lg" | "xl" }) {
    const { data } = useMyProfile();
    const profile = data?.data;
    const uploadAvatar = useUploadAvatar();
    const inputId = `avatar-input-${size}`;

    const fullName = [profile?.fname, profile?.lname].filter(Boolean).join(" ") || "Your account";
    const initials =
        [profile?.fname?.[0], profile?.lname?.[0]].filter(Boolean).join("").toUpperCase() || "U";
    const dimension = size === "xl" ? "w-24 h-24" : "w-20 h-20";
    const iconSize = size === "xl" ? "w-5 h-5" : "w-4 h-4";

    const pickFile = () => document.getElementById(inputId)?.click();

    const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        if (!ACCEPTED_TYPES.includes(file.type)) {
            toast.error("Please choose a JPG, PNG or WebP image.");
            return;
        }
        if (file.size > MAX_SIZE_BYTES) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        try {
            await uploadAvatar.mutateAsync(file);
            toast.success("Profile picture updated");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Could not upload image.");
        }
    };

    return (
        <div className="relative group">
            <button
                type="button"
                onClick={pickFile}
                disabled={uploadAvatar.isPending}
                aria-label="Change profile picture"
                className={`${dimension} rounded-full overflow-hidden bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-sm cursor-pointer relative disabled:opacity-60`}
            >
                {profile?.profilePictureUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.profilePictureUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                    <span className={`${size === "xl" ? "text-3xl" : "text-2xl"} font-black text-indigo-600 dark:text-indigo-400`}>{initials}</span>
                )}
                {uploadAvatar.isPending && (
                    <span className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                        <Loader2 className={`${iconSize} text-white animate-spin`} />
                    </span>
                )}
            </button>
            <button
                type="button"
                onClick={pickFile}
                disabled={uploadAvatar.isPending}
                aria-label="Upload new profile picture"
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center border-2 border-white dark:border-slate-950 shadow transition-colors cursor-pointer disabled:opacity-60"
            >
                <Camera className="w-3.5 h-3.5" />
            </button>
            <input id={inputId} type="file" accept={ACCEPTED_TYPES.join(",")} onChange={onFileChange} className="hidden" />
        </div>
    );
}
