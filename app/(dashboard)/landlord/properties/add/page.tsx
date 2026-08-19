"use client";

import { useCreateProperty } from "@/app/hooks/useProperty";
import {
    ArrowLeft,
    Building2,
    Check,
    ImagePlus,
    MapPin,
    Save,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

export enum PropertyStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    PENDING = "PENDING",
}

export interface PropertyRequest {
    propertyName: string;
    landlordId: string;
    propertyStatus: PropertyStatus;
    description: string;
    country: string;
}

const initialFormState: PropertyRequest = {
    propertyName: "",
    landlordId: "",
    propertyStatus: PropertyStatus.ACTIVE,
    description: "",
    country: "",
};

export default function AddPropertyPage() {
    const [form, setForm] = useState<PropertyRequest>(initialFormState);
    const [isSaved, setIsSaved] = useState(false);
    const [file, setFile] = useState<File | null>(null);

    const propertyMutation = useCreateProperty();

    const updateField = <K extends keyof PropertyRequest>(
        field: K,
        value: PropertyRequest[K]
    ) => {
        setIsSaved(false);

        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        const landlordId = localStorage.getItem("landlordId");

        if (!landlordId) {
            toast.error(
                "Your landlord profile is not available. Please sign in again."
            );
            return;
        }

        // Explicitly construct the payload.
        // Only these fields will be sent to the backend.
        const propertyData: PropertyRequest = {
            propertyName: form.propertyName,
            landlordId,
            propertyStatus: form.propertyStatus,
            description: form.description,
            country: form.country,
        };

        const formData = new FormData();

        formData.append(
            "propertyData",
            JSON.stringify(propertyData)
        );

        if (file) {
            formData.append("propertyThumbnail", file);
        }

        try {
            await propertyMutation.mutateAsync(formData);

            setIsSaved(true);

            toast.success("Property Saved Successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save property.");
        }
    };

    const handleReset = () => {
        setForm({
            ...initialFormState,
            landlordId: "",
        });

        setFile(null);
        setIsSaved(false);
    };

    const handleFileChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const fileList = event.target.files;

        if (fileList && fileList.length > 0) {
            setFile(fileList[0]);
            setIsSaved(false);
        }
    };

    return (
        <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl space-y-6">

                {/* Header */}
                <header className="flex flex-col gap-4 border-b border-slate-200 pb-5 dark:border-slate-800 md:flex-row md:items-center md:justify-between">
                    <div>
                        <Link
                            href="/landlord/properties/all"
                            className="mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Properties
                        </Link>

                        <h1 className="text-2xl font-bold">
                            Add Property
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Create a new property listing.
                        </p>
                    </div>

                    {isSaved && (
                        <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                            <Check className="h-4 w-4" />
                            Property saved successfully
                        </div>
                    )}
                </header>

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="grid gap-6 lg:grid-cols-[1fr_320px]"
                >
                    <div className="space-y-6">

                        {/* Property Details */}
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                    <Building2 className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">
                                        Property Details
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Basic information about the property.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">

                                {/* Property Name */}
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-xs font-semibold">
                                        Property Name
                                    </span>

                                    <input
                                        required
                                        value={form.propertyName}
                                        onChange={(e) =>
                                            updateField(
                                                "propertyName",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Sunrise Apartment"
                                        className="h-11 rounded-lg border px-3 text-sm"
                                    />
                                </label>

                                {/* Property Status */}
                                <label className="flex flex-col gap-2 md:col-span-2">
                                    <span className="text-xs font-semibold">
                                        Property Status
                                    </span>

                                    <select
                                        value={form.propertyStatus}
                                        onChange={(e) =>
                                            updateField(
                                                "propertyStatus",
                                                e.target.value as PropertyStatus
                                            )
                                        }
                                        className="h-11 rounded-lg border px-3 text-sm"
                                    >
                                        {Object.values(PropertyStatus).map(
                                            (status) => (
                                                <option
                                                    key={status}
                                                    value={status}
                                                >
                                                    {status}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </label>
                            </div>
                        </section>

                        {/* Location */}
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                                    <MapPin className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">
                                        Location
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Property country.
                                    </p>
                                </div>
                            </div>

                            {/* Country Only */}
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold">
                                    Country
                                </span>

                                <input
                                    required
                                    placeholder="Nepal"
                                    value={form.country}
                                    onChange={(e) =>
                                        updateField(
                                            "country",
                                            e.target.value
                                        )
                                    }
                                    className="h-11 rounded-lg border px-3 text-sm"
                                />
                            </label>
                        </section>

                        {/* Description */}
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <label className="flex flex-col gap-2">
                                <span className="text-xs font-semibold">
                                    Description
                                </span>

                                <textarea
                                    rows={5}
                                    value={form.description}
                                    onChange={(e) =>
                                        updateField(
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Describe your property..."
                                    className="resize-none rounded-lg border px-3 py-3 text-sm"
                                />
                            </label>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-6">

                        {/* Thumbnail */}
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                    <ImagePlus className="h-5 w-5" />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold">
                                        Property Thumbnail
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Upload a thumbnail image.
                                    </p>
                                </div>
                            </div>

                            <label className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-dashed">
                                <ImagePlus className="h-8 w-8 text-slate-400" />

                                <span className="text-sm font-semibold">
                                    {file
                                        ? file.name
                                        : "Add Thumbnail"}
                                </span>

                                <input
                                    onChange={handleFileChange}
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                />
                            </label>
                        </section>

                        {/* Property Summary */}
                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <h2 className="mb-4 text-sm font-bold">
                                Property Summary
                            </h2>

                            <div className="space-y-3 text-sm">

                                {/* Property */}
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        Property
                                    </span>

                                    <span className="max-w-[180px] truncate text-right font-semibold">
                                        {form.propertyName ||
                                            "Not set"}
                                    </span>
                                </div>

                                {/* Status */}
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        Status
                                    </span>

                                    <span className="font-semibold">
                                        {form.propertyStatus}
                                    </span>
                                </div>

                                {/* Country */}
                                <div className="flex justify-between gap-4">
                                    <span className="text-slate-500">
                                        Country
                                    </span>

                                    <span className="font-semibold">
                                        {form.country ||
                                            "Not set"}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-5 grid gap-3">

                                {/* Save */}
                                <button
                                    type="submit"
                                    disabled={
                                        propertyMutation.isPending
                                    }
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Save className="h-4 w-4" />

                                    {propertyMutation.isPending
                                        ? "Saving..."
                                        : "Save Property"}
                                </button>

                                {/* Reset */}
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-sm font-bold"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Clear Form
                                </button>
                            </div>
                        </section>
                    </aside>
                </form>
            </div>
        </div>
    );
}
