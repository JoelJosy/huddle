"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchMessages, sendMessage } from "@/lib/chatActions";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

interface GroupChatAreaProps {
  groupId: string;
  currentUserId: string;
  isMember: boolean;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profile: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

export default function GroupChatArea({
  groupId,
  currentUserId,
  isMember,
}: GroupChatAreaProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [pendingMessages, setPendingMessages] = useState<Set<string>>(
    new Set(),
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();
  const [currentUserProfile, setCurrentUserProfile] = useState<any>(null);

  // Fetch initial messages
  useEffect(() => {
    const loadMessages = async () => {
      if (!isMember) {
        setIsLoadingMessages(false);
        return;
      }

      try {
        const data = await fetchMessages(groupId);
        setMessages(
          data.map((message: any) => ({
            ...message,
            profile: Array.isArray(message.profile)
              ? message.profile[0]
              : message.profile,
          })),
        );
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    };

    loadMessages();
  }, [groupId, isMember]);

  // Fetch current user profile for optimistic updates
  useEffect(() => {
    const fetchCurrentUserProfile = async () => {
      try {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, username, avatar_url")
          .eq("id", currentUserId)
          .single();

        setCurrentUserProfile(data);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    if (currentUserId) {
      fetchCurrentUserProfile();
    }
  }, [currentUserId, supabase]);

  // Subscribe to new messages
  useEffect(() => {
    if (!isMember) return;

    const channel = supabase
      .channel(`group_messages:${groupId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "group_messages",
          filter: `group_id=eq.${groupId}`,
        },
        async (payload) => {
          // Fetch the complete message with profile info
          try {
            const { data } = await supabase
              .from("group_messages")
              .select(
                `
              id, content, created_at, user_id,
              profile:profiles(full_name, username, avatar_url)
            `,
              )
              .eq("id", payload.new.id)
              .single();

            if (data) {
              const newMessage = {
                ...data,
                profile: Array.isArray(data.profile)
                  ? data.profile[0]
                  : data.profile,
              };

              setMessages((prev) => {
                // Check if message already exists (avoid duplicates)
                const exists = prev.some((msg) => msg.id === newMessage.id);
                if (exists) return prev;

                // Remove any optimistic messages from the same user with similar content and timestamp
                const filtered = prev.filter((msg) => {
                  if (!msg.id.startsWith("temp-")) return true;

                  // Remove optimistic message if it matches content and user and is close in time
                  const timeDiff = Math.abs(
                    new Date(newMessage.created_at).getTime() -
                      new Date(msg.created_at).getTime(),
                  );

                  return !(
                    msg.user_id === newMessage.user_id &&
                    msg.content === newMessage.content &&
                    timeDiff < 5000 // Within 5 seconds
                  );
                });

                // Also remove from pending messages set
                setPendingMessages((prev) => {
                  const newSet = new Set(prev);
                  // Find and remove the corresponding temp message
                  filtered.forEach((msg) => {
                    if (
                      msg.id.startsWith("temp-") &&
                      msg.user_id === newMessage.user_id &&
                      msg.content === newMessage.content
                    ) {
                      newSet.delete(msg.id);
                    }
                  });
                  return newSet;
                });

                return [...filtered, newMessage];
              });
            }
          } catch (error) {
            console.error("Error fetching new message details:", error);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [groupId, supabase, isMember]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !isMember) return;

    const messageContent = newMessage.trim();
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Create optimistic message
    const optimisticMessage: Message = {
      id: tempId,
      content: messageContent,
      created_at: new Date().toISOString(),
      user_id: currentUserId,
      profile: currentUserProfile || {
        full_name: "You",
        username: "you",
        avatar_url: null,
      },
    };

    // Add message immediately (optimistic update)
    setMessages((prev) => [...prev, optimisticMessage]);
    setPendingMessages((prev) => new Set(prev).add(tempId));
    setNewMessage(""); // Clear input immediately for next message

    try {
      await sendMessage(groupId, messageContent);

      // Remove from pending set after successful send
      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });

      // The optimistic message will be automatically removed when the real message arrives
      // through the subscription
    } catch (error) {
      console.error("Error sending message:", error);

      // Remove from pending set
      setPendingMessages((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tempId);
        return newSet;
      });

      // Remove failed optimistic message
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));

      // Show error and restore message content
      toast.error("Failed to send message");
      setNewMessage(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };

  if (!isMember) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <h3 className="mb-2 text-xl font-semibold">Join this group to chat</h3>
        <p className="text-muted-foreground text-center">
          You need to be a member of this group to participate in the
          conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card flex h-full max-h-[100dvh] flex-col overflow-hidden">
      <ScrollArea className="flex-1 overflow-y-auto px-4 py-2">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.user_id === currentUserId ? "justify-end" : ""} ${
                  message.id.startsWith("temp-") ? "opacity-75" : ""
                }`}
              >
                {/* Others Avatar */}
                {message.user_id !== currentUserId && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={message.profile?.avatar_url}
                      alt={
                        message.profile?.full_name ||
                        message.profile?.username ||
                        "User"
                      }
                    />
                    <AvatarFallback>
                      {message.profile?.full_name?.[0] ||
                        message.profile?.username?.[0] ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] ${message.user_id === currentUserId ? "order-1" : "order-2"}`}
                >
                  {/* Username */}
                  {message.user_id !== currentUserId && (
                    <p className="mb-1 text-xs font-medium">
                      {message.profile?.full_name ||
                        message.profile?.username ||
                        "Unknown User"}
                    </p>
                  )}
                  {/* Message bubble with pending indicator */}
                  <div
                    className={`relative rounded-lg p-3 ${
                      message.user_id === currentUserId
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {/* Message Content */}
                    <p className="break-words whitespace-pre-wrap">
                      {message.content}
                    </p>
                    {/* Pending indicator for optimistic messages */}
                    {message.id.startsWith("temp-") &&
                      pendingMessages.has(message.id) && (
                        <div className="absolute -right-1 -bottom-1 h-3 w-3 animate-pulse rounded-full bg-yellow-500" />
                      )}
                  </div>
                  {/* Timestamp */}
                  <p className="text-muted-foreground mt-1 text-right text-xs">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {/* User avatar */}
                {message.user_id === currentUserId && (
                  <Avatar className="order-2 h-8 w-8">
                    <AvatarImage
                      src={message.profile?.avatar_url}
                      alt={
                        message.profile?.full_name ||
                        message.profile?.username ||
                        "User"
                      }
                    />
                    <AvatarFallback>
                      {message.profile?.full_name?.[0] ||
                        message.profile?.username?.[0] ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] resize-none"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <SendHorizontal className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
        {pendingMessages.size > 0 && (
          <div className="text-muted-foreground mt-2 text-xs">
            {pendingMessages.size} message{pendingMessages.size > 1 ? "s" : ""}{" "}
            sending...
          </div>
        )}
      </form>
    </div>
  );
}
