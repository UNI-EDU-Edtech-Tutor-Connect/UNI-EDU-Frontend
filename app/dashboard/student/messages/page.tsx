"use client"

import ChatInterface from "@/components/dashboard/chat-interface"

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tin nhắn</h1>
                <p className="text-muted-foreground mt-1">Trao đổi với gia sư, giáo viên của bạn tại đây.</p>
            </div>

            <ChatInterface />
        </div>
    )
}
