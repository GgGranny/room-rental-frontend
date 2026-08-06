"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Loader2, MapPin, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useGetRoomById, useRemoveRoomImage, useUpdateRoom } from "@/app/hooks/useRoom";
import type { RoomDetails, RoomImageResponse } from "@/app/services/roomService";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });
type RoomForm = {
    roomTitle: string; description: string; location: string; address: string; price: string | number; status: string;
    preferredTenants: string[]; rules: string; facilities: string; roomType: string; floorNumber: string | number | null;
    totalRooms: string | number | null;
};
const emptyForm: RoomForm = { roomTitle: "", description: "", location: "", address: "", price: "", status: "AVAILABLE", preferredTenants: [], rules: "", facilities: "", roomType: "", floorNumber: null, totalRooms: null };
const fields: Array<[keyof Pick<RoomForm, "roomTitle" | "price" | "roomType" | "floorNumber" | "totalRooms">, string]> = [["roomTitle", "Room title"], ["price", "Monthly price"], ["roomType", "Room type"], ["floorNumber", "Floor number"], ["totalRooms", "Total rooms"]];

export default function EditRoomPage() {
    const { id, roomId } = useParams<{ id: string; roomId: string }>();
    const router = useRouter();
    const { data: room, isLoading } = useGetRoomById(roomId);
    const updateRoom = useUpdateRoom();
    const removeRoomImage = useRemoveRoomImage();
    const [form, setForm] = useState<RoomForm>(emptyForm);
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<RoomImageResponse[]>([]);
    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);
    const [position, setPosition] = useState({ lat: 7.2906, lng: 80.6337 });

    useEffect(() => {
        if (!room) return;
        // The form mirrors server data only when the room query changes.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setForm({ roomTitle: room.roomTitle, description: room.description ?? "", location: room.location ?? room.address ?? "", address: room.address ?? room.location ?? "", price: room.price, status: room.status, preferredTenants: room.preferredTenants ?? [], rules: (room.rules ?? []).join(", "), facilities: (room.facilities ?? []).join(", "), roomType: room.roomType ?? "", floorNumber: room.floorNumber ?? null, totalRooms: room.totalRooms ?? null });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setExistingImages(room.imageUrls ?? []);
        if (Number.isFinite(room.latitude) && Number.isFinite(room.Longitude)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setPosition({ lat: room.latitude!, lng: room.Longitude! });
        }
    }, [room]);

    const createRoomPayload = () => {
        return { ...form, propertyId: id, latitude: position.lat, longitude: position.lng, price: Number(form.price), floorNumber: form.floorNumber ? Number(form.floorNumber) : null, totalRooms: form.totalRooms ? Number(form.totalRooms) : null, rules: form.rules.split(",").map(value => value.trim()).filter(Boolean), facilities: form.facilities.split(",").map(value => value.trim()).filter(Boolean) };
    };

    const removeImage = async (image: RoomImageResponse) => {
        if (deletingImageId !== null) return;
        if (!confirm("Remove this image from the room?")) return;
        setDeletingImageId(image.id);
        const body = new FormData();
        body.append("roomData", JSON.stringify(createRoomPayload()));
        try {
            await removeRoomImage.mutateAsync({ roomId, imageId: image.id, body });
            setExistingImages((current) => current.filter((currentImage) => currentImage.id !== image.id));
            toast.success("Room image removed");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to remove this image");
        } finally {
            setDeletingImageId(null);
        }
    };

    const submit = async (event: FormEvent) => {
        event.preventDefault();
        if (!form.location) return toast.error("Choose the room location from the map.");
        const body = new FormData();
        const payload = createRoomPayload();
        body.append("roomData", JSON.stringify(payload)); images.forEach(image => body.append("roomImages", image));
        try { await updateRoom.mutateAsync({ id: roomId, body }); toast.success("Room updated successfully"); router.push(`/landlord/properties/${id}/rooms/${roomId}`); }
        catch (error) { toast.error(error instanceof Error ? error.message : "Unable to update room"); }
    };

    if (isLoading || !room) return <div className="flex justify-center py-24"><Loader2 className="h-6 w-6 animate-spin text-indigo-600" /></div>;
    return <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6">
        <Link href={`/landlord/properties/${id}/rooms/${roomId}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500"><ArrowLeft className="h-4 w-4" />Back to room</Link>
        <div><h1 className="text-2xl font-bold">Edit room</h1><p className="mt-1 text-sm text-slate-500">Update room details, images and its precise map location.</p></div>
        <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:grid-cols-2">
            {fields.map(([key, label]) => <label key={key} className="text-sm font-semibold">{label}<input required={["roomTitle", "price"].includes(key)} type={["price", "floorNumber", "totalRooms"].includes(key) ? "number" : "text"} value={form[key] ?? ""} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" /></label>)}
            <label className="text-sm font-semibold">Status<select value={form.status} onChange={event => setForm(current => ({ ...current, status: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950">{["AVAILABLE", "BOOKED", "MAINTENANCE", "UNAVAILABLE"].map(status => <option key={status}>{status}</option>)}</select></label>
            <div className="space-y-2 sm:col-span-2"><label className="block text-sm font-semibold">Room location</label><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3 z-10 h-4 w-4 text-slate-400" /><input value={form.address || "Search, click, or drag the map marker"} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950" /></div><div className="h-80 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700"><Map lat={position.lat} lng={position.lng} searchable onLocationChange={({ lat, lng, address }) => { setPosition({ lat, lng }); setForm(current => ({ ...current, location: address, address })); }} /></div><p className="text-xs text-slate-500">Search, click, or drag the pin to update the address and coordinates automatically.</p></div>
            <label className="text-sm font-semibold sm:col-span-2">Description<textarea rows={4} value={form.description} onChange={event => setForm(current => ({ ...current, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Facilities (comma-separated)<input value={form.facilities} onChange={event => setForm(current => ({ ...current, facilities: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Rules (comma-separated)<input value={form.rules} onChange={event => setForm(current => ({ ...current, rules: event.target.value }))} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-normal dark:border-slate-700 dark:bg-slate-950" /></label>
            <div className="space-y-3 sm:col-span-2"><div><label className="text-sm font-semibold">Room images</label><p className="mt-1 text-xs text-slate-500">Remove images individually or add new ones before saving.</p></div>{existingImages.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">{existingImages.map((image) => { const deleting = deletingImageId === image.id; return <div key={image.id} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-slate-100 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-950"><img src={image.url} alt="Room" className={`h-full w-full object-cover transition-opacity ${deleting ? "opacity-40" : "group-hover:scale-105"}`} /><button type="button" onClick={() => removeImage(image)} disabled={deletingImageId !== null} aria-label="Remove room image" className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900/80 text-white shadow-sm transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-70">{deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-4 w-4" />}</button>{deleting && <span className="absolute inset-x-0 bottom-0 bg-slate-900/75 px-2 py-1 text-center text-[10px] font-semibold text-white">Removing…</span>}</div>; })}</div>}{existingImages.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 px-4 py-5 text-center text-sm text-slate-500 dark:border-slate-700">No uploaded room images yet.</div>}<label className="block text-sm font-semibold">Add images<input type="file" multiple accept="image/*" onChange={event => setImages(Array.from(event.target.files ?? []))} className="mt-2 block text-sm font-normal" /></label>{images.length > 0 && <p className="text-xs text-slate-500">{images.length} new image{images.length === 1 ? "" : "s"} will be added when you save.</p>}</div>
            <div className="flex justify-end sm:col-span-2"><button disabled={updateRoom.isPending} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><Save className="h-4 w-4" />{updateRoom.isPending ? "Saving..." : "Save changes"}</button></div>
        </form>
    </div>;
}
