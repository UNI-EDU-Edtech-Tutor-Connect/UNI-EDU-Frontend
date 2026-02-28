"use client"

import { useState } from "react"
import { useAppSelector } from "@/hooks/use-redux"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Send, FileImage, Paperclip, MoreVertical, Phone, Video } from "lucide-react"

// Mock Chat Data
const mockConversations = [
    { id: "c1", name: "Nguyễn Thị Lan (Học sinh)", lastMessage: "Dạ thầy, bài tập về nhà em gửi trong nhóm ạ.", time: "10:24", unread: 2, avatar: "/female-student.jpg", role: "student" },
    { id: "c2", name: "Phụ huynh bé Lan", lastMessage: "Cảm ơn thầy, dạo này cháu học có tiến bộ.", time: "Hôm qua", unread: 0, avatar: "", role: "parent" },
    { id: "c3", name: "Trung tâm EduConnect", lastMessage: "Thông báo chi trả lương tháng 2.", time: "T2", unread: 1, avatar: "", role: "admin" },
    { id: "c4", name: "Lê Văn B (Học sinh)", lastMessage: "Em nộp bài trễ 1 ngày được không ạ?", time: "T7", unread: 0, avatar: "/male-student.jpg", role: "student" },
]

const mockChatHistory = [
    { id: 1, senderId: "c1", text: "Chào thầy, hôm nay em có một số bài tập Toán khó chưa giải được.", time: "09:15", isMe: false },
    { id: 2, senderId: "me", text: "Chào Lan, em gửi ảnh bài tập qua đây để thầy xem nhé.", time: "09:20", isMe: true },
    { id: 3, senderId: "c1", text: "Dạ vâng, thầy đợi em xíu.", time: "09:22", isMe: false },
    { id: 4, senderId: "c1", text: "Dạ thầy, bài tập về nhà em gửi trong nhóm ạ.", time: "10:24", isMe: false },
]

export default function ChatInterface() {
    const { user } = useAppSelector((state) => state.auth)
    const [activeChat, setActiveChat] = useState(mockConversations[0])
    const [messagePrompt, setMessagePrompt] = useState("")
    const [messages, setMessages] = useState(mockChatHistory)

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!messagePrompt.trim()) return

        setMessages([...messages, {
            id: messages.length + 1,
            senderId: "me",
            text: messagePrompt,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        }])
        setMessagePrompt("")
    }

    return (
        <div className="h-[calc(100vh-10rem)] bg-card border rounded-xl flex overflow-hidden shadow-sm">
            {/* Sidebar: Conversations List */}
            <div className="w-80 border-r flex flex-col bg-muted/10">
                <div className="p-4 border-b bg-card">
                    <h2 className="font-semibold text-lg mb-4">Tin nhắn</h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Tìm kiếm liên hệ..." className="pl-8 bg-background" />
                    </div>
                </div>

                <ScrollArea className="flex-1">
                    <div className="flex flex-col">
                        {mockConversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setActiveChat(conv)}
                                className={`flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted ${activeChat.id === conv.id ? 'bg-muted border-l-4 border-l-primary' : 'border-l-4 border-transparent'}`}
                            >
                                <div className="relative">
                                    <Avatar className="h-10 w-10 border border-muted">
                                        <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                                        <AvatarFallback className="bg-primary/10 text-primary">{conv.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    {conv.unread > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                            {conv.unread}
                                        </span>
                                    )}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <div className="flex justify-between items-center mb-1">
                                        <h4 className="font-medium text-sm truncate pr-2">{conv.name}</h4>
                                        <span className="text-xs text-muted-foreground shrink-0">{conv.time}</span>
                                    </div>
                                    <p className={`text-xs truncate ${conv.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                                        {conv.lastMessage}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-card">
                {/* Chat Header */}
                <div className="h-16 border-b flex items-center justify-between px-6 bg-card shrink-0">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-muted">
                            <AvatarImage src={activeChat.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-primary/10 text-primary">{activeChat.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h3 className="font-semibold text-sm">{activeChat.name}</h3>
                            <p className="text-xs text-green-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang hoạt động
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                            <Video className="h-4 w-4" />
                        </Button>
                        <div className="w-px h-6 bg-border mx-1"></div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Chat Bubbles */}
                <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6 flex flex-col justify-end">
                        <div className="text-center my-4">
                            <span className="text-xs bg-muted/60 text-muted-foreground px-3 py-1 rounded-full">Hôm nay</span>
                        </div>
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex max-w-[75%] ${msg.isMe ? 'ml-auto' : 'mr-auto'}`}>
                                {!msg.isMe && (
                                    <Avatar className="h-8 w-8 mr-2 shrink-0 mt-auto">
                                        <AvatarFallback className="bg-primary/10 text-primary text-xs">{activeChat.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                )}
                                <div>
                                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${msg.isMe ? 'bg-primary text-primary-foreground rounded-br-sm' : 'bg-muted rounded-bl-sm'}`}>
                                        {msg.text}
                                    </div>
                                    <p className={`text-[10px] text-muted-foreground mt-1 ${msg.isMe ? 'text-right mr-1' : 'ml-1'}`}>
                                        {msg.time}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                {/* Input Area */}
                <div className="p-4 border-t bg-card">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2 bg-muted/30 p-2 rounded-full border">
                        <Button type="button" variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button type="button" variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-primary">
                            <FileImage className="h-5 w-5" />
                        </Button>
                        <Input
                            value={messagePrompt}
                            onChange={(e) => setMessagePrompt(e.target.value)}
                            placeholder="Nhập tin nhắn..."
                            className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                        />
                        <Button type="submit" size="icon" className="rounded-full shrink-0 bg-primary/90 hover:bg-primary shadow-sm" disabled={!messagePrompt.trim()}>
                            <Send className="h-4 w-4 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    )
}
