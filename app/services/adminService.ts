import { apiClient } from "../lib/GlobalApi";

export type AdminDashboardStats = {
    totalUsers: number;
    totalTenants: number;
    totalLandlords: number;
    totalAdmins: number;
    totalProperties: number;
    activeProperties: number;
    blockedProperties: number;
    totalKyc: number;
    pendingKyc: number;
    approvedKyc: number;
    rejectedKyc: number;
};

export type AdminUserResponse = {
    userId: string;
    email: string;
    phoneNumber?: string;
    role: "ROLE_USER" | "ROLE_LANDLORD" | "ROLE_ADMIN";
    fname?: string;
    lname?: string;
    dateOfBirth?: string;
    profilePictureUrl?: string;
    provider?: string;
    verified: boolean;
    active: boolean;
    profileCompleted: boolean;
    kycSubmitted: boolean;
    kycStatus?: "PENDING" | "APPROVED" | "REJECTED";
};

export type AdminKycRecord = {
    kycId: number;
    customerId?: string;
    kycStatus: "PENDING" | "APPROVED" | "REJECTED";
    submittedAt?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    dateOfBirth?: string;
    gender?: string;
    documentType?: string;
    frontImageUrl?: string;
    backImageUrl?: string;
    selfieUrl?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    phoneNumber?: string;
    alternatePhone?: string;
    user?: {
        userId?: string;
        email?: string;
        fname?: string;
        lname?: string;
    };
};

export type AdminPropertyResponse = {
    id: string;
    propertyName: string;
    propertyStatus: string; // e.g. ACTIVE, BLOCKED_BY_ADMIN
    description?: string;
    thumbnailUrl?: string;
    city?: string;
    district?: string;
    province?: string;
    zipCode?: string;
    country?: string;
    totalRooms?: number;
    featured?: boolean;
    featuredUntil?: string;
};

type ApiResponse<T> = { data: T };

type AdminKycEnvelope = {
    user?: AdminKycRecord["user"];
    kyc?: Omit<AdminKycRecord, "user"> | null;
};

function unwrap<T>(resp: ApiResponse<T> | T): T {
    return (resp as ApiResponse<T>)?.data ?? (resp as T);
}

export const adminService = {
    getStats: async (): Promise<AdminDashboardStats> =>
        unwrap<AdminDashboardStats>(await apiClient.get<ApiResponse<AdminDashboardStats>>("admin/stats")),

    getAllUsers: async (): Promise<AdminUserResponse[]> =>
        unwrap<AdminUserResponse[]>(await apiClient.get<ApiResponse<AdminUserResponse[]>>("admin/users")),

    setUserActiveStatus: async (userId: string, active: boolean): Promise<AdminUserResponse> =>
        unwrap<AdminUserResponse>(await apiClient.patch<ApiResponse<AdminUserResponse>>(`admin/users/${userId}/status/${active}`, {})),

    // The existing endpoint returns one `{ user, kyc }` entry per user, including
    // users without KYC. Present only submitted KYC records to the review UI.
    getAllKycs: async (): Promise<AdminKycRecord[]> => {
        const records = unwrap<AdminKycEnvelope[]>(await apiClient.get<ApiResponse<AdminKycEnvelope[]>>("admin/kyc"));
        return records
            .filter((record): record is AdminKycEnvelope & { kyc: Omit<AdminKycRecord, "user"> } => Boolean(record.kyc))
            .map(record => ({ ...record.kyc, user: record.user }));
    },

    moderateKyc: async (kycId: number, status: "APPROVED" | "REJECTED"): Promise<AdminKycRecord> =>
        unwrap<AdminKycRecord>(await apiClient.patch<ApiResponse<AdminKycRecord>>(`admin/kyc/${kycId}/${status}`, {})),

    getAllProperties: async (): Promise<AdminPropertyResponse[]> =>
        unwrap<AdminPropertyResponse[]>(await apiClient.get<ApiResponse<AdminPropertyResponse[]>>("admin/properties")),

    moderateProperty: async (propertyId: string, status: "ACTIVE" | "BLOCKED_BY_ADMIN"): Promise<AdminPropertyResponse> =>
        unwrap<AdminPropertyResponse>(await apiClient.patch<ApiResponse<AdminPropertyResponse>>(`admin/properties/${propertyId}/status/${status}`, {})),
};
