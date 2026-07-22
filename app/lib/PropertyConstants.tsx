import { PropertyData } from "../types/properties";

export const MOCK_PROPERTY_DATA: PropertyData = {
    id: "HP-0421",
    badge: "AVAILABLE",
    listingCode: "Verified Listing #HP-0421",
    title: "Obsidian Terrace Loft",
    location: "South District, Highline Province, Metropolis City",
    heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    galleryImages: [
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80"
    ],
    stats: {
        roomType: "Executive",
        floorLevel: "14 th",
        totalUnits: "08",
        dimensions: "42 m²"
    },
    facilities: [
        { icon: "Wifi", label: "Gigabit Fiber" },
        { icon: "Utensils", label: "Full Kitchen" },
        { icon: "Building", label: "Private Balcony" },
        { icon: "Wind", label: "Central HVAC" }
    ],
    protocols: [
        { icon: "Ban", label: "Non-smoking environment" },
        { icon: "Moon", label: "Quiet hours: 22:00 - 07:00" },
        { icon: "Dog", label: "Pet friendly (Subject to approval)" }
    ],
    agent: {
        name: "Marcus Thorne",
        role: "Senior Architect & Property Curator",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        managedBy: "MANAGED BY"
    },
    coordinates: {
        lat: "-34.6037",
        long: "-58.3816"
    },
    demographics: [
        "Design Professionals",
        "Graduate Students",
        "Corporate Relocations",
        "Solo Inhabitants"
    ],
    pricing: {
        monthlyRate: 2450.00,
        baseRent: 2450.00,
        securityDeposit: 1200.00,
        maintenanceFee: 150.00
    }
};