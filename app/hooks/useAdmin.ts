"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminService } from "../services/adminService";

const ADMIN_KEY = "admin";

export function useAdminStats() {
    return useQuery({
        queryKey: [ADMIN_KEY, "stats"],
        queryFn: () => adminService.getStats(),
    });
}

export function useAdminUsers() {
    return useQuery({
        queryKey: [ADMIN_KEY, "users"],
        queryFn: () => adminService.getAllUsers(),
    });
}

export function useToggleUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ userId, active }: { userId: string; active: boolean }) =>
            adminService.setUserActiveStatus(userId, active),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "users"] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "stats"] });
        },
    });
}

export function useAdminKycs() {
    return useQuery({
        queryKey: [ADMIN_KEY, "kyc"],
        queryFn: () => adminService.getAllKycs(),
    });
}

export function useModerateKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ kycId, status }: { kycId: number; status: "APPROVED" | "REJECTED" }) =>
            adminService.moderateKyc(kycId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "kyc"] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "stats"] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "users"] });
        },
    });
}

export function useAdminProperties() {
    return useQuery({
        queryKey: [ADMIN_KEY, "properties"],
        queryFn: () => adminService.getAllProperties(),
    });
}

export function useModerateProperty() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ propertyId, status }: { propertyId: string; status: "ACTIVE" | "BLOCKED_BY_ADMIN" }) =>
            adminService.moderateProperty(propertyId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "properties"] });
            queryClient.invalidateQueries({ queryKey: [ADMIN_KEY, "stats"] });
        },
    });
}
