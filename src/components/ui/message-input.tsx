"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";
import { storage } from "@/lib/storage";
import { Message } from "@/lib/types";

interface MessageInputProps {
  onMessagePosted?: () => void;
}

export function MessageInput({ onMessagePosted }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const MAX_CHARS = 280;

  useEffect(() => {
    const savedAuthor = storage.getAuthor();
    if (savedAuthor) {
      setAuthor(savedAuthor);
    }
  }, []);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setMessage(text);
      setError("");
    } else {
      setError(`Message must be ${MAX_CHARS} characters or less`);
    }
  };

  const handleShare = () => {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }
    
    const newMessage: Message = {
      id: Date.now().toString(),
      author: author.trim(),
      content: message.trim(),
      timestamp: Date.now()
    };

    storage.saveMessage(newMessage);
    setMessage("");
    setError("");
    onMessagePosted?.();
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <div className="flex gap-4">
        <input
          type="text"
          value={author}
          disabled
          className="flex-shrink-0 w-48 p-2 border rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
        />
      </div>
      <div className="relative">
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="What's on your mind?"
          className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="absolute bottom-3 right-3 text-sm text-gray-500">
          {message.length}/{MAX_CHARS}
        </div>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end">
        <Button 
          onClick={handleShare}
          disabled={!message.trim() || message.length > MAX_CHARS}
        >
          Share
        </Button>
      </div>
    </div>
  );
} 