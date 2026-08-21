"use client";

import { useCallback, useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { getFirebaseMessaging } from "../lib/firebase";
import { notificationService } from "../services/notificationService";
import { useCurrentUser } from "./useAuth";

type PermissionState = NotificationPermission | "unsupported";

const SW_PATH = "/firebase-messaging-sw.js";

function navigateByAction(action?: string) {
    switch (action) {
        case "OPEN_VIEWING":
            return "/booking";
        case "OPEN_PROPERTY":
            return "/landlord/properties";
        case "OPEN_KYC":
            return "/kyc";
        case "OPEN_PAYMENT":
            return "/landlord/featured";
        default:
            return "/home";
    }
}

async function ensureServiceWorker() {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    try {
        const reg = await navigator.serviceWorker.getRegistration(SW_PATH);
        if (!reg) {
            await navigator.serviceWorker.register(SW_PATH);
        }
    } catch (e) {
        console.warn("Service worker registration failed:", e);
    }
}

// Manages FCM push notifications for the authenticated user. Silent when
// Firebase env vars are missing, permission is denied, or the user is not
// authenticated — the rest of the app is never blocked.
export function usePushNotification() {
    const router = useRouter();
    const { data: user, isSuccess } = useCurrentUser();
    const [permission, setPermission] = useState<PermissionState>(
        typeof Notification === "undefined" ? "unsupported" : Notification.permission,
    );
    const [registered, setRegistered] = useState(false);

    const obtainAndRegister = useCallback(async (): Promise<boolean> => {
        const messaging = await getFirebaseMessaging();
        if (!messaging) return false;
        if (typeof Notification === "undefined" || Notification.permission !== "granted") return false;
        const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });
        if (!currentToken) return false;
        await ensureServiceWorker();
        await notificationService.registerToken(currentToken);
        setRegistered(true);
        return true;
    }, []);

    const register = useCallback(async () => {
        if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
        try {
            await obtainAndRegister();
        } catch (e) {
            console.warn("Push token registration failed:", e);
        }
    }, [obtainAndRegister]);

    // Once an authenticated user is present, silently re-register the token if
    // permission was already granted (never prompts on its own).
    useEffect(() => {
        if (isSuccess && user && !registered) {
            // register() sets state only after awaited network calls complete,
            // so this is never a synchronous setState within the effect body.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            register();
        }
    }, [isSuccess, user, registered, register]);

    // User-initiated opt-in (e.g. from the banner): prompts, then registers.
    const requestPermission = useCallback(async (): Promise<boolean> => {
        if (typeof Notification === "undefined") return false;
        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            if (result === "granted") {
                await obtainAndRegister();
                toast.success("Push notifications enabled");
                return true;
            }
            return false;
        } catch (e) {
            console.warn("Notification permission request failed:", e);
            return false;
        }
    }, [obtainAndRegister]);

    // Foreground messages -> in-app toast that navigates on click.
    useEffect(() => {
        let unsub: (() => void) | undefined;
        (async () => {
            const messaging = await getFirebaseMessaging();
            if (!messaging) return;
            unsub = onMessage(messaging, (payload) => {
                const data = payload.data || {};
                const title = payload.notification?.title || "RoomEase";
                const body = payload.notification?.body || "";
                toast(title, {
                    description: body,
                    action: {
                        label: "View",
                        onClick: () => router.push(navigateByAction(data.action)),
                    },
                });
            });
        })();
        return () => unsub?.();
    }, [router]);

    return { permission, requestPermission, registered };
}