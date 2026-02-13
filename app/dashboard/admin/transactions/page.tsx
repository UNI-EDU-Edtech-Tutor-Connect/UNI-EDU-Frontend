"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, Wallet, Clock } from "lucide-react"
import type { Transaction } from "@/types"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const transactionTypeLabels: Record<string, string> = {
  class_registration_fee: "Phí đăng ký lớp",
  student_payment: "Học phí",
  student_payment_remaining: "Học phí còn lại",
  tutor_payout: "Chi trả gia sư",
  escrow_hold: "Giữ escrow",
  escrow_release: "Giải ngân escrow",
  cancellation_fee: "Phí hủy",
  test_fee: "Phí thi thử",
  refund: "Hoàn tiền",
}

export default function TransactionsPage() {
  const dispatch = useAppDispatch()
  const { transactions, stats } = useAppSelector((state) => state.transactions)

  useEffect(() => {
    dispatch(fetchTransactionsRequest())
  }, [dispatch])

  const columns = [
    {
      key: "id",
      header: "Mã GD",
      render: (item: Transaction) => <span className="font-mono text-xs">{item.id}</span>,
    },
    {
      key: "type",
      header: "Loại",
      render: (item: Transaction) => <Badge variant="outline">{transactionTypeLabels[item.type] || item.type}</Badge>,
    },
    {
      key: "userName",
      header: "Người dùng",
      render: (item: Transaction) => (
        <div>
          <p className="font-medium">{item.userName}</p>
          <p className="text-xs text-muted-foreground">{item.description}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Số tiền",
      render: (item: Transaction) => (
        <span
          className={`font-semibold ${item.type.includes("payout") || item.type === "refund" ? "text-destructive" : "text-success"}`}
        >
          {item.type.includes("payout") || item.type === "refund" ? "-" : "+"}
          {formatCurrency(item.amount)}
        </span>
      ),
    },
    {
      key: "paymentMethod",
      header: "Phương thức",
      render: (item: Transaction) => <span className="uppercase text-xs">{item.paymentMethod || "-"}</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: Transaction) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Thời gian",
      render: (item: Transaction) => (
        <span className="text-sm">{new Date(item.createdAt).toLocaleString("vi-VN")}</span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý giao dịch</h1>
        <p className="text-muted-foreground">Theo dõi tất cả giao dịch tài chính trong hệ thống</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-4">
          <StatsCard
            title="Doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            icon={<TrendingUp className="h-6 w-6" />}
          />
          <StatsCard
            title="Chi trả"
            value={formatCurrency(stats.totalPayouts)}
            icon={<CreditCard className="h-6 w-6" />}
          />
          <StatsCard title="Escrow" value={formatCurrency(stats.escrowBalance)} icon={<Wallet className="h-6 w-6" />} />
          <StatsCard
            title="Đang chờ"
            value={stats.pendingTransactions}
            description={`${formatCurrency(stats.pendingPayouts)} chờ xử lý`}
            icon={<Clock className="h-6 w-6" />}
          />
        </div>
      )}

      {/* Transactions Table */}
      <DataTable title="Lịch sử giao dịch" columns={columns} data={transactions} emptyMessage="Chưa có giao dịch nào" />
    </div>
  )
}
