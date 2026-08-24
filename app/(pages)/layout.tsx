import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PushNotifications from "@/components/PushNotifications";

export default function PagesLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <PushNotifications />
        </>
    )
}