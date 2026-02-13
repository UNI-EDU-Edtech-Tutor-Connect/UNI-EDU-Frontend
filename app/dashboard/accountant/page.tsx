"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { fetchAccountantStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  PieChart,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function AccountantDashboard() {
  const dispatch = useDispatch()
  const { transactions, isLoading: isTransactionsLoading } = useSelector((state: RootState) => state.transactions)
  // Use accountantStats from stats slice
  const { accountantStats, isLoading: isStatsLoading } = useSelector((state: RootState) => state.stats)

  useEffect(() => {
    dispatch(fetchTransactionsRequest())
    dispatch(fetchAccountantStatsRequest())
  }, [dispatch])

  const isLoading = isTransactionsLoading || isStatsLoading

  // Mock initial stats if loading or null (optional, or better show skeleton)
  const defaultStats = {
    totalRevenue: 0,
    pendingPayouts: 0,
    escrowBalance: 0,
    monthlyTransactions: 0,
    pendingTransactions: 0,
    monthlyGrowth: 0,
    completedToday: 0,
  }

  const statsProps = accountantStats || defaultStats

  const recentTransactions = transactions.slice(0, 5)

  const pendingPayoutsList = transactions
    .filter((t) => t.type === "tutor_payout" && t.status === "pending")
    .slice(0, 4)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>
      case "processing":
        return <Badge className="bg-blue-100 text-blue-800">Đang xử lý</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "student_payment":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "tutor_payout":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      case "refund":
        return <ArrowUpRight className="h-4 w-4 text-orange-600" />
      case "class_registration_fee":
        return <DollarSign className="h-4 w-4 text-primary" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Quản lý tài chính</h1>
        <p className="text-muted-foreground mt-1">Tổng quan doanh thu, thanh toán và báo cáo tài chính</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Doanh thu tháng này"
          value={formatCurrency(statsProps.totalRevenue)}
          description={`+${statsProps.monthlyGrowth}% so với tháng trước`}
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          trend={{ value: statsProps.monthlyGrowth, isPositive: true }}
        />
        <StatsCard
          title="Chờ chi trả"
          value={formatCurrency(statsProps.pendingPayouts)}
          description={`${pendingPayoutsList.length} khoản chờ`}
          icon={<Clock className="h-4 w-4 text-orange-500" />}
        />
        <StatsCard
          title="Escrow Balance"
          value={formatCurrency(statsProps.escrowBalance)}
          description="Đang giữ tạm"
          icon={<Wallet className="h-4 w-4 text-primary" />}
        />
        <StatsCard
          title="Giao dịch hôm nay"
          value={statsProps.completedToday.toString()}
          description={`${statsProps.pendingTransactions} đang chờ`}
          icon={<CheckCircle className="h-4 w-4 text-green-600" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Giao dịch gần đây</CardTitle>
              <CardDescription>Các giao dịch mới nhất trong hệ thống</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/accountant/transactions">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-full flex items-center justify-center ${tx.type === "student_payment"
                        ? "bg-green-100"
                        : tx.type === "tutor_payout"
                          ? "bg-red-100"
                          : tx.type === "refund"
                            ? "bg-orange-100"
                            : "bg-primary/10"
                        }`}
                    >
                      {getTransactionIcon(tx.type)}
                    </div>
                    <div>
                      <p className="font-medium">{tx.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {tx.type === 'student_payment' ? `Từ: ${tx.userName}` : tx.type === 'tutor_payout' ? `Đến: ${tx.userName}` : tx.userName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-semibold ${tx.type === "student_payment" || tx.type === "class_registration_fee" ? "text-green-600" : "text-red-600"
                        }`}
                    >
                      {tx.type === "student_payment" || tx.type === "class_registration_fee" ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(tx.status)}
                      <span className="text-xs text-muted-foreground">{new Date(tx.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">Chưa có giao dịch nào</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Chi trả gia sư
            </CardTitle>
            <CardDescription>Các khoản cần thanh toán</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingPayoutsList.map((payout) => (
                <div key={payout.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{payout.userName}</p>
                    {/* Mock lessons/dueDate as they are not in Transaction type yet, or infer */}
                    <Badge variant="outline">Gia sư</Badge>
                  </div>
                  <p className="text-lg font-bold">{formatCurrency(payout.amount)}</p>
                  <p className="text-xs text-muted-foreground">Ngày: {new Date(payout.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
              ))}
              {pendingPayoutsList.length === 0 && (
                <div className="text-center p-4 text-muted-foreground">Không có khoản chi trả chờ duyệt</div>
              )}
            </div>
            <Button className="w-full mt-4" asChild>
              <Link href="/dashboard/accountant/payouts">Xử lý chi trả</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Phân bổ doanh thu
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Use accountantStats.categoryBreakdown if available */}
            <div className="space-y-4">
              {accountantStats?.categoryBreakdown?.map((item, index) => (
                <div className="flex items-center justify-between" key={index}>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${index === 0 ? 'bg-primary' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-orange-500' : 'bg-gray-400'}`} />
                    <span>{item.category}</span>
                  </div>
                  <span className="font-medium">{item.percentage}%</span>
                </div>
              )) || <div className="text-center text-muted-foreground">Đang tải biểu đồ...</div>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Hành động nhanh
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/accountant/transactions">
                <DollarSign className="h-4 w-4 mr-2" />
                Quản lý giao dịch
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/accountant/payouts">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Xử lý chi trả
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/accountant/reports">
                <PieChart className="h-4 w-4 mr-2" />
                Báo cáo tài chính
              </Link>
            </Button>
            {/* Refunds usually in transactions page now or separate */}
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/accountant/transactions">
                <TrendingDown className="h-4 w-4 mr-2" />
                Xử lý hoàn tiền
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
