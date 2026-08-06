import { apiClient } from "../lib/GlobalApi";

export type RoomImageResponse = { id: number; url: string; contentType?: string; fileSize?: number };
export type RoomDetails = {
    roomId: string; roomTitle: string; description?: string; location: string; address?: string; price: number; status: string;
    preferredTenants?: string[]; rules?: string[]; facilities?: string[]; roomType?: string; floorNumber?: number; totalRooms?: number;
    propertyId: string; propertyName?: string; city?: string; district?: string; province?: string; latitude?: number; Longitude?: number;
    imageUrls?: RoomImageResponse[]; userResponse?: unknown;
};
type ApiResponse<T> = { data: T };

export const RoomService = {
    createRoom: (body: FormData | Record<string, unknown>) => apiClient.post("rooms", body),
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
