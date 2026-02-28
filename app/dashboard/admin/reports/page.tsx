"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, DollarSign, BookOpen, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts"

const revenueData = [
    { month: "T9", revenue: 45, profit: 12 },
    { month: "T10", revenue: 52, profit: 15 },
    { month: "T11", revenue: 78, profit: 24 },
    { month: "T12", revenue: 115, profit: 32 },
    { month: "T1", revenue: 140, profit: 45 },
    { month: "T2", revenue: 185, profit: 60 },
    { month: "T3", revenue: 210, profit: 75 },
]

const userGrowthData = [
    { date: "Thứ 2", students: 120, tutors: 10 },
    { date: "Thứ 3", students: 132, tutors: 15 },
    { date: "Thứ 4", students: 101, tutors: 8 },
    { date: "Thứ 5", students: 165, tutors: 25 },
    { date: "Thứ 6", students: 189, tutors: 12 },
    { date: "Thứ 7", students: 250, tutors: 45 },
    { date: "CN", students: 310, tutors: 55 },
]

export default function AdminReportsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Báo cáo & Phân tích</h1>
                <p className="text-muted-foreground mt-1">Bảng thiết bị dữ liệu tổng quan, doanh thu và người dùng trên nền tảng.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">324.5M ₫</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className="text-green-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> 20.1%</span>
                            so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lớp học đang mở</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600">845</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className="text-green-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> 12.5%</span>
                            so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Người dùng mới</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2,350</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className="text-red-500 flex items-center mr-1"><ArrowDownRight className="h-3 w-3 mr-0.5" /> 4.1%</span>
                            so với tháng trước
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Lợi nhuận (Escrow)</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-accent">85.2M ₫</div>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center">
                            <span className="text-green-500 flex items-center mr-1"><ArrowUpRight className="h-3 w-3 mr-0.5" /> 32.5%</span>
                            so với tháng trước
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Biểu đồ Doanh thu (Triệu VNĐ)</CardTitle>
                        <CardDescription>
                            So sánh Tổng doanh thu (GMV) và Lợi nhuận ròng từ phí nền tảng trong 7 tháng.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Bar dataKey="revenue" name="Tổng GMV" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="profit" name="Lợi nhuận" fill="#ec4899" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Người dùng đăng ký tuần này</CardTitle>
                        <CardDescription>
                            Tốc độ tăng trưởng Học sinh và Gia sư mới mỗi ngày
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={userGrowthData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="students" name="Học sinh" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="tutors" name="Gia sư" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
