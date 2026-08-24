'use client';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { CompleteProfileType } from "../(pages)/complete-profile/page";
const AUTH_KEY = "auth";
const CURRENT_USER = "currentUser";
const MY_PROFILE = "myProfile";


// login hook
export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { email: string, password: string }) => authService.login(body),
        onSuccess: (data) => {
            console.log("Login successful:", data);
            queryClient.invalidateQueries({ queryKey: [AUTH_KEY] })
        },
        onError: (error) => {
            console.error("Login failed:", error);
        }
    });
}


export function useSignup() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { email: string, password: string }) => authService.signup(body),
        onSuccess: (data) => {
            console.log("Signup successful:", data);
            queryClient.invalidateQueries({ queryKey: [AUTH_KEY] })
        }
    });
}

export function useCompleteProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: CompleteProfileType) => authService.completeProfile(body),
        onSuccess: (data) => {
            console.log("Profile completion successful:", data);
            queryClient.invalidateQueries({ queryKey: [AUTH_KEY] })
        }
    });
}
export function useCheckProfileCompletion() {
    const query = useQuery({
        queryKey: [AUTH_KEY],
        queryFn: () => authService.checkProfileCompletion(),
    });
    return query;
}


export function useGooleLogin() {
    const handleGoogleLogin = () => {
        window.location.href = `http://localhost:8000/oauth2/authorize/google`;
    }
    return { handleGoogleLogin };
}

export function useCurrentUser() {
    const query = useQuery({
        queryKey: [CURRENT_USER],
        queryFn: () => authService.getCurrentUser(),
    });
    return query;
}


export function useSubmitKyc() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: FormData) => authService.submitKyc(body),
        onSuccess: (data) => {
            console.log("KYC submission successful:", data);
            queryClient.invalidateQueries({ queryKey: [AUTH_KEY] });
            queryClient.invalidateQueries({ queryKey: ["myKyc"] });
            queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
        }
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear();
        },
    });
}

export function useMyKyc() {
    return useQuery({
        queryKey: ["myKyc"],
        queryFn: () => authService.getMyKyc(),
        retry: false,
    });
}

// New API: authenticated user's own profile (navbar, profile & settings pages).
export function useMyProfile() {
    return useQuery({
        queryKey: [MY_PROFILE],
        queryFn: () => authService.getProfile(),
        retry: false,
    });
}

function invalidateProfile(queryClient: ReturnType<typeof useQueryClient>) {
    queryClient.invalidateQueries({ queryKey: [MY_PROFILE] });
    queryClient.invalidateQueries({ queryKey: [CURRENT_USER] });
}

// New API: update editable fields of the authenticated user's own profile.
export function useUpdateProfile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: { fname?: string; lname?: string; phoneNumber?: string; dateOfBirth?: string }) =>
            authService.updateProfile(body),
        onSuccess: () => invalidateProfile(queryClient),
    });
}

// New API: upload/replace the authenticated user's own avatar image.
export function useUploadAvatar() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (file: File) => authService.uploadAvatar(file),
        onSuccess: () => invalidateProfile(queryClient),
    });
}
