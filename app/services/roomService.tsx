import { apiClient } from "../lib/GlobalApi";

export const RoomService = {
    createRoom: (body: FormData | Record<string, unknown>) => apiClient.post("rooms", body),
    getRoomById: async (id: string) => {
        const resp = await apiClient.get(`rooms/${id}`);
        // Backend wraps responses in ApiResponse { status, success, message, data }
        // Return the underlying data payload (RoomDetailsResponseDto)
        return resp?.data ?? resp;
    }
}