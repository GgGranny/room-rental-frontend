import { apiClient } from "../lib/GlobalApi";

// Viewing-schedule API (replaces the old "booking" flow). A tenant requests a
// viewing for a room; the landlord approves/rejects. Backend wraps every
// response in ApiResponse { data }, so each call unwraps `.data`.
export type ScheduleStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export type ViewingSchedule = {
    scheduleId: string;
    status: ScheduleStatus;
    scheduledAt: string;
    note?: string;
    responseNote?: string;
    createdAt?: string;
    roomId: string;
    roomTitle?: string;
    roomLocation?: string;
    propertyId?: string;
    propertyName?: string;
    tenantId?: string;
    tenantName?: string;
    tenantEmail?: string;
    tenantPhone?: string;
    landlordId?: string;
    landlordName?: string;
    landlordEmail?: string;
    landlordPhone?: string;
};

export type CreateScheduleBody = {
    roomId: string;
    scheduledAt: string; // ISO local date-time, e.g. "2026-08-15T14:30"
    note?: string;
};

type ApiResponse<T> = { data: T };

function unwrap<T>(resp: ApiResponse<T> | T): T {
    return (resp as ApiResponse<T>)?.data ?? (resp as T);
}

export const ScheduleService = {
    // Tenant
    create: async (body: CreateScheduleBody) =>
        unwrap<ViewingSchedule>(await apiClient.post<ApiResponse<ViewingSchedule>>("schedules", body)),
    getMineAsTenant: async () =>
        unwrap<ViewingSchedule[]>(await apiClient.get<ApiResponse<ViewingSchedule[]>>("schedules/tenant")),
    cancel: async (scheduleId: string) =>
        unwrap<ViewingSchedule>(await apiClient.patch<ApiResponse<ViewingSchedule>>(`schedules/${scheduleId}/cancel`, {})),

    // Landlord
    getMineAsLandlord: async () =>
        unwrap<ViewingSchedule[]>(await apiClient.get<ApiResponse<ViewingSchedule[]>>("schedules/landlord")),
    respond: async (scheduleId: string, status: "APPROVED" | "REJECTED", responseNote?: string) =>
        unwrap<ViewingSchedule>(
            await apiClient.patch<ApiResponse<ViewingSchedule>>(`schedules/landlord/${scheduleId}/respond`, {
                status,
                responseNote,
            }),
        ),
};
