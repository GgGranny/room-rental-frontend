import { apiClient } from "../lib/GlobalApi";

export const PropertyService = {
    createProperty: (body: any) => apiClient.post("property", body),
    getAllProperties: () => apiClient.get<any>("property"),
    getPropertyById: (id: string) => apiClient.get<any>(`property/${id}`),
    updateProperty: (id: string, body: FormData) => apiClient.put(`property/${id}`, body),
    updatePropertyStatus: (id: string, status: string) => apiClient.patch(`property/${id}/status/${status}`, {}),
    deleteProperty: (id: string) => apiClient.delete(`property/${id}`),
}
