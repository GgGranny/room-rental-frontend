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

// Client-side preference for push notifications (Settings → Preferences).
// The server-side source of truth is whether an FCM token is registered for
// the user; this flag only controls this browser/device.
const PUSH_PREF_KEY = "roomease.push.enabled";

export function isPushPreferenceEnabled(): boolean {
    try {
        return window.localStorage.getItem(PUSH_PREF_KEY) !== "off";
    } catch {
        return true;
    }
}

export function setPushPreference(enabled: boolean) {
    try {
        window.localStorage.setItem(PUSH_PREF_KEY, enabled ? "on" : "off");
    } catch {
        // Storage unavailable — preference simply won't persist.
    }
}

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
        // Idempotent: registering an already-registered script is a no-op.
        // getToken() requires an ACTIVE worker at the default scope, so we
        // register first and wait for readiness before requesting a token.
        await navigator.serviceWorker.register(SW_PATH);
        await navigator.serviceWorker.ready;
    } catch (e) {
        console.warn("Service worker registration failed:", e);
        throw e;
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
        // The worker must be registered and active BEFORE requesting a token.
        await ensureServiceWorker();
        const currentToken = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            serviceWorkerRegistration: await navigator.serviceWorker.getRegistration(),
        });
        if (!currentToken) return false;
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
    // permission was already granted (never prompts on its own). Skipped when
    // the user disabled push notifications in Preferences.
    useEffect(() => {
        if (isSuccess && user && !registered && isPushPreferenceEnabled()) {
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

    // Foreground messages -> in-app toast that navigates on click. Suppressed
    // when push notifications are disabled in Preferences (history still updates).
    useEffect(() => {
        let unsub: (() => void) | undefined;
        (async () => {
            const messaging = await getFirebaseMessaging();
            if (!messaging) return;
            unsub = onMessage(messaging, (payload) => {
                window.dispatchEvent(new Event("room-notification"));
                if (!isPushPreferenceEnabled()) return;
                const data = payload.data || {};
                const title = payload.notification?.title || "RoomEase";
                const body = payload.notification?.body || "";
                toast(title, {
                    description: body,
                    duration: 8000,
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
