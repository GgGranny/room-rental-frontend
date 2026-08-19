"use client";

import moment from "moment";
import { Inter } from "next/font/google";
import { momentLocalizer } from "react-big-calendar";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import "../(dashboard)/landlord/schedules/Calander.css";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-inter",
});

const localizer = momentLocalizer(moment);

export function MyBigCalander() {
    const style = {
        height: "100%",
        borderRadius: "14px",
        border: "1px solid #e6e6e4",
        boxShadow:
            "0 1px 2px rgba(15, 15, 14, 0.04), 0 8px 24px -12px rgba(15, 15, 14, 0.08)",
        padding: "20px",
        background: "#ffffff",
        fontFamily: "var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif",
        color: "#18181b",
    };

    return (
        <div className={`calendar-shell ${inter.variable}`}>
            <ShadcnBigCalendar
                localizer={localizer}
                style={style}
                events={[]}
                // color events: return { className: "event-variant-primary" } (also -secondary, -outline)
                eventPropGetter={() => ({ className: "event-variant-primary" })}
            />
        </div>
    );
}