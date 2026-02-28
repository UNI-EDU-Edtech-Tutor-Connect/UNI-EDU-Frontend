"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from "recharts"
import { TrendingUp, BookOpen, AlertCircle, Download, Target, Award, Calendar } from "lucide-react"

// Mock data for Line Chart
const progressData = [
    { month: "T9", math: 6.5, physics: 7.0, english: 5.5, target: 8.0 },
    { month: "T10", math: 7.0, physics: 7.2, english: 6.0, target: 8.0 },
    { month: "T11", math: 7.5, physics: 7.5, english: 6.5, target: 8.0 },
    { month: "T12", math: 8.2, physics: 8.0, english: 7.2, target: 8.0 },
    { month: "T1", math: 8.5, physics: 8.4, english: 7.5, target: 8.0 },
    { month: "T2", math: 8.8, physics: 8.5, english: 8.0, target: 8.0 },
]

export default function StudentReportsPage() {
    const [timeRange, setTimeRange] = useState("6m")
    const [subject, setSubject] = useState("all")

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary tracking-tight">Báo cáo học tập</h1>
                    <p className="text-muted-foreground mt-1">Theo dõi quá trình phát triển và kết quả học tập qua từng tháng</p>
                </div>
                <div className="flex gap-2">
                    <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger className="w-[140px] bg-background">
                            <SelectValue placeholder="Thời gian" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="3m">3 tháng gần đây</SelectItem>
                            <SelectItem value="6m">6 tháng gần đây</SelectItem>
                            <SelectItem value="1y">1 năm qua</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Xuất PDF
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-t-4 border-t-primary shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Điểm TB hiện tại</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">8.4</h3>
                                    <span className="text-xs text-green-600 font-medium">↑ 1.2</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-emerald-500 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                                <Target className="h-6 w-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Mục tiêu đạt được</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">85%</h3>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-blue-500 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Giờ học tích lũy</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">128h</h3>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-t-4 border-t-amber-500 shadow-sm">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                                <Award className="h-6 w-6 text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Đánh giá xuất sắc</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-bold">12</h3>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm">
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Biểu Đồ Phát Triển</CardTitle>
                            <CardDescription>Tiến bộ điểm trung bình theo thời gian</CardDescription>
                        </div>
                        <Select defaultValue={subject} onValueChange={setSubject}>
                            <SelectTrigger className="w-[180px] bg-background">
                                <SelectValue placeholder="Chọn môn học" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả môn</SelectItem>
                                <SelectItem value="math">Toán học</SelectItem>
                                <SelectItem value="physics">Vật lý</SelectItem>
                                <SelectItem value="english">Tiếng Anh</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} domain={[0, 10]} dx={-10} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                                {/* Target Line */}
                                <Line
                                    type="stepAfter"
                                    name="Mục tiêu"
                                    dataKey="target"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                    dot={false}
                                />

                                {/* Curves */}
                                {(subject === "all" || subject === "math") && (
                                    <Line
                                        type="monotone"
                                        name="Toán Học"
                                        dataKey="math"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                )}
                                {(subject === "all" || subject === "physics") && (
                                    <Line
                                        type="monotone"
                                        name="Vật Lý"
                                        dataKey="physics"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                )}
                                {(subject === "all" || subject === "english") && (
                                    <Line
                                        type="monotone"
                                        name="Tiếng Anh"
                                        dataKey="english"
                                        stroke="#f59e0b"
                                        strokeWidth={3}
                                        dot={{ r: 4, strokeWidth: 2 }}
                                        activeDot={{ r: 6 }}
                                    />
                                )}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Nhận Xét Từ Gia Sư</CardTitle>
                        <CardDescription>Cập nhật trong tháng gần nhất</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-blue-900">Môn Toán - Gia Sư: Nguyễn Văn A</span>
                                <span className="text-xs text-blue-700 bg-blue-100 px-2 py-1 rounded">Hôm qua</span>
                            </div>
                            <p className="text-sm text-blue-800">
                                "Học sinh có tiến bộ rõ rệt trong phần Đại số. Mức độ tập trung đã được cải thiện.
                                Tháng tới cần tập trung thêm vào Hình học không gian để chuẩn bị cho kì thi cuối kì."
                            </p>
                        </div>

                        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold text-emerald-900">Môn Lý - Gia Sư: Lê Tuấn</span>
                                <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-1 rounded">3 ngày trước</span>
                            </div>
                            <p className="text-sm text-emerald-800">
                                "Đã hoàn thành xuất sắc bài kiểm tra giữa kì với điểm 8.5. Kĩ năng giải bài tập điện xoay chiều tuyệt vời."
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg">Mục Tiêu Tháng Tới</CardTitle>
                        <CardDescription>Được đề xuất bởi Hệ thống AI EduConnect</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-4 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                            <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                                <Target className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium text-sm">Đạt 8.5 điểm môn Toán cuối kì</h4>
                                <p className="text-xs text-muted-foreground mt-1">Cần hoàn thành thêm 3 bài tập về nhà hình không gian mỗi tuần.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4 p-3 rounded-lg border hover:border-primary/50 transition-colors">
                            <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                                <Calendar className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                                <h4 className="font-medium text-sm">Duy trì chuyên cần 100%</h4>
                                <p className="text-xs text-muted-foreground mt-1">Học sinh chưa nghỉ buổi nào trong tháng trước. Hãy tiếp tục phát huy!</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
