import { CompleteProfileType } from "../(pages)/complete-profile/page";
import { apiClient } from "../lib/GlobalApi";


export const authService = {
    login: (data: { email: string; password: string }) => apiClient.post("auth/login", data),
    signup: (data: { email: string; password: string; }) => apiClient.post("auth/register", data),
    checkProfileCompletion: () => apiClient.get("auth/is-profile-complete"),
    completeProfile: (data: CompleteProfileType) => apiClient.post("auth/complete-profile", data),
    getCurrentUser: () => apiClient.get("auth/me"),
    submitKyc: (data: any) => apiClient.post("kyc", data)
}