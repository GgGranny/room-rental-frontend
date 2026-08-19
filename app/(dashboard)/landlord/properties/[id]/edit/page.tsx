"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { useGetPropertyById, useUpdateProperty } from "@/app/hooks/useProperty";

type FormState = { propertyName: string; description: string; country: string; propertyStatus: string };
const emptyForm: FormState = { propertyName: "", description: "", country: "", propertyStatus: "ACTIVE" };

export default function EditPropertyPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data, isLoading } = useGetPropertyById(id);
    const updateProperty = useUpdateProperty();
    const [form, setForm] = useState<FormState>(emptyForm);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const property = (data as any)?.data;

    useEffect(() => {
        if (property) setForm({ ...emptyForm, ...property });
    }, [property]);

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        const landlordId = localStorage.getItem("landlordId");
        if (!landlordId) return toast.error("Your landlord profile is not available. Please sign in again.");
        const body = new FormData();
        body.append("propertyData", JSON.stringify({
            propertyName: form.propertyName,
            landlordId,
            propertyStatus: form.propertyStatus,
            description: form.description,
            country: form.country,
        }));
        if (thumbnail) body.append("propertyThumbnail", thumbnail);
        try {
            await updateProperty.mutateAsync({ id, body });
            toast.success("Property updated successfully");
            router.push(`/landlord/properties/${id}`);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to update property");
        }
    };

    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    return <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 sm:px-6">
        <Link href={`/landlord/properties/${id}`} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" />Back to property</Link>
        <div><h1 className="text-2xl font-bold">Edit property</h1><p className="mt-1 text-sm text-slate-500">Update your property details and thumbnail.</p></div>
        <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
            {([['propertyName','Property name'],['country','Country']] as const).map(([key,label]) => <label key={key} className="text-sm font-semibold">{label}<input required value={form[key]} onChange={e => setForm(current => ({ ...current, [key]: e.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950" /></label>)}
            <div className="text-sm font-semibold">Listing status<p className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-normal text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">{form.propertyStatus}</p><p className="mt-1 text-xs font-normal text-slate-500">Status changes are reviewed by an administrator.</p></div>
            <label className="text-sm font-semibold sm:col-span-2">Description<textarea value={form.description} onChange={e => setForm(current => ({ ...current, description: e.target.value }))} rows={4} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal outline-none focus:border-indigo-500 dark:border-slate-700 dark:bg-slate-950" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Replace thumbnail<input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setThumbnail(e.target.files?.[0] ?? null)} className="mt-2 block w-full text-sm font-normal" /></label>
            <div className="sm:col-span-2 flex justify-end"><button disabled={updateProperty.isPending} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-60"><Save className="h-4 w-4" />{updateProperty.isPending ? 'Saving...' : 'Save changes'}</button></div>
        </form>
    </div>;
}
