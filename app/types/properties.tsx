export interface PropertyStats {
    roomType: string;
    floorLevel: string;
    totalUnits: string;
    dimensions: string;
}

export interface Facility {
    icon: string;
    label: string;
}

export interface Protocol {
    icon: string;
    label: string;
}

export interface Agent {
    name: string;
    role: string;
    avatar: string;
    managedBy: string;
}

export interface PropertyData {
    id: string;
    badge: string;
    listingCode: string;
    title: string;
    location: string;
    heroImage: string;
    galleryImages: string[];
    stats: PropertyStats;
    facilities: Facility[];
    protocols: Protocol[];
    agent: Agent;
    coordinates: {
        lat: string;
        long: string;
    };
    demographics: string[];
    pricing: {
        monthlyRate: number;
        baseRent: number;
        securityDeposit: number;
        maintenanceFee: number;
    };
}