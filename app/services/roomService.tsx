import { apiClient } from "../lib/GlobalApi";

export type RoomImageResponse = { id: number; url: string; contentType?: string; fileSize?: number };
export type RoomListItem = {
    roomId: string; roomTitle: string; description?: string; location: string; price: number; status: string;
    preferredTenants?: string[]; roomType?: string; sharingType?: "PRIVATE" | "SHARED"; floorNumber?: number; totalRooms?: number;
    imageUrls?: RoomImageResponse[]; facilities?: string[]; rules?: string[];
    propertyId: string; propertyName?: string; city?: string; district?: string; province?: string;
    featured?: boolean;
};
export type RoomDetails = {
    roomId: string; roomTitle: string; description?: string; location: string; address?: string; price: number; status: string;
    preferredTenants?: string[]; rules?: string[]; facilities?: string[]; roomType?: string; sharingType?: "PRIVATE" | "SHARED"; floorNumber?: number; totalRooms?: number;
    propertyId: string; propertyName?: string; city?: string; district?: string; province?: string; latitude?: number; Longitude?: number;
    imageUrls?: RoomImageResponse[]; userResponse?: unknown; featured?: boolean;
};
type ApiResponse<T> = { data: T };

// Public room browsing/search filters (maps to GET /rooms/search query params).
export type RoomSearchParams = {
    location?: string;
    minPrice?: number | string;
    maxPrice?: number | string;
    roomType?: string;
};

// "Find Rooms Near You" marker/card payload (maps to GET /rooms/nearby).
// distanceKm is computed server-side; the user's own coordinates are never
// returned by the backend.
export type NearbyRoom = {
    roomId: string;
    roomTitle: string;
    description?: string;
    location?: string;
    price: number;
    status: string;
    roomType?: string;
    sharingType?: "PRIVATE" | "SHARED";
    floorNumber?: number;
    totalRooms?: number;
    propertyId?: string;
    propertyName?: string;
    latitude?: number;
    longitude?: number;
    distanceKm?: number;
    imageUrls?: RoomImageResponse[];
};

export type NearbySearchParams = { latitude: number; longitude: number; radius: number };

export const RoomService = {
    createRoom: (body: FormData | Record<string, unknown>) => apiClient.post("rooms", body),
    // Public: newest available rooms for the tenant home grid.
    getRecommendedRooms: async () => {
        const resp = await apiClient.get<ApiResponse<RoomListItem[]>>("rooms");
        return resp?.data ?? (resp as unknown as RoomListItem[]);
    },
    // Public: filtered search. Only non-empty params are sent.
    searchRooms: async (params: RoomSearchParams) => {
        const query = new URLSearchParams();
        if (params.location) query.set("location", params.location);
        if (params.minPrice !== undefined && params.minPrice !== "") query.set("minPrice", String(params.minPrice));
        if (params.maxPrice !== undefined && params.maxPrice !== "") query.set("maxPrice", String(params.maxPrice));
        if (params.roomType) query.set("roomType", params.roomType);
        const qs = query.toString();
        const resp = await apiClient.get<ApiResponse<RoomListItem[]>>(`rooms/search${qs ? `?${qs}` : ""}`);
        return resp?.data ?? (resp as unknown as RoomListItem[]);
    },
    // Public: AVAILABLE rooms within `radius` km of the given coordinates, closest
    // first. Distance filtering happens on the backend (GET /rooms/nearby).
    getNearbyRooms: async ({ latitude, longitude, radius }: NearbySearchParams) => {
        const query = new URLSearchParams({
            latitude: String(latitude),
            longitude: String(longitude),
            radius: String(radius),
        });
        const resp = await apiClient.get<ApiResponse<NearbyRoom[]>>(`rooms/nearby?${query.toString()}`);
        return resp?.data ?? (resp as unknown as NearbyRoom[]);
    },
    getRoomById: async (id: string) => {
        const resp = await apiClient.get<ApiResponse<RoomDetails>>(`rooms/${id}`);
        // Backend wraps responses in ApiResponse { status, success, message, data }
        // Return the underlying data payload (RoomDetailsResponseDto)
        return resp?.data ?? resp;
    },
    updateRoom: (id: string, body: FormData) => apiClient.put(`rooms/${id}`, body),
    removeRoomImage: (roomId: string, imageId: number, body: FormData) =>
        apiClient.put(`rooms/${roomId}?roomIdsToRemove=${imageId}`, body),
    updateRoomStatus: (id: string, status: string) => apiClient.patch(`rooms/${id}/status/${status}`, {}),
    deleteRoom: (id: string) => apiClient.delete(`rooms/${id}`),
}
