"use client";

import Link from "next/link";
import { Building2, DoorOpen, Plus, AlertTriangle, Loader2, CheckCircle2 } from "lucide-react";
import { useGetAllProperty } from "@/app/hooks/useProperty";

export default function LandlordDashboard() {
    const { data: response, isLoading, isError } = useGetAllProperty();
    const properties = response?.data ?? [];
    const totalRooms = properties.reduce((sum: number, property: any) => sum + (property.totalRooms ?? 0), 0);
    const activeProperties = properties.filter((property: any) => property.propertyStatus === "ACTIVE").length;

    if (isLoading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    if (isError) return <div className="flex min-h-[50vh] flex-col items-center justify-center gap-2 text-slate-500"><AlertTriangle className="h-8 w-8 text-rose-500" /><p className="text-sm font-semibold">Unable to load your dashboard.</p></div>;

    const cards = [
        { label: "Properties", value: properties.length, detail: "In your portfolio", icon: Building2 },
        { label: "Rooms", value: totalRooms, detail: "Across your portfolio", icon: DoorOpen },
        { label: "Active properties", value: activeProperties, detail: "Ready for room listings", icon: CheckCircle2 },
    ];
    return <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="text-2xl font-black tracking-tight">Landlord dashboard</h1><p className="mt-1 text-sm text-slate-500">Manage your properties and room availability in one place.</p></div><Link href="/landlord/properties/add" className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700"><Plus className="h-4 w-4" />Add property</Link></div>
        <div className="grid gap-4 sm:grid-cols-3">{cards.map(card => { const Icon = card.icon; return <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-wide text-slate-400">{card.label}</span><Icon className="h-5 w-5 text-indigo-600" /></div><p className="mt-3 text-3xl font-black">{card.value}</p><p className="mt-1 text-xs text-slate-500">{card.detail}</p></div>})}</div>
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800"><div><h2 className="text-sm font-bold">Your properties</h2><p className="text-xs text-slate-500">Select a property to manage its rooms.</p></div><Link href="/landlord/properties/all" className="text-xs font-bold text-indigo-600">View all</Link></div>{properties.length ? <div className="divide-y divide-slate-100 dark:divide-slate-800">{properties.slice(0, 5).map((property: any) => <Link key={property.id} href={`/landlord/properties/${property.id}`} className="flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/40"><div className="h-10 w-10 overflow-hidden rounded-lg bg-slate-100">{property.thumbnailUrl && <img src={property.thumbnailUrl} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{property.propertyName}</p><p className="text-xs text-slate-500">{property.city}, {property.district}</p></div><span className="text-xs font-semibold text-slate-500">{property.totalRooms ?? 0} rooms</span></Link>)}</div> : <div className="px-5 py-12 text-center text-sm text-slate-500">No properties yet. Add your first property to start listing rooms.</div>}</section>
    </div>;
}
