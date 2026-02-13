"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wallet, TrendingUp, Calendar, DollarSign, Download, ArrowUpRight, Clock, CheckCircle } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const mockEarnings = {
  thisMonth: 25000000,
  lastMonth: 22000000,
  pending: 8500000,
  totalSessions: 48,
  avgPerSession: 520000,
}

const mockTransactions = [
  {
    id: "1",
    className: "Toán Cao Cấp - Lớp 12",
    student: "Nguyễn Văn Minh",
    sessions: 8,
    amount: 4160000,
    date: "2025-12-15",
    status: "completed",
  },
  {
    id: "2",
    className: "Vật lý 11",
    student: "Trần Thị Lan",
    sessions: 6,
    amount: 3120000,
    date: "2025-12-10",
    status: "completed",
  },
  {
    id: "3",
    className: "Hóa học 12",
    student: "Lê Hoàng Nam",
    sessions: 4,
    amount: 2080000,
    date: "2025-12-05",
    status: "pending",
  },
]

export default function TeacherEarningsPage() {
  const [selectedMonth, setSelectedMonth] = useState("12-2025")

  const growthRate = ((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) * 100

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thu nhập</h1>
          <p className="text-muted-foreground">Theo dõi thu nhập và lịch sử thanh toán</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(mockEarnings.thisMonth)}</p>
                <p className="text-sm text-muted-foreground">Thu nhập tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">+{growthRate.toFixed(1)}%</p>
                <p className="text-sm text-muted-foreground">So với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(mockEarnings.pending)}</p>
                <p className="text-sm text-muted-foreground">Chờ thanh toán</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockEarnings.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Buổi đã dạy</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lịch sử thu nhập</CardTitle>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12-2025">Tháng 12/2025</SelectItem>
                  <SelectItem value="11-2025">Tháng 11/2025</SelectItem>
                  <SelectItem value="10-2025">Tháng 10/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        tx.status === "completed" ? "bg-green-100" : "bg-orange-100"
                      }`}
                    >
                      {tx.status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{tx.className}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.student} - {tx.sessions} buổi
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{formatCurrency(tx.amount)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={tx.status === "completed" ? "default" : "secondary"}>
                        {tx.status === "completed" ? "Đã nhận" : "Chờ xử lý"}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tx.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê</CardTitle>
            <CardDescription>Tổng quan thu nhập tháng này</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thu nhập/buổi TB</span>
                <span className="font-medium">{formatCurrency(mockEarnings.avgPerSession)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tổng buổi dạy</span>
                <span className="font-medium">{mockEarnings.totalSessions} buổi</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Hoa hồng nền tảng</span>
                <span className="font-medium text-red-600">-{formatCurrency(mockEarnings.thisMonth * 0.1)}</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">Thực nhận</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(mockEarnings.thisMonth * 0.9)}</p>
            </div>

            <Button className="w-full">
              <DollarSign className="h-4 w-4 mr-2" />
              Yêu cầu rút tiền
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
