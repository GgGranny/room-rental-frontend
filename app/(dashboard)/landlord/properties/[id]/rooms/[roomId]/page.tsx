"use client";

import { PropertyHero } from "@/components/PropertyHero";
import { PropertyGallery } from "@/components/PropertyGallary";
import { PropertyStats } from "@/components/PropertyStatus";
import { FacilitiesCard } from "@/components/PropertiesFacilities";
import { HouseProtocols } from "@/components/HouseProtocols";
import { AgentCard } from "@/components/AgentCard";
import { MapCard } from "@/components/MapCard";
import { Demographics } from "@/components/Demographic";
import { BookingCard } from "@/components/BookingCard";
import { MOCK_PROPERTY_DATA } from "@/app/lib/PropertyConstants";
import { useGetRoomById } from "@/app/hooks/useRoom";
import { useMemo } from "react";
import { useParams } from "next/navigation";

export default function PropertyPage() {
    const params = useParams();
    const roomId = params?.roomId as string | undefined;
    const { data: room, isLoading, isError } = useGetRoomById(roomId);

    const data = useMemo(() => {
        if (!room) return MOCK_PROPERTY_DATA;

        return {
            heroImage: room.imageUrls?.[0] || MOCK_PROPERTY_DATA.heroImage,
            badge: room.status || MOCK_PROPERTY_DATA.badge,
            listingCode: room.propertyId || MOCK_PROPERTY_DATA.id,
            title: room.roomTitle || MOCK_PROPERTY_DATA.title,
            location: [room.city, room.district, room.province].filter(Boolean).join(', ') || room.address || MOCK_PROPERTY_DATA.location,
            galleryImages: room.imageUrls && room.imageUrls.length ? room.imageUrls : MOCK_PROPERTY_DATA.galleryImages,
            stats: {
                roomType: room.roomType || MOCK_PROPERTY_DATA.stats.roomType,
                floorLevel: room.floorNumber ? `${room.floorNumber} th` : MOCK_PROPERTY_DATA.stats.floorLevel,
                totalUnits: room.totalRooms ? String(room.totalRooms).padStart(2, '0') : MOCK_PROPERTY_DATA.stats.totalUnits,
                dimensions: room.dimensions || MOCK_PROPERTY_DATA.stats.dimensions,
            },
            facilities: (room.facilities || MOCK_PROPERTY_DATA.facilities).map((f: any) => (typeof f === 'string' ? { icon: 'Check', label: f } : f)),
            protocols: (room.rules || MOCK_PROPERTY_DATA.protocols).map((r: any) => (typeof r === 'string' ? { icon: 'Info', label: r } : r)),
            agent: room.agent || MOCK_PROPERTY_DATA.agent,
            coordinates: room.latitude && (room.longitude || room.Longitude)
                ? { lat: String(room.latitude), long: String(room.longitude ?? room.Longitude) }
                : MOCK_PROPERTY_DATA.coordinates,
            demographics: room.preferredTenants || MOCK_PROPERTY_DATA.demographics,
            pricing: {
                monthlyRate: room.price ?? MOCK_PROPERTY_DATA.pricing.monthlyRate,
                baseRent: room.price ?? MOCK_PROPERTY_DATA.pricing.baseRent,
                securityDeposit: room.securityDeposit ?? MOCK_PROPERTY_DATA.pricing.securityDeposit,
                maintenanceFee: room.maintenanceFee ?? MOCK_PROPERTY_DATA.pricing.maintenanceFee,
            },
            description: room.description || '',
        };
    }, [room]);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-[#0B0B0F] dark:text-white font-sans antialiased">
            <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-8">
                        <PropertyHero
                            heroImage={data.heroImage}
                            badge={data.badge}
                            listingCode={data.listingCode}
                            title={data.title}
                            location={data.location}
                        />

                        <PropertyStats stats={data.stats} />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacilitiesCard facilities={data.facilities} />
                            <HouseProtocols protocols={data.protocols} />
                        </div>

                        <AgentCard agent={data.agent} />

                        <MapCard coordinates={data.coordinates} />

                        <Demographics items={data.demographics} />
                    </div>

                    <div className="space-y-6 lg:col-span-4">
                        <PropertyGallery images={data.galleryImages} />

                        <div className="sticky top-20">
                            <BookingCard pricing={data.pricing} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}