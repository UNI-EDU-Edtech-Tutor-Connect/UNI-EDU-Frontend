"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, MessageSquare, Users, Settings, Send, LayoutDashboard, Copy, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Mock message data
const initialMessages = [
    { id: 1, sender: "Tutor", name: "Trần Minh Tuấn", time: "14:00", text: "Chào em, em đã thấy màn hình của thầy chưa?", isSelf: false, role: "tutor" },
    { id: 2, sender: "Student", name: "Nguyễn Thị Lan", time: "14:01", text: "Dạ em thấy rồi ạ.", isSelf: true, role: "student" },
]

export default function VirtualRoomPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()

    const [isMicOn, setIsMicOn] = useState(true)
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [chatMessage, setChatMessage] = useState("")
    const [messages, setMessages] = useState(initialMessages)
    const [activeTab, setActiveTab] = useState("chat") // chat, participants
    const [roomTime, setRoomTime] = useState(0)

    useEffect(() => {
        // Hide standard sidebar/layout elements if possible or just adapt
        const timer = setInterval(() => {
            setRoomTime(prev => prev + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0')
        const s = (seconds % 60).toString().padStart(2, '0')
        const h = Math.floor(seconds / 3600)
        if (h > 0) return `${h.toString().padStart(2, '0')}:${m}:${s}`
        return `${m}:${s}`
    }

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (!chatMessage.trim()) return
        const newMessage = {
            id: messages.length + 1,
            sender: "Me",
            name: "Tutor (You)", // Change according to user role realistically
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
            text: chatMessage,
            isSelf: true,
            role: "tutor",
        }
        setMessages([...messages, newMessage])
        setChatMessage("")
    }

    const handleEndCall = () => {
        toast({
            title: "Lớp học kết thúc",
            description: "Đang lưu lịch sử và quay lại trang quản lý...",
        })
        setTimeout(() => {
            router.back()
        }, 1500)
    }

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col pt-16 md:pt-0">
            {/* Top Navigation Bar */}
            <header className="h-14 border-b bg-card flex items-center justify-between px-4 shrink-0 shadow-sm z-10 w-full relative">
                <div className="flex items-center gap-4">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Đang trực tuyến</Badge>
                    <div className="hidden sm:flex flex-col">
                        <h1 className="font-semibold text-sm">Phòng học: Toán Đại số 11 - Nâng cao</h1>
                        <p className="text-xs text-muted-foreground">ID: {params.id || "123-456-789"}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-2 mr-4 bg-muted px-3 py-1.5 rounded-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-sm font-medium font-mono">{formatTime(roomTime)}</span>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => {
                        navigator.clipboard.writeText(`https://uni-edu.vercel.app/room/${params.id}`);
                        toast({ title: "Đã sao chép link", description: "Bây giờ bạn có thể gửi cho học sinh." });
                    }}>
                        <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <LayoutDashboard className="h-4 w-4" />
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-muted/20">

                {/* Video / Whiteboard Area */}
                <div className="flex-1 flex flex-col p-2 md:p-4 gap-4 overflow-hidden relative">

                    {/* Main Stage (Screen Share / Whiteboard) */}
                    <div className="flex-1 rounded-xl bg-slate-900 border overflow-hidden relative shadow-inner group">
                        {isScreenSharing ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                <MonitorUp className="h-16 w-16 mb-4 opacity-50" />
                                <p>Bạn đang chia sẻ màn hình chính</p>
                                <Button variant="outline" className="mt-4 bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white" onClick={() => setIsScreenSharing(false)}>
                                    Dừng chia sẻ
                                </Button>
                            </div>
                        ) : (
                            // Mock Whiteboard / Content
                            <div className="absolute inset-0 bg-[#1e1e1e] flex flex-col">
                                <div className="h-10 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-4 gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-slate-400 text-xs ml-4">Bảng trắng (Whiteboard)</span>
                                </div>
                                <div className="flex-1 p-8 text-white font-mono opacity-80 relative">
                                    <div className="absolute top-8 left-8 text-xl text-blue-400 font-sans">1. Giải phương trình bậc 2:</div>
                                    <div className="absolute top-20 left-16 text-2xl">ax² + bx + c = 0</div>
                                    <div className="absolute top-32 left-8 text-xl text-blue-400 font-sans">2. Tính Delta:</div>
                                    <div className="absolute top-44 left-16 text-2xl">Δ = b² - 4ac</div>

                                    {/* Fake cursor of student */}
                                    <div className="absolute top-48 left-64 flex flex-col items-center animate-pulse">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5.5 3.21V20.8C5.5 21.45 6.27 21.8 6.75 21.36L11.44 17.02H18.5C19.33 17.02 20 16.35 20 15.52V3.21C20 2.38 19.33 1.71 18.5 1.71H7C6.17 1.71 5.5 2.38 5.5 3.21Z" fill="#ff0055" />
                                        </svg>
                                        <span className="bg-[#ff0055] text-white text-[10px] px-1 rounded shadow-sm">Nguyễn Lan</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="absolute top-4 right-4 bg-black/60 px-3 py-1.5 rounded-md text-white/90 text-xs backdrop-blur-md flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            Đang ghi hình (Gửi cho QA)
                        </div>
                    </div>

                    {/* Videos Row (PIP style or bottom row) */}
                    <div className="h-32 md:h-40 shrink-0 flex gap-4 overflow-x-auto pb-2 snap-x">
                        {/* Self Video */}
                        <div className="w-48 md:w-64 h-full bg-slate-800 rounded-lg border overflow-hidden relative shadow-sm shrink-0 snap-start">
                            {isVideoOn ? (
                                <img src="/male-tutor-professional.jpg" className="w-full h-full object-cover" alt="Me" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800">
                                    <Avatar className="h-16 w-16 mb-2">
                                        <AvatarFallback className="bg-slate-700 text-slate-300 text-xl">T</AvatarFallback>
                                    </Avatar>
                                </div>
                            )}
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">Bạn (Gia sư)</span>
                                {!isMicOn && <div className="bg-red-500/80 p-1 rounded-full"><MicOff className="w-3 h-3 text-white" /></div>}
                            </div>
                        </div>

                        {/* Student Video */}
                        <div className="w-48 md:w-64 h-full bg-slate-800 rounded-lg border overflow-hidden relative shadow-sm shrink-0 snap-start ring-2 ring-primary/50">
                            <img src="/student_demo.jpg" className="w-full h-full object-cover" alt="Student" />
                            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm shadow-sm">Nguyễn Thị Lan</span>
                                <div className="bg-green-500/80 w-5 h-5 rounded-full flex items-center justify-center animate-pulse"><Mic className="w-3 h-3 text-white" /></div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Sidebar (Chat & Participants) */}
                <div className="w-full md:w-80 lg:w-96 bg-card border-l flex flex-col shrink-0 h-64 md:h-full z-10 transition-all">
                    <div className="flex items-center border-b p-1">
                        <Button variant={activeTab === 'chat' ? 'secondary' : 'ghost'} className="flex-1 text-sm h-10 rounded-none" onClick={() => setActiveTab("chat")}>
                            <MessageSquare className="w-4 h-4 mr-2" /> Trò chuyện
                        </Button>
                        <Button variant={activeTab === 'participants' ? 'secondary' : 'ghost'} className="flex-1 text-sm h-10 rounded-none" onClick={() => setActiveTab("participants")}>
                            <Users className="w-4 h-4 mr-2" /> Thành viên (2)
                        </Button>
                    </div>

                    {activeTab === 'chat' && (
                        <>
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <Badge variant="secondary" className="text-[10px] font-normal text-muted-foreground bg-muted/50">14:00 - Cuộc gọi bắt đầu</Badge>
                                    </div>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}>
                                            <span className="text-[10px] text-muted-foreground ml-1 mb-1">{msg.name} • {msg.time}</span>
                                            <div className={`px-3 py-2 rounded-2xl max-w-[85%] text-sm ${msg.isSelf ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                                                {msg.text}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            <div className="p-3 border-t bg-card mt-auto">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <Input
                                        placeholder="Nhập tin nhắn..."
                                        className="flex-1 focus-visible:ring-1"
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                    />
                                    <Button type="submit" size="icon" disabled={!chatMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    )}

                    {activeTab === 'participants' && (
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Trong phòng (2)</h4>

                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-primary/10 text-primary">T</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Bạn (Gia sư)</p>
                                            <p className="text-xs text-muted-foreground mt-1">Host</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        {isMicOn ? <Mic className="h-4 w-4 text-green-500" /> : <MicOff className="h-4 w-4 text-red-500" />}
                                        {isVideoOn ? <Video className="h-4 w-4 text-primary" /> : <VideoOff className="h-4 w-4 text-red-500" />}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-2 hover:bg-muted/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback className="bg-accent/10 text-accent">L</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium leading-none">Nguyễn Thị Lan</p>
                                            <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Đang học</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Mic className="h-4 w-4 text-green-500" />
                                        <Video className="h-4 w-4 text-primary" />
                                    </div>
                                </div>

                            </div>
                        </ScrollArea>
                    )}

                </div>
            </div>

            {/* Bottom Controls Bar */}
            <footer className="h-20 border-t bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 flex items-center justify-center gap-3 px-4 shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-20 sticky bottom-0 w-full">
                <Button
                    variant={isMicOn ? "outline" : "destructive"}
                    size="lg"
                    className={`rounded-full w-12 h-12 p-0 shadow-sm ${isMicOn ? 'bg-background hover:bg-muted' : ''}`}
                    onClick={() => setIsMicOn(!isMicOn)}
                >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                    variant={isVideoOn ? "outline" : "destructive"}
                    size="lg"
                    className={`rounded-full w-12 h-12 p-0 shadow-sm ${isVideoOn ? 'bg-background hover:bg-muted' : ''}`}
                    onClick={() => setIsVideoOn(!isVideoOn)}
                >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>

                <div className="w-px h-8 bg-border mx-2"></div>

                <Button
                    variant={isScreenSharing ? "secondary" : "outline"}
                    size="lg"
                    className={`rounded-full h-12 px-6 shadow-sm border ${isScreenSharing ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200' : 'bg-background hover:bg-muted'}`}
                    onClick={() => {
                        if (!isScreenSharing) {
                            toast({ title: "Bắt đầu chia sẻ", description: "Đang chọn màn hình thiết bị..." })
                            setTimeout(() => setIsScreenSharing(true), 1000)
                        } else {
                            setIsScreenSharing(false)
                        }
                    }}
                >
                    <MonitorUp className="h-5 w-5 mr-2" />
                    {isScreenSharing ? "Dừng chia sẻ" : "Chia sẻ màn hình"}
                </Button>

                <Button variant="outline" size="lg" className="rounded-full w-12 h-12 p-0 shadow-sm bg-background hover:bg-muted ml-2">
                    <Settings className="h-5 w-5" />
                </Button>

                <Button
                    variant="destructive"
                    size="lg"
                    className="rounded-full h-12 px-6 shadow-sm ml-4 font-medium"
                    onClick={handleEndCall}
                >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    Kết thúc lớp
                </Button>
            </footer>
        </div>
    )
}
