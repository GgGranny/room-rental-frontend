import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { RoomService, RoomSearchParams, NearbySearchParams } from "../services/roomService";


const Room_ID = "ROOM";

export function useRecommendedRooms() {
    return useQuery({
        queryKey: [Room_ID, "recommended"],
        queryFn: () => RoomService.getRecommendedRooms(),
    });
}

export function useSearchRooms(params: RoomSearchParams, enabled = true) {
    return useQuery({
        queryKey: [Room_ID, "search", params],
        queryFn: () => RoomService.searchRooms(params),
        enabled,
    });
}

// "Find Rooms Near You": nearby AVAILABLE rooms for the map. Enabled only once we
// actually have the user's coordinates (i.e. after location permission is granted).
export function useNearbyRooms(params: NearbySearchParams | null) {
    return useQuery({
        queryKey: [Room_ID, "nearby", params],
        queryFn: () => RoomService.getNearbyRooms(params as NearbySearchParams),
        enabled: Boolean(params),
    });
}

export function useSaveRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: FormData | Record<string, unknown>) => RoomService.createRoom(body),
        mutationKey: [Room_ID],
        onSuccess: (data) => {
            console.log("response: ", data);
            console.info("room created Successfully");
            queryClient.invalidateQueries({ queryKey: [Room_ID] })
        },
        onError: (error) => {
            console.error("error createing room");
        }
    })
}

export function useGetRoomById(id?: string) {
    return useQuery({
        queryKey: [Room_ID, id],
        queryFn: () => RoomService.getRoomById(id || ''),
        enabled: Boolean(id),
    });
}

export function useUpdateRoomStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => RoomService.updateRoomStatus(id, status),
        onSuccess: (_, variables) => queryClient.invalidateQueries({ queryKey: [Room_ID, variables.id] }),
    });
}

export function useDeleteRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => RoomService.deleteRoom(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [Room_ID] }),
    });
}

export function useUpdateRoom() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, body }: { id: string; body: FormData }) => RoomService.updateRoom(id, body),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [Room_ID, variables.id] });
            queryClient.invalidateQueries({ queryKey: ["property"] });
        },
    });
}

export function useRemoveRoomImage() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ roomId, imageId, body }: { roomId: string; imageId: number; body: FormData }) =>
            RoomService.removeRoomImage(roomId, imageId, body),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [Room_ID, variables.roomId] });
            queryClient.invalidateQueries({ queryKey: ["property"] });
        },
    });
}
