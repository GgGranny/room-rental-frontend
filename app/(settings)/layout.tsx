import Navbar from "@/components/Navbar";
import PushNotifications from "@/components/PushNotifications";

// Shell for the user-facing account pages (/profile and /settings/**).
export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Navbar />
            {children}
            <PushNotifications />
        </div>
    );
}
