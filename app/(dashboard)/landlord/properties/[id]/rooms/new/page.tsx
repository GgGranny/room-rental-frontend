'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowLeft, Building2, CheckCircle2, CircleDollarSign, House, MapPin, ShieldCheck, Sparkles } from 'lucide-react';
import { useSaveRoom } from '@/app/hooks/useRoom';
import { useMyKyc } from '@/app/hooks/useAuth';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

interface RoomFormState {
    roomTitle: string;
    description: string;
    location: string;
    price: string;
    status: string;
    preferredTenants: string[];
    rules: string;
    facilities: string;
    roomType: string;
    floorNumber: string;
    totalRooms: string;
    address: string;
    latitude: string;
    longitude: string;
    propertyId: string;
}

const tenantOptions = ['STUDENTS', 'WORKING_PROFESSIONALS', 'FAMILIES', 'MALE', 'FEMALE', 'ANY'];
const statusOptions = ['AVAILABLE', 'BOOKED', 'MAINTENANCE', 'UNAVAILABLE'];
const roomTypeOptions = ['Single', 'Shared', 'Studio', 'Master'];

const createInitialState = (propertyId: string): RoomFormState => ({
    roomTitle: '',
    description: '',
    location: '',
    price: '',
    status: 'AVAILABLE',
    preferredTenants: ['ANY'],
    rules: '',
    facilities: '',
    roomType: 'Single',
    floorNumber: '',
    totalRooms: '',
    address: '',
    latitude: '',
    longitude: '',
    propertyId,
});

