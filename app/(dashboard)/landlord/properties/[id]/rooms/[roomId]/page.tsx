"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ImageOff, Loader2, MapPin, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useDeleteRoom, useGetRoomById, useUpdateRoomStatus } from "@/app/hooks/useRoom";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
const statuses = ["AVAILABLE", "BOOKED", "MAINTENANCE", "UNAVAILABLE"];

export default function RoomDetailPage() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const router = useRouter();
    const { data: room, isLoading, isError } = useGetRoomById(roomId);
    const updateStatus = useUpdateRoomStatus();
    const deleteRoom = useDeleteRoom();
    const images = room?.imageUrls ?? [];
    const hasCoordinates = Number.isFinite(room?.latitude) && Number.isFinite(room?.Longitude);
    const changeStatus = async (status: string) => { try { await updateStatus.mutateAsync({ id: roomId, status }); toast.success("Room availability updated"); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to update room status"); } };
    const remove = async () => { if (!confirm("Delete this room? This cannot be undone.")) return; try { await deleteRoom.mutateAsync(roomId); toast.success("Room deleted"); router.push(`/landlord/properties/${id}`); } catch (error) { toast.error(error instanceof Error ? error.message : "Unable to delete room"); } };
    if (isLoading) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    if (isError || !room) return <div className="p-8 text-sm text-rose-600">Unable to load this room.</div>;
    return <div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3"><Link href={`/landlord/properties/${id}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-600"><ArrowLeft className="h-4 w-4" />Back to property</Link><div className="flex gap-2"><Link href={`/landlord/properties/${id}/rooms/${roomId}/edit`} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50 dark:border-slate-700"><Pencil className="h-3.5 w-3.5" />Edit</Link><button onClick={remove} disabled={deleteRoom.isPending} className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3 py-2 text-xs font-bold text-white disabled:opacity-60"><Trash2 className="h-3.5 w-3.5" />Delete</button></div></div>
        <div className="grid gap-6 lg:grid-cols-[1.4fr_.6fr]"><section className="space-y-6"><div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 dark:bg-slate-800">{images.length ? images.map((image: any) => <img key={image.id} src={image.url} alt={room.roomTitle} className="h-56 w-full rounded-lg object-cover" />) : <div className="col-span-2 flex h-56 items-center justify-center text-slate-400"><ImageOff className="h-8 w-8" /></div>}</div><div className="space-y-4 p-5"><div><h1 className="text-2xl font-black">{room.roomTitle}</h1><p className="mt-1 flex items-center gap-1 text-sm text-slate-500"><MapPin className="h-4 w-4" />{room.address || room.location}</p></div><p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{room.description || "No description provided."}</p><div className="grid grid-cols-2 gap-3 text-sm"><div><span className="text-slate-400">Price</span><p className="font-bold">Rs {Number(room.price).toLocaleString()}/mo</p></div><div><span className="text-slate-400">Room type</span><p className="font-bold">{room.roomType || "Not specified"}</p></div><div><span className="text-slate-400">Floor</span><p className="font-bold">{room.floorNumber ?? "—"}</p></div><div><span className="text-slate-400">Units</span><p className="font-bold">{room.totalRooms ?? "—"}</p></div></div></div></div>{hasCoordinates && <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div className="mb-3"><h2 className="text-sm font-bold">Room location</h2><p className="mt-1 text-xs text-slate-500">Use the search, zoom, pan, or marker to explore this location.</p></div><div className="h-80 overflow-hidden rounded-xl"><Map lat={room.latitude} lng={room.Longitude} searchable /></div></section>}</section><aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><div><h2 className="text-sm font-bold">Availability</h2><select value={room.status} onChange={event => changeStatus(event.target.value)} disabled={updateStatus.isPending} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold dark:border-slate-700 dark:bg-slate-950">{statuses.map(status => <option key={status}>{status}</option>)}</select></div><div><h2 className="text-sm font-bold">Facilities</h2><p className="mt-2 text-sm text-slate-500">{room.facilities?.length ? room.facilities.join(", ") : "None listed"}</p></div><div><h2 className="text-sm font-bold">Rules</h2><p className="mt-2 text-sm text-slate-500">{room.rules?.length ? room.rules.join(", ") : "None listed"}</p></div></aside></div>
    </div>;
}
