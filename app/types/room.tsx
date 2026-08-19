export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "RESERVED";

export interface PropertyOption {
    id: string;
    name: string;
    address: string;
}

export interface UploadedImage {
    id: string;
    url: string;
    isCover: boolean;
    progress: number;
}

export interface RoomRequest {
    roomTitle: string;
    description: string;
    location: string;
    price: number;
    status: RoomStatus;
    preferredTenants: string[];
    rules: string[];
    facilities: string[];
    roomType: string;
    floorNumber: number;
    totalRooms: number;
    propertyId: string;
    address: string;
    latitude: number;
    longitude: number;
    images?: UploadedImage[];
}