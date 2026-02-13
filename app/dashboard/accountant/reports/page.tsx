"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchAccountantStatsRequest } from "@/store/slices/stats-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  GraduationCap,
  Calendar,
  PieChart,
  BarChart3,
  Printer,
  Mail,
} from "lucide-react"

export default function ReportsPage() {
  const dispatch = useDispatch()
  const { accountantStats, isLoading } = useSelector((state: RootState) => state.stats)
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    dispatch(fetchAccountantStatsRequest())
  }, [dispatch])

  // Use stats or defaults
  const stats = accountantStats || {
    totalRevenue: 0,
    monthlyGrowth: 0,
    categoryBreakdown: [],
    expenseBreakdown: [],
    monthlyData: [],
    topTutors: [],
    escrowBalance: 0,
    pendingPayouts: 0,
    monthlyTransactions: 0,
    pendingTransactions: 0,
    completedToday: 0
  }

  // Calculate some derived stats
  const totalExpense = stats.expenseBreakdown?.reduce((sum, item) => sum + item.amount, 0) || 0
  const netProfit = stats.totalRevenue - totalExpense

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Báo cáo tài chính</h1>
          <p className="text-muted-foreground">Phân tích và báo cáo tài chính chi tiết</p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Chọn kỳ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm nay</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Mail className="mr-2 h-4 w-4" />
            Gửi báo cáo
          </Button>
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            In báo cáo
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Xuất PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(stats.totalRevenue)}đ</div>
            <p className="text-xs text-muted-foreground">+{stats.monthlyGrowth}% so với tháng trước</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng chi phí</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(totalExpense)}đ</div>
            <p className="text-xs text-muted-foreground">Lương gia sư & vận hành</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lợi nhuận ròng</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(netProfit)}đ</div>
            <p className="text-xs text-muted-foreground">Sau khi trừ chi phí</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Biểu đồ tăng trưởng</CardTitle>
            <CardDescription>Doanh thu và lợi nhuận qua các tháng</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">Đang tải dữ liệu...</div>
            ) : (
              <div className="h-[300px] flex items-end justify-between gap-2 pt-4 pb-2">
                {stats.monthlyData?.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                    <div className="w-full max-w-[60px] flex flex-col items-center gap-1 h-full justify-end relative">
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-xs p-1 rounded z-10 whitespace-nowrap">
                        Thu: {new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(item.income)}
                      </div>
                      <div
                        className="w-full bg-primary/20 hover:bg-primary/30 rounded-t transition-all relative group h-full"
                      >
                        <div
                          className="w-full bg-primary/20 absolute bottom-0"
                          style={{ height: `${(item.income / 200000000) * 100}%` }}
                        >
                          <div
                            className="absolute bottom-0 w-full bg-primary hover:bg-primary/90 rounded-t transition-all"
                            style={{ height: `${(item.profit / item.income) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.month.split(' ')[1] || item.month}</span>
                  </div>
                ))}
                {!stats.monthlyData?.length && <div className="w-full text-center text-muted-foreground self-center">Chưa có dữ liệu</div>}
              </div>
            )}
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary/20 rounded" />
                <span className="text-sm text-muted-foreground">Doanh thu</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                <span className="text-sm text-muted-foreground">Lợi nhuận</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu nguồn thu</CardTitle>
            <CardDescription>Tỷ trọng các nguồn thu nhập</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.categoryBreakdown?.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'][index % 4]}`} />
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{new Intl.NumberFormat("vi-VN").format(item.amount)}đ</span>
                    <span className="text-muted-foreground text-sm">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              {!stats.categoryBreakdown?.length && <div className="text-center text-muted-foreground">Chưa có dữ liệu</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cơ cấu chi phí</CardTitle>
            <CardDescription>Phân bổ chi phí vận hành</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.expenseBreakdown?.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${['bg-red-500', 'bg-yellow-500', 'bg-gray-500', 'bg-pink-500'][index % 4]}`} />
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{new Intl.NumberFormat("vi-VN").format(item.amount)}đ</span>
                    <span className="text-muted-foreground text-sm">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              {!stats.expenseBreakdown?.length && <div className="text-center text-muted-foreground">Chưa có dữ liệu</div>}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Gia sư doanh thu cao</CardTitle>
          <CardDescription>Gia sư đóng góp doanh thu nhiều nhất tháng này</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.topTutors?.map((tutor, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{tutor.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {tutor.classes} lớp | {tutor.students} học sinh
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{new Intl.NumberFormat("vi-VN").format(tutor.earnings)}đ</p>
                  <p className="text-xs text-muted-foreground">Doanh thu</p>
                </div>
              </div>
            ))}
            {!stats.topTutors?.length && <div className="text-center text-muted-foreground">Chưa có dữ liệu</div>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
