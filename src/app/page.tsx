"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { MessageInput } from "@/components/ui/message-input"
import { MessageList } from "@/components/ui/message-list"
import Image from "next/image"
import { useState } from "react"

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMessagePosted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold">Information</h3>
            </CardHeader>
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
            <MessageInput onMessagePosted={handleMessagePosted} />
          </CardContent>
        </Card>

        {/* Messages */}
        <MessageList refreshTrigger={refreshTrigger} />
      </div>
    </main>
  )
}
