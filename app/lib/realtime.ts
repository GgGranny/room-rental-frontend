import { Client, type IMessage } from "@stomp/stompjs";

// New API: app-wide singleton STOMP client for real-time roommate/room/chat events.
// The broker is broadcast-only and carries safe SIGNAL payloads (never private
// content); it is a UI-sync channel, never a security boundary — REST responses
// stay authoritative and every read is re-authorized server-side.

export type RoommateRealtimeEvent = {
    type: string;
    roomId: string;
    requestId: string;
    status: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api/v1";

function brokerUrl(): string {
    const root = API_BASE.replace(/\/api\/v1\/?$/, "");
    return `${root.replace(/^http/, "ws")}/ws`;
}

let client: Client | null = null;
const connectListeners = new Set<() => void>();

function getClient(): Client {
    if (client) return client;
    client = new Client({
        brokerURL: brokerUrl(),
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        // Silent by design: connection issues must never break the page. Data is
        // always refetchable through the REST API (WebSocket is best-effort sync).
        onWebSocketError: () => undefined,
        onStompError: () => undefined,
    });
    client.onConnect = () => connectListeners.forEach((listener) => listener());
    client.activate();
    return client;
}

export type Unsubscribe = () => void;

// Generic subscription to any broadcast topic. Each STOMP frame body is parsed as
// JSON and handed to onEvent. Reuses the shared singleton client + connect queue,
// so a subscription registered before the socket connects still attaches once it
// reports connected.
export function subscribeToTopic<T>(destination: string, onEvent: (event: T) => void): Unsubscribe {
    const stomp = getClient();
    let subscription: { unsubscribe: () => void } | null = null;
    let disposed = false;

    const trySubscribe = () => {
        if (disposed || !stomp.connected || subscription) return;
        subscription = stomp.subscribe(destination, (message: IMessage) => {
            try {
                onEvent(JSON.parse(message.body) as T);
            } catch {
                // Ignore malformed frames; next event or refetch will resync.
            }
        });
    };

    // STOMP may still be connecting — register to subscribe once it reports connected.
    connectListeners.add(trySubscribe);
    trySubscribe();

    return () => {
        disposed = true;
        connectListeners.delete(trySubscribe);
        subscription?.unsubscribe();
    };
}

// Roommate map/room events for one shared room.
export function subscribeToRoomTopic(
    roomId: string,
    onEvent: (event: RoommateRealtimeEvent) => void,
): Unsubscribe {
    return subscribeToTopic<RoommateRealtimeEvent>(`/topic/rooms/${roomId}/roommates`, onEvent);
}
