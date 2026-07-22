"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { PropertyService } from "../services/PropertyService";


const PROPERTY_KEY = "property";

export function useCreateProperty() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (body: any) => PropertyService.createProperty(body),
        onSuccess: (data) => {
            console.log("data: ", data);
            queryClient.invalidateQueries({ queryKey: [PROPERTY_KEY] })
        },
        onError: (error) => {
            console.error("could not create property, " + error.message);
        }
    });
}

export function useGetAllProperty() {
    return useQuery({
        queryKey: [PROPERTY_KEY],
        queryFn: () => PropertyService.getAllProperties()
    })
}


export function useGetPropertyById(id: string) {
    return useQuery({
        queryKey: [PROPERTY_KEY, id],
        queryFn: () => PropertyService.getPropertyById(id),
        enabled: !!id
    })
}