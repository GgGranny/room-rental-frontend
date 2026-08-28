import { apiClient } from "../lib/GlobalApi";

// New API: private roommate chat client. Every call is authorized server-side
// from the JWT against the conversation's match participants — the client never
// sends a senderId/userId, so a tenant cannot impersonate the other roommate.

export type MatchStatus = "ACTIVE" | "ENDED";

export type ChatUserSummary = {
    userId: string;
    name: string;
    profilePictureUrl?: string;
};

// A confirmed roommate match as seen by ONE of its two tenants. `peer` is always
// the OTHER tenant; no emails/phone/KYC data are ever exposed.
export type RoommateMatch = {
    matchId: string;
    conversationId: string | null;
    roomId: string;
    roomTitle: string;
    status: MatchStatus;
    peer: ChatUserSummary;
    unreadCount: number;
    createdAt: string;
};

export type ChatMessage = {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    mine: boolean;
    createdAt: string;
    readAt: string | null;
};

type ApiResponse<T> = { data: T };

const unwrap = <T,>(resp: ApiResponse<T> | T): T => (resp as ApiResponse<T>)?.data ?? (resp as T);

export const chatService = {
    // My roommate matches (each carries its conversation handle + unread count).
    getMatches: async () => unwrap(await apiClient.get<ApiResponse<RoommateMatch[]>>("roommates/matches")),

    // Paged message history (oldest-first). `before` is an ISO-8601 createdAt cursor.
    getMessages: async (conversationId: string, opts?: { before?: string; limit?: number }) => {
        const params = new URLSearchParams();
        if (opts?.before) params.set("before", opts.before);
        if (opts?.limit) params.set("limit", String(opts.limit));
        const qs = params.toString();
        return unwrap(
            await apiClient.get<ApiResponse<ChatMessage[]>>(
                `roommates/conversations/${conversationId}/messages${qs ? `?${qs}` : ""}`,
            ),
        );
    },

    // Send a message; the server resolves the sender from the JWT.
    sendMessage: (conversationId: string, content: string) =>
        apiClient.post(`roommates/conversations/${conversationId}/messages`, { content }),

    // Mark every message the peer sent me in this conversation as read.
    markRead: (conversationId: string) =>
        apiClient.patch(`roommates/conversations/${conversationId}/read`, {}),
};