export default function NewRoomPage() {
    const router = useRouter();
    const params = useParams<{ id?: string }>();
    const propertyId = Array.isArray(params.id) ? params.id[0] : params.id ?? '';
    const [form, setForm] = useState<RoomFormState>(() => createInitialState(propertyId));
    const [step, setStep] = useState(0);
    const [error, setError] = useState('');
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number }>({ lat: 7.2906, lng: 80.6337 });
    const { mutate, isPending } = useSaveRoom();
    const { data: kycResponse, isLoading: isKycLoading } = useMyKyc();
    const kycStatus = (kycResponse as { data?: { kycStatus?: string } } | undefined)?.data?.kycStatus;
    const canCreateRoom = kycStatus === 'APPROVED';

    useEffect(() => {
        console.log('KYC status:', kycStatus, 'Can create room:', canCreateRoom);
    }, [kycStatus, canCreateRoom]);

    const steps = [
        { title: 'Basic details', description: 'Name, price and room setup' },
        { title: 'Location', description: 'Address and map details' },
        { title: 'Preferences', description: 'Rules, facilities and tenants' },
        { title: 'Review', description: 'Confirm and publish' },
    ];

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const toggleTenant = (value: string) => {
        setForm((prev) => {
            const selected = prev.preferredTenants.includes(value)
                ? prev.preferredTenants.filter((item) => item !== value)
                : [...prev.preferredTenants, value];

            return { ...prev, preferredTenants: selected };
        });
    };

    const handleImageSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        setSelectedImages(files);
    };

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
                    setSelectedPosition(pos);
                    setForm((current) => ({ ...current, latitude: String(pos.lat), longitude: String(pos.lng) }));
                },
                (error) => {
                    console.error('Error or permission denied:', error.message);
                }
            );
        }
    }, []);

    const handleNext = () => {
        if (step === 0 && (!form.roomTitle.trim() || !form.price)) {
            setError('Please provide a room title and price before continuing.');
            return;
        }
        if (step === 1 && !form.location.trim()) {
            setError('Choose the room location from the map before continuing.');
            return;
        }

        setError('');
        setStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    const handleBack = () => {
        setError('');
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError('');

        // Build payload matching RoomDetailsResponseDto fields. Only include populated keys.
        const payload: Record<string, any> = {};

        if (form.roomTitle?.trim()) payload.roomTitle = form.roomTitle.trim();
        if (form.description?.trim()) payload.description = form.description.trim();
        if (form.location?.trim()) payload.location = form.location.trim();
        if (form.price) payload.price = Number(form.price);
        if (form.status) payload.status = form.status;
        if (form.preferredTenants && form.preferredTenants.length) payload.preferredTenants = form.preferredTenants;

        const rulesArr = form.rules?.split(',').map((i) => i.trim()).filter(Boolean) ?? [];
        if (rulesArr.length) payload.rules = rulesArr;

        const facilitiesArr = form.facilities?.split(',').map((i) => i.trim()).filter(Boolean) ?? [];
        if (facilitiesArr.length) payload.facilities = facilitiesArr;

        if (form.roomType) payload.roomType = form.roomType;
        if (form.floorNumber) payload.floorNumber = Number(form.floorNumber);
        if (form.totalRooms) payload.totalRooms = Number(form.totalRooms);

        if (propertyId || form.propertyId) payload.propertyId = propertyId || form.propertyId;

        if (form.address?.trim()) payload.address = form.address.trim();

        // Coordinates from map selection
        if (selectedPosition?.lat !== undefined && selectedPosition?.lng !== undefined) {
            payload.latitude = selectedPosition.lat;
            payload.longitude = selectedPosition.lng;
        }

        const formData = new FormData();
        formData.append('roomData', JSON.stringify(payload));

        selectedImages.forEach((file) => {
            formData.append('roomImages', file);
        });

        // Send payload to API via RoomService through react-query mutation
        mutate(formData, {
            onSuccess: () => {
                router.push(`/landlord/properties/${propertyId || form.propertyId}`);
            },
            onError: (err: unknown) => {
                const message = err instanceof Error ? err.message : 'Unable to create the room right now.';
                setError(message);
            },
        });
    };

    if (isKycLoading) {
        return <div className="flex min-h-[60vh] items-center justify-center gap-2 text-sm text-slate-500"><span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />Checking KYC status...</div>;
    }

    if (!canCreateRoom) {
        const message = kycStatus === 'PENDING'
            ? 'Your KYC is currently under review. You can post a room after your KYC has been verified.'
            : kycStatus === 'REJECTED'
                ? 'Your KYC has not been verified. Please update and resubmit your KYC before posting a room.'
                : 'KYC verification is required before you can post a room. Please complete and verify your KYC first.';
        return <div className="mx-auto max-w-xl px-4 py-12 text-center">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/60 dark:bg-amber-950/30">
                <ShieldCheck className="mx-auto h-9 w-9 text-amber-600" />
                <h1 className="mt-3 text-xl font-bold">KYC verification required</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{message}</p><Link href="/landlord/kyc" className="mt-5 inline-flex rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white">{kycStatus ? 'View KYC status' : 'Complete KYC'}</Link></div></div>
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 text-slate-900 dark:text-slate-100">
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href={`/dashboard/landlord/properties/${propertyId}`} className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
                            <ArrowLeft className="h-4 w-4" />
                            Back to property
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Create a new room</h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Guide the landlord through a smooth room posting flow with all the details your backend expects.</p>
                    </div>
                    <div className="hidden rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:block">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                            <Sparkles className="h-4 w-4 text-indigo-500" />
                            Step {step + 1} of {steps.length}
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <aside className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="mb-5 flex items-center gap-3">
                            <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                                <House className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Room setup</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Property {propertyId}</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {steps.map((item, index) => {
                                const active = index === step;
                                const done = index < step;

                                return (
                                    <div key={item.title} className={`rounded-2xl border px-3 py-3 ${active ? 'border-indigo-200 bg-indigo-50 dark:border-indigo-900 dark:bg-indigo-950/50' : 'border-slate-200/70 dark:border-slate-800'}`}>
                                        <div className="flex items-center gap-2">
                                            {done ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <div className={`h-2.5 w-2.5 rounded-full ${active ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`} />}
                                            <p className="text-sm font-semibold">{item.title}</p>
                                        </div>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{item.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </aside>

                    <div className="rounded-3xl border border-slate-200/70 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {step === 0 && (
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Room title</label>
                                        <input name="roomTitle" value={form.roomTitle} onChange={handleChange} placeholder="Cozy room near campus" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" required />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Description</label>
                                        <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Describe the room, amenities and what makes it special" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Room images</label>
                                        <input type="file" multiple accept="image/*" onChange={handleImageSelection} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Optional. Add one or more photos to showcase the room.</p>
                                        {selectedImages.length > 0 && (
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {selectedImages.map((file) => (
                                                    <span key={file.name} className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/60 dark:text-indigo-300">
                                                        {file.name}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Location</label>
                                        <input value={form.location || 'Select a point on the map'} readOnly placeholder="Select a point on the map" className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-950" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Price</label>
                                        <div className="relative">
                                            <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} placeholder="25000" className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Room status</label>
                                        <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950">
                                            {statusOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Room type</label>
                                        <select name="roomType" value={form.roomType} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950">
                                            {roomTypeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
                                        </select>
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Selected address</label>
                                        <div className="relative">
                                            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                            <input value={form.address || 'Search, click, or drag the map marker'} readOnly className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-950" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Floor number</label>
                                        <input name="floorNumber" type="number" min="0" value={form.floorNumber} onChange={handleChange} placeholder="2" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Total rooms</label>
                                        <input name="totalRooms" type="number" min="1" value={form.totalRooms} onChange={handleChange} placeholder="4" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="mb-2 block text-sm font-semibold">Select location on map</label>
                                        <div className="h-80 overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900">
                                            <Map lat={selectedPosition.lat} lng={selectedPosition.lng} searchable onLocationChange={({ lat, lng, address }) => {
                                                setSelectedPosition({ lat, lng });
                                                setForm((current) => ({ ...current, location: address, address, latitude: String(lat), longitude: String(lng) }));
                                            }} />
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Search for an address, click the map, or drag the pin. The address and coordinates update automatically.</p>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="grid gap-5">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Preferred tenants</label>
                                        <div className="flex flex-wrap gap-2">
                                            {tenantOptions.map((option) => {
                                                const selected = form.preferredTenants.includes(option);
                                                return (
                                                    <button key={option} type="button" onClick={() => toggleTenant(option)} className={`rounded-full border px-3 py-2 text-sm font-medium transition ${selected ? 'border-indigo-500 bg-indigo-500 text-white' : 'border-slate-200 bg-white text-slate-600 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300'}`}>
                                                        {option}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Rules</label>
                                        <textarea name="rules" value={form.rules} onChange={handleChange} rows={3} placeholder="No smoking, quiet hours, pets not allowed" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Separate each rule with a comma.</p>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">Facilities</label>
                                        <textarea name="facilities" value={form.facilities} onChange={handleChange} rows={3} placeholder="Wi-Fi, AC, Parking, Washing machine" className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-indigo-400 dark:border-slate-800 dark:bg-slate-950" />
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Separate each facility with a comma.</p>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/60">
                                    <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                        <div className="rounded-2xl bg-indigo-100 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                                            <Building2 className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold">{form.roomTitle || 'Untitled room'}</p>
                                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{form.description || 'No description provided yet.'}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Location</p>
                                            <p className="mt-2 text-sm font-semibold">{form.location}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Price</p>
                                            <p className="mt-2 text-sm font-semibold">{form.price ? `$${Number(form.price).toLocaleString()}` : 'Not provided'}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Status</p>
                                            <p className="mt-2 text-sm font-semibold">{form.status}</p>
                                        </div>
                                        <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Preferred tenants</p>
                                            <p className="mt-2 text-sm font-semibold">{form.preferredTenants.length ? form.preferredTenants.join(', ') : 'None selected'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">{error}</div>}

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-4 dark:border-slate-800">
                                <button type="button" onClick={handleBack} disabled={step === 0} className="rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-950">
                                    Back
                                </button>

                                {step < steps.length - 1 ? (
                                    <button type="button" onClick={handleNext} className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
                                        Continue
                                    </button>
                                ) : (
                                    <button type="submit" disabled={isPending} className="rounded-2xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70">
                                        {isPending ? 'Creating room...' : 'Create room'}
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
