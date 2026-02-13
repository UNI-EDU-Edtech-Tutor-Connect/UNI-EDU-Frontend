"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { fetchTutorStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wallet, TrendingUp, CreditCard, Clock, Banknote } from "lucide-react"
import type { Transaction } from "@/types"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

export default function TutorEarningsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { transactions } = useAppSelector((state) => state.transactions)
  const { tutorStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)

  useEffect(() => {
    dispatch(fetchTransactionsRequest())
    if (user?.id) {
      dispatch(fetchTutorStatsRequest(user.id))
    }
  }, [dispatch, user?.id])

  // Default stats while loading
  const stats = tutorStats || {
    activeClasses: 0,
    totalStudents: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  }

  const escrowAmount = stats.monthlyEarnings * 0.2
  const availableBalance = stats.monthlyEarnings * 0.8

  const myTransactions = transactions.filter((t) => t.type === "tutor_payout" || t.type === "class_registration_fee")

  const columns = [
    {
      key: "createdAt",
      header: "Ngày",
      render: (item: Transaction) => (
        <span className="text-sm">{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>
      ),
    },
    {
      key: "description",
      header: "Mô tả",
      render: (item: Transaction) => (
        <div>
          <p className="font-medium">{item.description}</p>
          <p className="text-xs text-muted-foreground">Mã GD: {item.id}</p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Loại",
      render: (item: Transaction) => (
        <Badge variant="outline">{item.type === "tutor_payout" ? "Chi trả lương" : "Phí đăng ký"}</Badge>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      render: (item: Transaction) => (
        <span
          className={`font-semibold ${item.type === "class_registration_fee" ? "text-destructive" : "text-success"}`}
        >
          {item.type === "class_registration_fee" ? "-" : "+"}
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: Transaction) => <StatusBadge status={item.status} />,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Thu nhập</h1>
          <p className="text-muted-foreground">Theo dõi thu nhập và lịch sử thanh toán</p>
        </div>
        <Button className="gap-2 bg-success hover:bg-success/90">
          <Banknote className="h-4 w-4" />
          Rút tiền
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Thu nhập tháng này"
          value={statsLoading ? "..." : formatCurrency(stats.monthlyEarnings)}
          icon={<Wallet className="h-6 w-6" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Số dư khả dụng"
          value={statsLoading ? "..." : formatCurrency(availableBalance)}
          description="80% đã giải ngân"
          icon={<CreditCard className="h-6 w-6" />}
        />
        <StatsCard
          title="Escrow"
          value={statsLoading ? "..." : formatCurrency(escrowAmount)}
          description="20% giữ lại"
          icon={<Clock className="h-6 w-6" />}
        />
        <StatsCard
          title="Tổng thu nhập"
          value={statsLoading ? "..." : formatCurrency(stats.monthlyEarnings * 6)}
          description="6 tháng qua"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Earnings Breakdown */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Chi tiết thu nhập tháng này</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { class: "Toán - Nguyễn Thị Lan", sessions: 8, amount: 4000000 },
              { class: "Vật lý - Trần Văn Nam", sessions: 6, amount: 3000000 },
              { class: "Toán - Lê Hoàng Anh", sessions: 8, amount: 4000000 },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium">{item.class}</p>
                  <p className="text-sm text-muted-foreground">{item.sessions} buổi hoàn thành</p>
                </div>
                <span className="text-lg font-semibold text-success">{formatCurrency(item.amount)}</span>
              </div>
            ))}

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="font-medium">Tổng cộng</span>
                <span className="text-xl font-bold">{formatCurrency(stats.monthlyEarnings)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tiến độ thanh toán</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Đã nhận (80%)</span>
                <span className="font-medium text-success">{formatCurrency(availableBalance)}</span>
              </div>
              <Progress value={80} className="h-3" />
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Escrow (20%)</span>
                <span className="font-medium text-warning">{formatCurrency(escrowAmount)}</span>
              </div>
              <Progress value={20} className="h-3 bg-warning/20" />
              <p className="text-xs text-muted-foreground mt-2">
                Sẽ được giải ngân vào cuối tháng nếu không có tranh chấp
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-medium mb-2">Ngày chi trả tiếp theo</p>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-4 w-4" />
                <span className="font-semibold">05/01/2025</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <DataTable
        title="Lịch sử giao dịch"
        columns={columns}
        data={myTransactions}
        emptyMessage="Chưa có giao dịch nào"
      />
    </div>
  )
}
