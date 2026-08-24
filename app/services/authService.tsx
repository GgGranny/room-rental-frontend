import { CompleteProfileType } from "../(pages)/complete-profile/page";
import { apiClient } from "../lib/GlobalApi";


export const authService = {
    login: (data: { email: string; password: string }) => apiClient.post("auth/login", data),
    signup: (data: { email: string; password: string; }) => apiClient.post("auth/register", data),
    checkProfileCompletion: () => apiClient.get("auth/is-profile-complete"),
    completeProfile: (data: CompleteProfileType) => apiClient.post("auth/complete-profile", data),
    getCurrentUser: () => apiClient.get("auth/me"),
    submitKyc: (data: any) => apiClient.post("kyc", data),
    getMyKyc: () => apiClient.get("kyc/status"),
    logout: () => apiClient.post("auth/logout", {}),
    // New API: authenticated, self-service profile endpoints (all roles).
    getProfile: () => apiClient.get<{ data: UserProfile }>("profile"),
    updateProfile: (data: { fname?: string; lname?: string; phoneNumber?: string; dateOfBirth?: string }) =>
        apiClient.put<{ data: UserProfile }>("profile", data),
    uploadAvatar: (file: File) => {
        const form = new FormData();
        form.append("file", file);
        return apiClient.post<{ data: UserProfile }>("profile/avatar", form);
    },
}

export type UserProfile = {
    userId?: string;
    email?: string;
    phoneNumber?: string | null;
    role?: string;
    fname?: string | null;
    lname?: string | null;
    dateOfBirth?: string | null;
    profilePictureUrl?: string | null;
    provider?: string | null;
    verified?: boolean;
    active?: boolean;
    profileCompleted?: boolean;
    kycSubmitted?: boolean;
    kycStatus?: "PENDING" | "APPROVED" | "REJECTED" | null;
}
