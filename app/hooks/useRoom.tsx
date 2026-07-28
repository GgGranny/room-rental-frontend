import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/GlobalApi";
import { RoomService } from "../services/roomService";


const Room_ID = "ROOM";

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