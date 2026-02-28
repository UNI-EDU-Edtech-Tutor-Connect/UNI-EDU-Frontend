"use client"

import ChatInterface from "@/components/dashboard/chat-interface"

export default function MessagesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Tin nhắn & Phản hồi</h1>
                <p className="text-muted-foreground mt-1">Trao đổi trực tiếp với Gia sư và ban quản lý EduConnect.</p>
            </div>

            <ChatInterface />
        </div>
    )
}
