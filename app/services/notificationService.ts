import { apiClient } from "../lib/GlobalApi";

// FCM token registration API. The backend always resolves the owning user from
// the authenticated JWT — the client never sends a user id.
export const notificationService = {
    registerToken: (token: string) => apiClient.post("notifications/token", { token }),
    removeToken: () => apiClient.delete("notifications/token"),
    getAll: () => apiClient.get<{ data: AppNotification[] }>("notifications"),
    getUnreadCount: () => apiClient.get<{ data: number }>("notifications/unread-count"),
    markRead: (id: string) => apiClient.patch(`notifications/${id}/read`, {}),
    markAllRead: () => apiClient.patch("notifications/read-all", {}),
};

export type AppNotification = {
    id: string;
    title: string;
    body: string;
    type: string;
    referenceId?: string;
    read: boolean;
    createdAt: string;
};
