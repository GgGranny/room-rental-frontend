import { apiClient } from "../lib/GlobalApi";

// Featured-listing payments (landlord only). Backend wraps responses in
// ApiResponse { data }.
export type PaymentGateway = "ESEWA" | "KHALTI";
export type PaymentStatus = "INITIATED" | "SUCCESS" | "FAILED";

export type PaymentInitiateResponse = {
    paymentId: string;
    transactionUuid: string;
    gateway: PaymentGateway;
    amount: number;
    redirectMethod: "GET" | "POST";
    redirectUrl: string;
    formFields?: Record<string, string> | null;
};

export type PaymentSummary = {
    paymentId: string;
    transactionUuid: string;
    gatewayReference?: string;
    gateway: PaymentGateway;
    status: PaymentStatus;
    amount: number;
    featureDays: number;
    paidAt?: string;
    createdAt?: string;
    propertyId?: string;
    propertyName?: string;
    propertyFeatured: boolean;
    propertyFeaturedUntil?: string;
};

type ApiResponse<T> = { data: T };

function unwrap<T>(resp: ApiResponse<T> | T): T {
    return (resp as ApiResponse<T>)?.data ?? (resp as T);
}

export const PaymentService = {
    initiate: async (propertyId: string, gateway: PaymentGateway) =>
        unwrap<PaymentInitiateResponse>(
            await apiClient.post<ApiResponse<PaymentInitiateResponse>>("payments/initiate", { propertyId, gateway }),
        ),
    verify: async (params: { transactionUuid?: string; pidx?: string }) =>
        unwrap<PaymentSummary>(await apiClient.post<ApiResponse<PaymentSummary>>("payments/verify", params)),
    history: async () =>
        unwrap<PaymentSummary[]>(await apiClient.get<ApiResponse<PaymentSummary[]>>("payments/history")),
};

// Hand the browser off to the gateway. eSewa needs a real form POST with signed
// hidden fields; Khalti is a simple GET redirect to the returned payment_url.
export function redirectToGateway(init: PaymentInitiateResponse) {
    if (init.redirectMethod === "POST" && init.formFields) {
        const form = document.createElement("form");
        form.method = "POST";
        form.action = init.redirectUrl;
        Object.entries(init.formFields).forEach(([name, value]) => {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = name;
            input.value = value;
            form.appendChild(input);
        });
        document.body.appendChild(form);
        form.submit();
        return;
    }
    window.location.href = init.redirectUrl;
}
