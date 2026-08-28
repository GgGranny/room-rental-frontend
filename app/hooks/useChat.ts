"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import { chatService } from "../services/chatService";
import { subscribeToTopic } from "../lib/realtime";

const CHAT_KEY = "chat";

// Tenant: my roommate matches with conversation handles + unread counts.
export function useMyMatches() {
    return useQuery({
        queryKey: [CHAT_KEY, "matches"],
        queryFn: () => chatService.getMatches(),
        retry: false,
    });
}

// Participant: message history for a conversation (disabled until one is opened).
export function useConversationMessages(conversationId?: string | null) {
    return useQuery({
        queryKey: [CHAT_KEY, "messages", conversationId],
        queryFn: () => chatService.getMessages(conversationId as string),
        enabled: Boolean(conversationId),
        retry: false,
    });
}

export function useSendMessage(conversationId: string) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (content: string) => chatService.sendMessage(conversationId, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "messages", conversationId] });
            queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "matches"] });
        },
    });
}

export function useMarkConversationRead() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (conversationId: string) => chatService.markRead(conversationId),
        onSuccess: (_data, conversationId) => {
            queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "messages", conversationId] });
            queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "matches"] });
        },
    });
}

// Real-time chat signals for one conversation. The broker only carries ids
// (never content); every event just invalidates caches so the authoritative
// REST data is refetched. Mirrors useRoommateEvents.
export type ChatRealtimeEvent = {
    type: string;
    conversationId: string;
    messageId?: string;
    senderId?: string;
    readerId?: string;
};

export function useChatEvents(
    conversationId?: string | null,
    onEvent?: (event: ChatRealtimeEvent) => void,
) {
    const queryClient = useQueryClient();
    const handlerRef = useRef(onEvent);
    handlerRef.current = onEvent;

    useEffect(() => {
        if (!conversationId) return;
        const unsubscribe = subscribeToTopic<ChatRealtimeEvent>(
            `/topic/conversations/${conversationId}`,
            (event) => {
                queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "messages", conversationId] });
                queryClient.invalidateQueries({ queryKey: [CHAT_KEY, "matches"] });
                handlerRef.current?.(event);
            },
        );
        return unsubscribe;
    }, [conversationId, queryClient]);
}
