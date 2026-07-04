'use client';

import { Mutation, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { CompleteProfileType } from "../(pages)/complete-profile/page";
const AUTH_KEY = "auth";
const CURRENT_USER = "currentUser";


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
        mutationFn: (body: any) => authService.submitKyc(body),
        onSuccess: (data) => {
            console.log("KYC submission successful:", data);
            queryClient.invalidateQueries({ queryKey: [AUTH_KEY] })
        }
    });
}