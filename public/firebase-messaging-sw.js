/* Firebase Messaging service worker. Served from /firebase-messaging-sw.js and
   registered by the client once the user opts in to push notifications. The
   Firebase Web config is fetched from the app's /api/firebase-config endpoint
   (env-driven, public values only). */
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js");

let initPromise = null;

function init() {
    if (initPromise) return initPromise;
    initPromise = (async () => {
        const res = await fetch("/api/firebase-config", { cache: "no-store" });
        if (!res.ok) throw new Error("Firebase config unavailable");
        const config = await res.json();
        if (!config.projectId) throw new Error("Firebase is not configured");

        const app = firebase.initializeApp(config);
        const messaging = firebase.messaging(app);

        messaging.onBackgroundMessage((payload) => {
            const title = (payload.notification && payload.notification.title) || "RoomEase";
            const options = {
                body: (payload.notification && payload.notification.body) || "",
                icon: "/favicon.ico",
                badge: "/favicon.ico",
                data: payload.data || {},
            };
            self.registration.showNotification(title, options);
        });
    })().catch((err) => {
        console.warn("Firebase SW init failed:", err);
        initPromise = null;
    });
    return initPromise;
}

self.addEventListener("install", (event) => {
    event.waitUntil(init());
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const data = event.notification.data || {};
    const action = data.action || "";
    let url = "/home";
    if (action === "OPEN_VIEWING") url = "/booking";
    else if (action === "OPEN_PROPERTY") url = "/landlord/properties";
    else if (action === "OPEN_KYC") url = "/kyc";
    else if (action === "OPEN_PAYMENT") url = "/landlord/featured";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if ("focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }
            return clients.openWindow(url);
        }),
    );
});