import { apiClient } from "../lib/GlobalApi";

export const PropertyService = {
    createProperty: (body: any) => apiClient.post("property", body),
    getAllProperties: () => apiClient.get("property"),
    getPropertyById: (id: string) => apiClient.get(`property/${id}`),
}