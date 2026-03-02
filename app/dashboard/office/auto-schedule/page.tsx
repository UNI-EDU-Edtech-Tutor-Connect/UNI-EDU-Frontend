"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, addDays } from "date-fns"
import { vi } from "date-fns/locale"
import {
    CalendarDays,
    Settings,
    Wand2,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Loader2,
    Save,
    Users,
    BookOpen,
    MonitorPlay,
    ArrowRight,
    Sparkles
} from "lucide-react"

export default function AutoSchedulePage() {
    const [isGenerating, setIsGenerating] = useState(false)
    const [progress, setProgress] = useState(0)
    const [step, setStep] = useState(0) // 0: Config, 1: Result
    const [generationLog, setGenerationLog] = useState<string[]>([])

    // Fake schedules
    const [schedules, setSchedules] = useState<any[]>([])

    const handleGenerate = () => {
        setIsGenerating(true)
        setProgress(0)
        setGenerationLog(["Khởi tạo bộ dữ liệu lớp học, giáo viên và phòng lab..."])

        // Simulate generation process
        let currentProgress = 0
        const interval = setInterval(() => {
            currentProgress += Math.floor(Math.random() * 15) + 5
            if (currentProgress >= 100) {
                currentProgress = 100
                clearInterval(interval)
                setTimeout(() => {
                    setIsGenerating(false)
                    setStep(1)
                    generateFakeData()
                }, 800)
            }
            setProgress(currentProgress)

            if (currentProgress > 30 && currentProgress < 60 && generationLog.length === 1) {
                setGenerationLog(prev => [...prev, "Đang phân tích tính khả dụng của giảng viên..."])
            } else if (currentProgress >= 60 && currentProgress < 90 && generationLog.length === 2) {
                setGenerationLog(prev => [...prev, "Chạy thuật toán xếp lịch để tối ưu hóa phòng máy..."])
            } else if (currentProgress >= 90 && generationLog.length === 3) {
                setGenerationLog(prev => [...prev, "Hoàn thành tạo lịch. Kiểm tra không có xung đột!"])
            }
        }, 600)
    }

    const generateFakeData = () => {
        setSchedules([
            { id: 1, date: addDays(new Date(), 1), course: "Lập trình ReactJS (CB)", teacher: "Nguyễn Văn A", room: "Lab 301", time: "08:00 - 11:30" },
            { id: 2, date: addDays(new Date(), 1), course: "Thiết kế UI/UX", teacher: "Trần Thị B", room: "Lab 302", time: "13:30 - 17:00" },
            { id: 3, date: addDays(new Date(), 2), course: "Khoa học Dữ liệu", teacher: "Lê Văn Tiến", room: "Lab 405", time: "08:00 - 11:30" },
            { id: 4, date: addDays(new Date(), 3), course: "Bảo mật Web", teacher: "Hoàng Tuấn", room: "Lab 201", time: "18:00 - 21:00" },
        ])
    }

    const handleApprove = () => {
        // Approve logic
        alert("Lịch học đã được duyệt và đồng bộ hệ thống!")
        setStep(0)
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Wand2 className="h-8 w-8 text-primary" />
                    Tự động xếp lịch thông minh
                </h1>
                <p className="text-muted-foreground">
                    Sử dụng thuật toán AI để sắp xếp lịch học tối ưu dựa trên phòng máy, giảng viên và yêu cầu của học viên.
                </p>
            </div>

            {step === 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 relative overflow-hidden">
                        {isGenerating && (
                            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-8 text-center">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
                                    <div className="relative bg-background rounded-full p-4 border-2 border-primary shadow-xl shadow-primary/20">
                                        <Sparkles className="h-10 w-10 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Đang thuật toán xếp lịch...</h3>
                                <p className="text-muted-foreground mb-6 max-w-md">Hệ thống đang kiểm tra chéo {'>'}10.000 biến để đảm bảo lịch trình tối ưu và không bị xung đột thời gian.</p>
                                <div className="w-full max-w-md space-y-2">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>Tiến trình</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <Progress value={progress} className="h-2" />
                                </div>
                                <div className="mt-8 text-left w-full max-w-md bg-secondary/30 p-4 rounded-lg border text-sm space-y-2 h-32 overflow-hidden">
                                    {generationLog.map((log, i) => (
                                        <div key={i} className="flex items-center gap-2 text-muted-foreground animate-in fade-in slide-in-from-bottom-2">
                                            <CheckCircle2 className="h-4 w-4 text-primary" />
                                            <span>{log}</span>
                                        </div>
                                    ))}
                                    {progress < 100 && (
                                        <div className="flex items-center gap-2 text-primary">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span className="animate-pulse">Đang xử lý...</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Cấu hình tham số xếp lịch
                            </CardTitle>
                            <CardDescription>Thiết lập các ràng buộc và ưu tiên cho thuật toán</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Thời gian dự kiến</Label>
                                    <Select defaultValue="next-week">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn khoảng thời gian" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="next-week">Tuần tiếp theo</SelectItem>
                                            <SelectItem value="next-month">Tháng tiếp theo</SelectItem>
                                            <SelectItem value="semester">Học kỳ mới</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label>Chi nhánh áp dụng</Label>
                                    <Select defaultValue="all">
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn chi nhánh" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Tất cả chi nhánh</SelectItem>
                                            <SelectItem value="cn1">Quận 1 - Trụ sở chính</SelectItem>
                                            <SelectItem value="cn2">Quận 7 - Khu Nam</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <Label>Mục tiêu tối ưu hóa hàng đầu</Label>
                                <Select defaultValue="balance">
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="balance">Cân bằng đều tải giảng viên & phòng máy</SelectItem>
                                        <SelectItem value="rooms">Ưu tiên lấp đầy phòng máy trống</SelectItem>
                                        <SelectItem value="compact">Dồn lịch học để trống ngày cuối tuần</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-4 pt-4 border-t">
                                <h4 className="font-medium text-sm">Ràng buộc cứng</h4>
                                <div className="grid gap-3">
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="no-weekend" defaultChecked />
                                        <Label htmlFor="no-weekend" className="font-normal cursor-pointer">Không xếp lịch vào dịp cuối tuần (Thứ 7, CN)</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="max-hours" defaultChecked />
                                        <Label htmlFor="max-hours" className="font-normal cursor-pointer">Giảng viên không dạy quá 3 ca một ngày</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="room-match" defaultChecked />
                                        <Label htmlFor="room-match" className="font-normal cursor-pointer">Phải khớp yêu cầu thiết bị (VD: khóa học AI cần Lab GPU)</Label>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/20 pt-6">
                            <Button size="lg" className="w-full gap-2 text-base h-12" onClick={handleGenerate}>
                                <Wand2 className="h-5 w-5" />
                                Bắt đầu xếp lịch thông minh
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Dữ liệu đầu vào</CardTitle>
                            <CardDescription>Trạng thái dữ liệu hiện tại</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                                            <BookOpen className="h-4 w-4" />
                                        </div>
                                        <span>Lớp đang chờ xếp</span>
                                    </div>
                                    <span className="font-bold">42</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-md">
                                            <Users className="h-4 w-4" />
                                        </div>
                                        <span>Giảng viên tham gia</span>
                                    </div>
                                    <span className="font-bold">15</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md">
                                            <MonitorPlay className="h-4 w-4" />
                                        </div>
                                        <span>Phòng Lab trống</span>
                                    </div>
                                    <span className="font-bold text-amber-500">8</span>
                                </div>

                                <div className="pt-4 border-t mt-4">
                                    <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        <AlertCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                                        <p>Thuật toán sẽ tối đa hoá hiệu suất sử dụng phòng Lab. Dự kiến tỷ lệ trống khoảng 12%.</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-green-900 dark:text-green-300">Tạo lịch thành công!</h3>
                                <p className="text-sm text-green-700 dark:text-green-500/80">Tất cả {schedules.length} lớp học đã tìm được thời gian phù hợp mà không bị xung đột.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(0)} className="gap-2 bg-background">
                                <RefreshCw className="h-4 w-4" /> Làm lại
                            </Button>
                            <Button onClick={handleApprove} className="gap-2 bg-green-600 hover:bg-green-700 text-white border-none">
                                <Save className="h-4 w-4" /> Duyệt và Lưu
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <Card className="md:col-span-1">
                            <CardHeader>
                                <CardTitle className="text-lg">Thống kê lịch</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Tỷ lệ dụng phòng Lab</span>
                                        <span className="font-medium text-green-600">88% (Tốt)</span>
                                    </div>
                                    <Progress value={88} className="h-2 [&>div]:bg-green-500" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Phân bổ ca dạy</span>
                                        <span className="font-medium text-blue-600">Cân bằng</span>
                                    </div>
                                    <Progress value={92} className="h-2 [&>div]:bg-blue-500" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="md:col-span-3">
                            <CardHeader className="pb-3 border-b border-border/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle>Bản nháp lịch trình mới</CardTitle>
                                    <Select defaultValue="week">
                                        <SelectTrigger className="w-[130px] h-8 text-sm">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="week">Dạng Danh sách</SelectItem>
                                            <SelectItem value="calendar" disabled>Dạng Lịch</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <ScrollArea className="h-[400px]">
                                    <div className="divide-y">
                                        {schedules.map((schedule, i) => (
                                            <div key={i} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                                                <div className="h-16 w-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center shrink-0 border border-primary/20">
                                                    <span className="text-xs font-medium text-primary uppercase">{format(schedule.date, "E", { locale: vi })}</span>
                                                    <span className="text-xl font-bold text-primary">{format(schedule.date, "dd")}</span>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <h4 className="font-semibold">{schedule.course}</h4>
                                                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {schedule.teacher}</span>
                                                        <span className="flex items-center gap-1"><MonitorPlay className="h-3 w-3" /> {schedule.room}</span>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="px-3 py-1 text-sm bg-background border font-mono">
                                                    {schedule.time}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    )
}
