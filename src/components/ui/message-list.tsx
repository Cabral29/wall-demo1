"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { storage } from "@/lib/storage";
import { type Messages } from "@/lib/types";

interface MessageListProps {
  refreshTrigger?: number;
}

export function MessageList({ refreshTrigger }: MessageListProps) {
  const [messages, setMessages] = useState<Messages>([]);

  useEffect(() => {
    setMessages(storage.getMessages());
  }, [refreshTrigger]); // Refresh when trigger changes

  if (messages.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No messages yet. Be the first to post!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Card key={message.id}>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">{message.author}</h3>
            <p className="text-zinc-600">{message.content}</p>
            <p className="text-xs text-gray-400 mt-2">
              {new Date(message.timestamp).toLocaleString()}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 