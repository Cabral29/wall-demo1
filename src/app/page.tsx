"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageInput } from "@/components/ui/message-input";
import { MessageList } from "@/components/ui/message-list";
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessageSent = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="min-h-screen bg-zinc-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        {/* Profile Section */}
        <div className="md:col-span-1">
          <div className="space-y-6">
            <div className="flex flex-col items-start space-y-4">
              {/* Profile Image Container */}
              <div className="w-full aspect-square relative rounded-lg overflow-hidden">
                <Image 
                  src="/profile.jpg"
                  alt="Greg Wientjes"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h2 className="text-2xl font-bold">Greg Wientjes</h2>
            </div>
            
            <Card>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-zinc-500">Networks</h4>
                    <p>Stanford Alum</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-zinc-500">Current City</h4>
                    <p>Palo Alto, CA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Wall Section */}
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <MessageInput onMessageSent={handleMessageSent} />
            </CardContent>
          </Card>

          {/* Messages */}
          <MessageList refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </main>
  );
}
