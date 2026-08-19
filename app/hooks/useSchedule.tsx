"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CreateScheduleBody, ScheduleService } from "../services/scheduleService";

const SCHEDULE_KEY = "schedules";

// Tenant: create a viewing request.
export function useCreateSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: CreateScheduleBody) => ScheduleService.create(body),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, "tenant"] }),
    });
}

// Tenant: my viewing requests.
export function useMyTenantSchedules() {
    return useQuery({
        queryKey: [SCHEDULE_KEY, "tenant"],
        queryFn: () => ScheduleService.getMineAsTenant(),
    });
}

// Tenant: cancel a pending request.
export function useCancelSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (scheduleId: string) => ScheduleService.cancel(scheduleId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, "tenant"] }),
    });
}

// Landlord: viewing requests for my properties.
export function useLandlordSchedules() {
    return useQuery({
        queryKey: [SCHEDULE_KEY, "landlord"],
        queryFn: () => ScheduleService.getMineAsLandlord(),
    });
}

// Landlord: approve/reject a request.
export function useRespondToSchedule() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ scheduleId, status, responseNote }: { scheduleId: string; status: "APPROVED" | "REJECTED"; responseNote?: string }) =>
            ScheduleService.respond(scheduleId, status, responseNote),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [SCHEDULE_KEY, "landlord"] }),
    });
}
