import Navbar from "@/components/AdminNav";
import { PropertyHero } from "@/components/PropertyHero";
import { PropertyGallery } from "@/components/PropertyGallary";
import { PropertyStats } from "@/components/PropertyStatus";
import { FacilitiesCard } from "@/components/PropertiesFacilities";
import { HouseProtocols } from "@/components/HouseProtocols";
import { AgentCard } from "@/components/AgentCard";
import { MapCard } from "@/components/MapCard";
import { Demographics } from "@/components/Demographic";
import { BookingCard } from "@/components/BookingCard";
import Footer from "@/components/Footer";
import { MOCK_PROPERTY_DATA } from "@/app/lib/PropertyConstants";

export default function PropertyPage() {
    const data = MOCK_PROPERTY_DATA;

    return (
        <div className="min-h-screen bg-[#0B0B0F] text-white font-sans antialiased">

            <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

                    {/* Left Column (65%) */}
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

                    {/* Right Column / Sticky Sidebar (35%) */}
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