"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    roommateService,
    RoommateProfileRequest,
} from "../services/roommateService";

const ROOMMATE_KEY = "roommate";
const REQUESTS_KEY = "roommateRequests";

function invalidateAll(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: [ROOMMATE_KEY] });
    queryClient.invalidateQueries({ queryKey: [REQUESTS_KEY] });
}

// Tenant: my roommate profile (data.profileId === null when not created yet).
export function useMyRoommateProfile() {
    return useQuery({
        queryKey: [ROOMMATE_KEY, "profile"],
        queryFn: () => roommateService.getMyProfile(),
        retry: false,
    });
}

export function useSaveRoommateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ mode, body }: { mode: "create" | "update"; body: RoommateProfileRequest }) =>
            mode === "create" ? roommateService.createProfile(body) : roommateService.updateProfile(body),
        onSuccess: () => invalidateAll(queryClient),
    });
}

// Tenant: shared rooms I expressed interest in.
export function useMyInterests() {
    return useQuery({
        queryKey: [ROOMMATE_KEY, "interests"],
        queryFn: () => roommateService.getMyInterests(),
        retry: false,
    });
}

export function useExpressInterest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId: string) => roommateService.expressInterest(roomId),
        onSuccess: () => invalidateAll(queryClient),
    });
}

export function useRemoveInterest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (roomId: string) => roommateService.removeInterest(roomId),
        onSuccess: () => invalidateAll(queryClient),
    });
}

// Tenant: candidate roommates for a specific shared room.
export function useRoommateCandidates(roomId?: string) {
    return useQuery({
        queryKey: [ROOMMATE_KEY, "candidates", roomId],
        queryFn: () => roommateService.getCandidates(roomId || ""),
        enabled: Boolean(roomId),
    });
}

// New API: map data (room summary + active opportunities) for one shared room.
export function useRoommateMap(roomId?: string) {
    return useQuery({
        queryKey: [ROOMMATE_KEY, "map", roomId],
        queryFn: () => roommateService.getMap(roomId || ""),
        enabled: Boolean(roomId),
    });
}

export function useSentRequests() {
    return useQuery({
        queryKey: [REQUESTS_KEY, "sent"],
        queryFn: () => roommateService.getSentRequests(),
        retry: false,
    });
}

export function useReceivedRequests() {
    return useQuery({
        queryKey: [REQUESTS_KEY, "received"],
        queryFn: () => roommateService.getReceivedRequests(),
        retry: false,
    });
}

export function useSendRoommateRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { recipientId: string; roomId: string; message?: string }) =>
            roommateService.sendRequest(body),
        onSuccess: () => invalidateAll(queryClient),
    });
}

export function useRespondRoommateRequest(action: "accept" | "reject") {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => (action === "accept" ? roommateService.acceptRequest(id) : roommateService.rejectRequest(id)),
        onSuccess: () => invalidateAll(queryClient),
    });
}

export function useCancelRoommateRequest() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => roommateService.cancelRequest(id),
        onSuccess: () => invalidateAll(queryClient),
    });
}
