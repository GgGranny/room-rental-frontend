"use client";

import { useEffect, useRef } from "react";
import { AlertCircle, Loader2, MessageCircle, Send, User as UserIcon, X } from "lucide-react";
import { toast } from "sonner";

import {
    useChatEvents,
    useConversationMessages,
    useMarkConversationRead,
    useSendMessage,
} from "@/app/hooks/useChat";
import type { ChatMessage, MatchStatus } from "@/app/services/chatService";

// Private 1:1 roommate chat. Access is enforced by the backend (participant-only,
// 403 otherwise); this modal never trusts client-side ids. Sends go through the
// authenticated REST API (server resolves the sender from the JWT) and the socket
// only carries id-only signals that trigger a refetch — no message content, no
// credentials ever traverse the broker.
export default function RoommateChatModal({
    conversationId,
    peerName,
    peerAvatarUrl,
    roomTitle,
    matchStatus = "ACTIVE",
    open,
    onClose,
}: {
    conversationId: string;
    peerName?: string;
    peerAvatarUrl?: string | null;
    roomTitle?: string;
    matchStatus?: MatchStatus;
    open: boolean;
    onClose: () => void;
}) {
    // Only fetch/subscribe while the modal is actually open for a real conversation.
    const activeId = open && conversationId ? conversationId : null;
    const { data: messages = [], isLoading, isError, error } = useConversationMessages(activeId);
    const sendMessage = useSendMessage(conversationId);
    const markRead = useMarkConversationRead();

    const canSend = matchStatus === "ACTIVE";
    const forbidden = isError && /403|not have access|forbidden/i.test(errorMessage(error));

    const draftRef = useRef<HTMLTextAreaElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Incoming signal → the hook already refetched; clear my unread counter too.
    useChatEvents(activeId, (event) => {
        if (event.type === "CHAT_MESSAGE" && conversationId) markRead.mutate(conversationId);
    });

    // Entering a conversation clears its unread badge.
    useEffect(() => {
        if (open && conversationId) markRead.mutate(conversationId);
        // markRead identity is stable enough; re-run only when the conversation opens.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, conversationId]);

    // Keep the newest message in view.
    useEffect(() => {
        const box = scrollRef.current;
        if (box) box.scrollTop = box.scrollHeight;
    }, [messages, open]);

    if (!open) return null;

    const submit = async () => {
        const el = draftRef.current;
        const content = (el?.value ?? "").trim();
        if (!content) return;
        if (!canSend) {
            toast.error("This roommate chat is no longer active.");
            return;
        }
        try {
            await sendMessage.mutateAsync(content);
            if (el) el.value = "";
        } catch (err) {
            toast.error(errorMessage(err));
        }
    };

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Enter sends; Shift+Enter inserts a newline.
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            void submit();
        }
    };

    return (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative flex h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                            {peerAvatarUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={peerAvatarUrl} alt={peerName ?? "Roommate"} className="h-full w-full object-cover" />
                            ) : (
                                <UserIcon className="h-5 w-5" />
                            )}
                        </span>
                        <div className="min-w-0">
                            <h3 className="truncate text-base font-extrabold text-slate-900 dark:text-white">
                                {peerName ?? "Roommate"}
                            </h3>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                                {matchStatus === "ENDED" ? "Match ended" : "Matched roommate"}
                                {roomTitle ? ` · ${roomTitle}` : ""}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
                        aria-label="Close chat"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Message list */}
                <div ref={scrollRef} className="flex-1 space-y-2.5 overflow-y-auto bg-slate-50/60 px-5 py-4 dark:bg-slate-950/40">
                    {isLoading ? (
                        <div className="flex h-full items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        </div>
                    ) : forbidden ? (
                        <ChatNotice icon={<AlertCircle className="h-7 w-7" />} title="You don't have access to this conversation." />
                    ) : isError ? (
                        <ChatNotice icon={<AlertCircle className="h-7 w-7" />} title="Couldn't load messages." subtitle="Please try again in a moment." />
                    ) : messages.length === 0 ? (
                        <ChatNotice icon={<MessageCircle className="h-7 w-7" />} title="No messages yet." subtitle={`Say hello to ${peerName ?? "your roommate"}.`} />
                    ) : (
                        messages.map((message) => <MessageBubble key={message.id} message={message} />)
                    )}
                </div>

                {/* Composer */}
                <div className="border-t border-slate-100 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
                    {canSend ? (
                        <div className="flex items-end gap-2">
                            <textarea
                                ref={draftRef}
                                rows={1}
                                onKeyDown={onKeyDown}
                                maxLength={2000}
                                placeholder={`Message ${peerName ?? "your roommate"}…`}
                                className="max-h-32 min-h-[44px] flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                            />
                            <button
                                onClick={() => void submit()}
                                disabled={sendMessage.isPending}
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
                                aria-label="Send message"
                            >
                                {sendMessage.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                            </button>
                        </div>
                    ) : (
                        <p className="rounded-2xl border border-dashed border-slate-300 px-4 py-3 text-center text-xs font-semibold text-slate-500 dark:border-slate-700 dark:text-slate-400">
                            This roommate chat is no longer active. You can still read past messages.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

function MessageBubble({ message }: { message: ChatMessage }) {
    const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (message.mine) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[75%] rounded-2xl rounded-br-md bg-indigo-600 px-3.5 py-2 text-sm text-white shadow-sm">
                    <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    <p className="mt-1 text-right text-[10px] text-indigo-100/80">
                        {time} · {message.readAt ? "Read" : "Sent"}
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex justify-start">
            <div className="max-w-[75%] rounded-2xl rounded-bl-md border border-slate-200 bg-white px-3.5 py-2 text-sm text-slate-800 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                <p className="whitespace-pre-wrap break-words">{message.content}</p>
                <p className="mt-1 text-right text-[10px] text-slate-400">{time}</p>
            </div>
        </div>
    );
}

function ChatNotice({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">{icon}</div>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{title}</p>
            {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
    );
}

function errorMessage(error: unknown): string {
    const raw = error instanceof Error ? error.message.replace(/^Error fetching .*: /, "") : "";
    return raw || "Something went wrong.";
}
