"use client";

import { useState } from "react";
import { Button } from "./button";
import { database } from "@/lib/database";

interface MessageInputProps {
  onMessageSent: () => void;
}

export function MessageInput({ onMessageSent }: MessageInputProps) {
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const success = await database.addPost(body.trim());

    setIsSubmitting(false);
    if (success) {
      setBody("");
      onMessageSent();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] p-4 rounded-lg border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
          maxLength={280}
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-zinc-500">
            {body.length}/280 characters
          </span>
          <Button type="submit" disabled={!body.trim() || isSubmitting}>
            {isSubmitting ? "Posting..." : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
} 