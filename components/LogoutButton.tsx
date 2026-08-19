"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLogout } from "@/app/hooks/useAuth";

type LogoutButtonProps = {
    className?: string;
    label?: string;
    showIcon?: boolean;
};

export default function LogoutButton({
    className = "",
    label = "Sign Out",
    showIcon = true,
}: LogoutButtonProps) {
    const router = useRouter();
    const logoutMutation = useLogout();

    const handleLogout = async () => {
        try {
            await logoutMutation.mutateAsync();
            toast.success("Signed out");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            router.push("/login");
        }
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className={className}
        >
            {showIcon && <LogOut className="w-4 h-4" />}
            {label}
        </button>
    );
}
