"use client";

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, type Messaging } from "firebase/messaging";

// Firebase Web client configuration. Only public values used by the browser —
// never the backend service-account private key.
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const configured = Object.values(firebaseConfig).some((v) => v && v.length > 0);

export function isFirebaseConfigured(): boolean {
    return configured;
}

function getAppSafe(): FirebaseApp | null {
    if (!configured) return null;
    return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export async function getFirebaseMessaging(): Promise<Messaging | null> {
    if (typeof window === "undefined" || !configured) return null;
    try {
        if (!(await isSupported())) return null;
        const app = getAppSafe();
        if (!app) return null;
        return getMessaging(app);
    } catch (e) {
        console.warn("Firebase messaging is not available:", e);
        return null;
    }
}