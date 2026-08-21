import { apiClient } from "../lib/GlobalApi";

// FCM token registration API. The backend always resolves the owning user from
// the authenticated JWT — the client never sends a user id.
export const notificationService = {
    registerToken: (token: string) => apiClient.post("notifications/token", { token }),
    removeToken: () => apiClient.delete("notifications/token"),
};