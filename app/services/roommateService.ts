import { apiClient } from "../lib/GlobalApi";

// New API: tenant Roommate Finder client. All ownership is resolved server-side
// from the JWT; the client never sends user ids for the current user.

export type SleepSchedule = "FLEXIBLE" | "EARLY_BIRD" | "NIGHT_OWL";
export type Cleanliness = "LOW" | "MEDIUM" | "HIGH";
export type RoommateRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";

export type RoommateProfileRequest = {
    bio?: string;
    budget?: number;
    preferredLocation?: string;
    preferredMoveIn?: string;
    smoker?: boolean;
    petsOk?: boolean;
    sleepSchedule?: SleepSchedule;
    cleanliness?: Cleanliness;
};

export type RoommateProfile = RoommateProfileRequest & {
    profileId: string | null;
    userId: string;
    name: string;
    profilePictureUrl?: string;
};

export type RoomInterest = {
    roomId: string;
    roomTitle: string;
    location: string;
    price: number;
    status: string;
    sharingType: string;
    interestedSince: string;
};

export type RoommateCandidate = {
    profile: RoommateProfile;
    compatibilityScore: number;
};

// New API: map payload for one shared room. Marker coordinates are derived on
// the client from the ROOM's location only — tenant locations are never exposed.
export type MapRoomSummary = {
    roomId: string;
    roomTitle: string;
    price: number;
    location?: string;
    latitude?: number | null;
    longitude?: number | null;
    status: string;
    sharingType: string;
};

export type MapOpportunity = {
    userId: string;
    name: string;
    profilePictureUrl?: string;
    budget?: number;
    bio?: string;
    compatibilityScore: number;
    myRequestStatus: RoommateRequestStatus | null;
    pendingIncomingRequestId: string | null;
};

export type RoommateMapData = {
    room: MapRoomSummary;
    opportunities: MapOpportunity[];
};

export type RoommateUserSummary = { userId: string; name: string; profilePictureUrl?: string };

export type RoommateRequestItem = {
    id: string;
    roomId: string;
    roomTitle: string;
    propertyName?: string;
    roomPrice: number;
    requester: RoommateUserSummary;
    recipient: RoommateUserSummary;
    status: RoommateRequestStatus;
    message?: string;
    createdAt: string;
    updatedAt: string;
};

type ApiResponse<T> = { data: T };

const unwrap = <T,>(resp: ApiResponse<T> | T): T => (resp as ApiResponse<T>)?.data ?? (resp as T);

export const roommateService = {
    getMyProfile: async () => unwrap(await apiClient.get<ApiResponse<RoommateProfile>>("roommates/profile")),
    createProfile: (body: RoommateProfileRequest) => apiClient.post("roommates/profile", body),
    updateProfile: (body: RoommateProfileRequest) => apiClient.put("roommates/profile", body),

    getMyInterests: async () => unwrap(await apiClient.get<ApiResponse<RoomInterest[]>>("roommates/interests")),
    expressInterest: (roomId: string) => apiClient.post(`roommates/interests/${roomId}`, {}),
    removeInterest: (roomId: string) => apiClient.delete(`roommates/interests/${roomId}`),

    getCandidates: async (roomId: string) =>
        unwrap(await apiClient.get<ApiResponse<RoommateCandidate[]>>(`roommates/rooms/${roomId}/candidates`)),

    getMap: async (roomId: string) =>
        unwrap(await apiClient.get<ApiResponse<RoommateMapData>>(`roommates/rooms/${roomId}/map`)),

    sendRequest: (body: { recipientId: string; roomId: string; message?: string }) =>
        apiClient.post("roommates/requests", body),
    getSentRequests: async () =>
        unwrap(await apiClient.get<ApiResponse<RoommateRequestItem[]>>("roommates/requests/sent")),
    getReceivedRequests: async () =>
        unwrap(await apiClient.get<ApiResponse<RoommateRequestItem[]>>("roommates/requests/received")),
    // The counterpart tenant's roommate profile (+ compatibility) for a request I'm
    // part of. Backs "click a request → view the tenant's details" before deciding.
    // The backend returns 403 for anyone who isn't a participant of the request.
    getRequestProfile: async (requestId: string) =>
        unwrap(await apiClient.get<ApiResponse<RoommateCandidate>>(`roommates/requests/${requestId}/profile`)),
    acceptRequest: (id: string) => apiClient.patch(`roommates/requests/${id}/accept`, {}),
    rejectRequest: (id: string) => apiClient.patch(`roommates/requests/${id}/reject`, {}),
    cancelRequest: (id: string) => apiClient.patch(`roommates/requests/${id}/cancel`, {}),
};
