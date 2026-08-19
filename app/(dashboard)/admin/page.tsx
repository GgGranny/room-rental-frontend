"use client";

import React, { useState } from "react";
import {
    Users,
    Building2,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    UserCheck,
    UserX,
    Eye,
    Sparkles,
    RefreshCw,
    Lock,
    Unlock,
    FileText,
    ExternalLink
} from "lucide-react";
import { toast } from "sonner";
import {
    useAdminStats,
    useAdminUsers,
    useToggleUserStatus,
    useAdminKycs,
    useModerateKyc,
    useAdminProperties,
    useModerateProperty
} from "@/app/hooks/useAdmin";
import { AdminKycRecord, AdminUserResponse, AdminPropertyResponse } from "@/app/services/adminService";

type TabType = "overview" | "users" | "kyc" | "properties";

export default function AdminDashboardPage() {
    const [activeTab, setActiveTab] = useState<TabType>("overview");

    // Queries
    const { data: stats, isLoading: statsLoading, refetch: refetchStats } = useAdminStats();
    const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useAdminUsers();
    const { data: kycs, isLoading: kycsLoading, refetch: refetchKycs } = useAdminKycs();
    const { data: properties, isLoading: propertiesLoading, refetch: refetchProperties } = useAdminProperties();

    // Mutations
    const toggleUserStatus = useToggleUserStatus();
    const moderateKyc = useModerateKyc();
    const moderateProperty = useModerateProperty();

    // Local filters
    const [userSearch, setUserSearch] = useState("");
    const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL");
    const [kycStatusFilter, setKycStatusFilter] = useState<string>("ALL");
    const [propertySearch, setPropertySearch] = useState("");
    const [selectedKycModal, setSelectedKycModal] = useState<AdminKycRecord | null>(null);

    // Refresh all data
    const handleRefresh = () => {
        refetchStats();
        refetchUsers();
        refetchKycs();
        refetchProperties();
        toast.success("Dashboard data refreshed");
    };

    // User status toggle
    const handleToggleUser = async (user: AdminUserResponse) => {
        if (user.role === "ROLE_ADMIN") {
            toast.error("Admin accounts cannot be blocked");
            return;
        }
        const newStatus = !user.active;
        try {
            await toggleUserStatus.mutateAsync({ userId: user.userId, active: newStatus });
            toast.success(`User ${user.email} is now ${newStatus ? "Active" : "Blocked"}`);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to update user status");
        }
    };

    // Moderate KYC
    const handleKycDecision = async (kycId: number, status: "APPROVED" | "REJECTED") => {
        try {
            await moderateKyc.mutateAsync({ kycId, status });
            toast.success(`KYC #${kycId} marked as ${status}`);
            if (selectedKycModal?.kycId === kycId) {
                setSelectedKycModal(null);
            }
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to update KYC status");
        }
    };

    // Moderate Property
    const handlePropertyStatus = async (property: AdminPropertyResponse) => {
        const nextStatus = property.propertyStatus === "BLOCKED_BY_ADMIN" ? "ACTIVE" : "BLOCKED_BY_ADMIN";
        try {
            await moderateProperty.mutateAsync({ propertyId: property.id, status: nextStatus });
            toast.success(`Property "${property.propertyName}" status set to ${nextStatus}`);
        } catch (err: unknown) {
            const error = err as Error;
            toast.error(error.message || "Failed to update property status");
        }
    };

    // Filtered Users
    const filteredUsers = (users || []).filter((u) => {
        const matchesSearch =
            (u.email || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.fname || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.lname || "").toLowerCase().includes(userSearch.toLowerCase()) ||
            (u.userId || "").toLowerCase().includes(userSearch.toLowerCase());
        const matchesRole = userRoleFilter === "ALL" || u.role === userRoleFilter;
        return matchesSearch && matchesRole;
    });

    // Filtered KYCs
    const filteredKycs = (kycs || []).filter((k) => {
        if (kycStatusFilter === "ALL") return true;
        return k.kycStatus === kycStatusFilter;
    });

    // Filtered Properties
    const filteredProperties = (properties || []).filter((p) => {
        return (
            (p.propertyName || "").toLowerCase().includes(propertySearch.toLowerCase()) ||
            (p.city || "").toLowerCase().includes(propertySearch.toLowerCase()) ||
            (p.district || "").toLowerCase().includes(propertySearch.toLowerCase())
        );
    });

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                        <ShieldCheck className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        Admin Dashboard
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                        System oversight, account management, landlord KYC approvals, and property moderation.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors text-slate-700 dark:text-slate-300"
                    >
                        <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                {[
                    { id: "overview", label: "Overview Metrics", icon: ShieldCheck, badge: null },
                    { id: "users", label: "Users Management", icon: Users, badge: stats?.totalUsers },
                    { id: "kyc", label: "KYC Verification", icon: FileText, badge: stats?.pendingKyc ? `${stats.pendingKyc} Pending` : null },
                    { id: "properties", label: "Property Moderation", icon: Building2, badge: stats?.totalProperties },
                ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                                isActive
                                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                                    : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {tab.badge !== null && tab.badge !== undefined && (
                                <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                        isActive
                                            ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                                    }`}
                                >
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* TAB 1: OVERVIEW METRICS */}
            {activeTab === "overview" && (
                <div className="space-y-6">
                    {statsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Aggregate Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Accounts</span>
                                        <Users className="w-5 h-5 text-indigo-500" />
                                    </div>
                                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                                        {stats?.totalUsers || 0}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex gap-3">
                                        <span>Tenants: <strong className="text-slate-700 dark:text-slate-200">{stats?.totalTenants || 0}</strong></span>
                                        <span>Landlords: <strong className="text-slate-700 dark:text-slate-200">{stats?.totalLandlords || 0}</strong></span>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Properties</span>
                                        <Building2 className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                                        {stats?.totalProperties || 0}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex gap-3">
                                        <span className="text-emerald-600 font-semibold">Active: {stats?.activeProperties || 0}</span>
                                        <span className="text-rose-600 font-semibold">Blocked: {stats?.blockedProperties || 0}</span>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">KYC Records</span>
                                        <FileText className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mt-2">
                                        {stats?.totalKyc || 0}
                                    </div>
                                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 flex gap-3">
                                        <span className="text-amber-600 font-semibold">Pending: {stats?.pendingKyc || 0}</span>
                                        <span className="text-emerald-600 font-semibold">Approved: {stats?.approvedKyc || 0}</span>
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md relative overflow-hidden">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">Action Required</span>
                                        <AlertCircle className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <div className="text-xl font-black mt-2 font-mono">
                                        {stats?.pendingKyc || 0} Pending KYC
                                    </div>
                                    <button
                                        onClick={() => setActiveTab("kyc")}
                                        className="mt-3 text-xs font-bold underline hover:text-indigo-300 transition-colors flex items-center gap-1"
                                    >
                                        Review Submissions &rarr;
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* TAB 2: USER MANAGEMENT */}
            {activeTab === "users" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search email, name, or ID..."
                                value={userSearch}
                                onChange={(e) => setUserSearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        <div className="flex items-center gap-2 self-start sm:self-auto">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={userRoleFilter}
                                onChange={(e) => setUserRoleFilter(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
                            >
                                <option value="ALL">All Roles</option>
                                <option value="ROLE_USER">Tenants (ROLE_USER)</option>
                                <option value="ROLE_LANDLORD">Landlords (ROLE_LANDLORD)</option>
                                <option value="ROLE_ADMIN">Admins (ROLE_ADMIN)</option>
                            </select>
                        </div>
                    </div>

                    {/* Table */}
                    {usersLoading ? (
                        <div className="p-8 text-center text-xs text-slate-400">Loading user accounts...</div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">No users match your criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                                        <th className="py-3 px-4">User</th>
                                        <th className="py-3 px-4">Email</th>
                                        <th className="py-3 px-4">Phone</th>
                                        <th className="py-3 px-4">Role</th>
                                        <th className="py-3 px-4">KYC Status</th>
                                        <th className="py-3 px-4">Active Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredUsers.map((u) => {
                                        const fullName = `${u.fname || ""} ${u.lname || ""}`.trim() || "N/A";
                                        const isBlocked = !u.active;

                                        return (
                                            <tr key={u.userId} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                                                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                                    <div>{fullName}</div>
                                                    <span className="text-[10px] font-mono text-slate-400 font-normal">{u.userId}</span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{u.email}</td>
                                                <td className="py-3 px-4 font-mono text-slate-500">{u.phoneNumber || "—"}</td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                            u.role === "ROLE_ADMIN"
                                                                ? "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
                                                                : u.role === "ROLE_LANDLORD"
                                                                ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                                                                : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                                        }`}
                                                    >
                                                        {u.role === "ROLE_ADMIN" ? "ADMIN" : u.role === "ROLE_LANDLORD" ? "LANDLORD" : "TENANT"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4">
                                                    {u.kycStatus ? (
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                                u.kycStatus === "APPROVED"
                                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                    : u.kycStatus === "REJECTED"
                                                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                                                    : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                                            }`}
                                                        >
                                                            {u.kycStatus}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px]">Not Submitted</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                                            u.active
                                                                ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800"
                                                                : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-800"
                                                        }`}
                                                    >
                                                        {u.active ? "ACTIVE" : "BLOCKED"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    {u.role !== "ROLE_ADMIN" && (
                                                        <button
                                                            onClick={() => handleToggleUser(u)}
                                                            disabled={toggleUserStatus.isPending}
                                                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto ${
                                                                isBlocked
                                                                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                                    : "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800"
                                                            }`}
                                                        >
                                                            {isBlocked ? (
                                                                <>
                                                                    <Unlock className="w-3.5 h-3.5" /> Activate
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Lock className="w-3.5 h-3.5" /> Block
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 3: KYC VERIFICATION */}
            {activeTab === "kyc" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
                    {/* Controls */}
                    <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Landlord KYC Applications</h3>
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select
                                value={kycStatusFilter}
                                onChange={(e) => setKycStatusFilter(e.target.value)}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-xl px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-none"
                            >
                                <option value="ALL">All Statuses</option>
                                <option value="PENDING">Pending</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                    </div>

                    {/* KYC Table */}
                    {kycsLoading ? (
                        <div className="p-8 text-center text-xs text-slate-400">Loading KYC submissions...</div>
                    ) : filteredKycs.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">No KYC records match filter.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                                        <th className="py-3 px-4">Applicant Name</th>
                                        <th className="py-3 px-4">Document Type</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4">Contact</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredKycs.map((k) => {
                                        const name = `${k.firstName || ""} ${k.lastName || ""}`.trim() || "Landlord Applicant";
                                        const location = `${k.city || ""}, ${k.country || "Nepal"}`.trim();

                                        return (
                                            <tr key={k.kycId} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                                                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                                    <div>{name}</div>
                                                    <span className="text-[10px] font-mono text-slate-400 font-normal">KYC #{k.kycId}</span>
                                                </td>
                                                <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                                                    {k.documentType || "CITIZENSHIP"}
                                                </td>
                                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{location}</td>
                                                <td className="py-3 px-4 font-mono text-slate-500">{k.phoneNumber || "—"}</td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                            k.kycStatus === "APPROVED"
                                                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                                : k.kycStatus === "REJECTED"
                                                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                                                : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                                                        }`}
                                                    >
                                                        {k.kycStatus}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setSelectedKycModal(k)}
                                                        className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-bold transition-all flex items-center gap-1"
                                                    >
                                                        <Eye className="w-3.5 h-3.5" /> Details
                                                    </button>
                                                    {k.kycStatus === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleKycDecision(k.kycId, "APPROVED")}
                                                                disabled={moderateKyc.isPending}
                                                                className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all flex items-center gap-1"
                                                            >
                                                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleKycDecision(k.kycId, "REJECTED")}
                                                                disabled={moderateKyc.isPending}
                                                                className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition-all flex items-center gap-1"
                                                            >
                                                                <XCircle className="w-3.5 h-3.5" /> Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* TAB 4: PROPERTY MODERATION */}
            {activeTab === "properties" && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4 p-5">
                    {/* Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="relative w-full sm:w-80">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Search property name, city, or district..."
                                value={propertySearch}
                                onChange={(e) => setPropertySearch(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500"
                            />
                        </div>
                    </div>

                    {/* Properties Table */}
                    {propertiesLoading ? (
                        <div className="p-8 text-center text-xs text-slate-400">Loading system properties...</div>
                    ) : filteredProperties.length === 0 ? (
                        <div className="p-8 text-center text-xs text-slate-400">No properties match search criteria.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                                        <th className="py-3 px-4">Property</th>
                                        <th className="py-3 px-4">Location</th>
                                        <th className="py-3 px-4">Rooms</th>
                                        <th className="py-3 px-4">Featured</th>
                                        <th className="py-3 px-4">Status</th>
                                        <th className="py-3 px-4 text-right">Moderation</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {filteredProperties.map((p) => {
                                        const location = `${p.city || ""}, ${p.district || ""}`.trim() || "Nepal";
                                        const isBlocked = p.propertyStatus === "BLOCKED_BY_ADMIN";

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/40 transition-colors">
                                                <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                                                    <div>{p.propertyName}</div>
                                                    <span className="text-[10px] font-mono text-slate-400 font-normal">{p.id}</span>
                                                </td>
                                                <td className="py-3 px-4 font-medium text-slate-700 dark:text-slate-300">{location}</td>
                                                <td className="py-3 px-4 font-mono font-bold text-slate-700 dark:text-slate-300">
                                                    {p.totalRooms ?? 0}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {p.featured ? (
                                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                                            <Sparkles className="w-3 h-3 text-amber-500" /> Featured
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 text-[10px]">Normal</span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-4">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                                            isBlocked
                                                                ? "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300"
                                                                : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                                        }`}
                                                    >
                                                        {p.propertyStatus || "ACTIVE"}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right">
                                                    <button
                                                        onClick={() => handlePropertyStatus(p)}
                                                        disabled={moderateProperty.isPending}
                                                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 ml-auto ${
                                                            isBlocked
                                                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                                                : "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950 dark:hover:bg-rose-900 border border-rose-200 dark:border-rose-800"
                                                        }`}
                                                    >
                                                        {isBlocked ? (
                                                            <>
                                                                <Unlock className="w-3.5 h-3.5" /> Re-instate
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Lock className="w-3.5 h-3.5" /> Block Listing
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* KYC DETAILS MODAL */}
            {selectedKycModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden space-y-4 p-6 relative">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h3 className="text-base font-black text-slate-900 dark:text-white">
                                KYC Verification Application #{selectedKycModal.kycId}
                            </h3>
                            <button
                                onClick={() => setSelectedKycModal(null)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div>
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Full Name</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {selectedKycModal.firstName} {selectedKycModal.lastName}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Document Type</span>
                                <span className="font-bold text-slate-800 dark:text-slate-200">
                                    {selectedKycModal.documentType || "CITIZENSHIP"}
                                </span>
                            </div>

                            <div>
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Contact Phone</span>
                                <span className="font-mono text-slate-800 dark:text-slate-200">{selectedKycModal.phoneNumber || "—"}</span>
                            </div>

                            <div>
                                <span className="text-slate-400 font-semibold uppercase tracking-wider block">Address</span>
                                <span className="text-slate-800 dark:text-slate-200">
                                    {selectedKycModal.addressLine1}, {selectedKycModal.city}, {selectedKycModal.country || "Nepal"}
                                </span>
                            </div>
                        </div>

                        {/* Document previews */}
                        <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Submitted Documents</span>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {selectedKycModal.frontImageUrl && (
                                    <a
                                        href={selectedKycModal.frontImageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Front Document <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {selectedKycModal.backImageUrl && (
                                    <a
                                        href={selectedKycModal.backImageUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Back Document <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                                {selectedKycModal.selfieUrl && (
                                    <a
                                        href={selectedKycModal.selfieUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs font-semibold text-indigo-600 hover:underline"
                                    >
                                        Selfie Verification <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {selectedKycModal.kycStatus === "PENDING" && (
                            <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                                <button
                                    onClick={() => handleKycDecision(selectedKycModal.kycId, "REJECTED")}
                                    disabled={moderateKyc.isPending}
                                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all"
                                >
                                    Reject Application
                                </button>
                                <button
                                    onClick={() => handleKycDecision(selectedKycModal.kycId, "APPROVED")}
                                    disabled={moderateKyc.isPending}
                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                                >
                                    Approve Landlord KYC
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
