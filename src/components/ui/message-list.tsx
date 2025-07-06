"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "./card";
import { database, type Post } from "@/lib/database";
import { supabase } from "@/lib/supabase";

interface MessageListProps {
  refreshTrigger?: number;
}

function getRelativeTime(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 1) return 'now';
  if (diffInHours < 1) return `${diffInMinutes}m`;
  return `${diffInHours}h`;
}

export function MessageList({ refreshTrigger }: MessageListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [, setForceUpdate] = useState(0);

  // Fetch posts when component mounts or trigger changes
  useEffect(() => {
    const fetchPosts = async () => {
      const posts = await database.getPosts();
      setPosts(posts);
    };
    fetchPosts();
  }, [refreshTrigger]);

  // Subscribe to real-time updates
  useEffect(() => {
    const channel = supabase
      .channel('posts')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'posts',
      }, () => {
        database.getPosts().then(setPosts);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Update relative times every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold mb-2">Greg Wientjes</h3>
              <span className="text-xs text-gray-400">
                {getRelativeTime(post.created_at)}
              </span>
            </div>
            <p className="text-zinc-600">{post.body}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 