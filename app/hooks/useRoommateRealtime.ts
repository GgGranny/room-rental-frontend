"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { subscribeToRoomTopic, type RoommateRealtimeEvent } from "../lib/realtime";

const ROOMMATE_KEY = "roommate";
const REQUESTS_KEY = "roommateRequests";
const ROOM_KEY = "ROOM";

// New API: keeps the roommate map in sync in real time. WebSocket events only
// invalidate/refetch caches — they never imply that MY action succeeded.
export function useRoommateEvents(roomId?: string, onEvent?: (event: RoommateRealtimeEvent) => void) {
    const queryClient = useQueryClient();
    const handlerRef = useRef(onEvent);
    handlerRef.current = onEvent;

    useEffect(() => {
        if (!roomId) return;
        const unsubscribe = subscribeToRoomTopic(roomId, (event) => {
            // Refetch authoritative data for every relevant cache slice.
            queryClient.invalidateQueries({ queryKey: [ROOMMATE_KEY] });
            if (event.type === "ROOM_STATUS_CHANGED") {
                queryClient.invalidateQueries({ queryKey: [ROOM_KEY, roomId] });
            }
            handlerRef.current?.(event);
        });
        return unsubscribe;
    }, [roomId, queryClient]);
}
