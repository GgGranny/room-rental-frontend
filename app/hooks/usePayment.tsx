"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PaymentGateway, PaymentService } from "../services/paymentService";

const PAYMENT_KEY = "payments";

// Landlord: start a featuring payment; returns gateway redirect info.
export function useInitiatePayment() {
    return useMutation({
        mutationFn: ({ propertyId, gateway }: { propertyId: string; gateway: PaymentGateway }) =>
            PaymentService.initiate(propertyId, gateway),
    });
}

// Landlord: confirm a payment after the gateway redirects back.
export function useVerifyPayment() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (params: { transactionUuid?: string; pidx?: string }) => PaymentService.verify(params),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PAYMENT_KEY] });
            queryClient.invalidateQueries({ queryKey: ["property"] });
        },
    });
}

// Landlord: featuring payment history.
export function usePaymentHistory() {
    return useQuery({
        queryKey: [PAYMENT_KEY, "history"],
        queryFn: () => PaymentService.history(),
    });
}
