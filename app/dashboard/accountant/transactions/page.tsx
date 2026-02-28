"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/dashboard/data-table"
import { Search, Download, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"

export default function TransactionsPage() {
  const dispatch = useDispatch()
  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchTransactionsRequest())
  }, [dispatch])

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.userName?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || tx.type === typeFilter
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  // Sort by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const columns = [
    { key: "id", header: "Mã GD" },
    {
      key: "createdAt",
      header: "Ngày",
      render: (item: any) => new Date(item.createdAt).toLocaleDateString('vi-VN')
    },
    {
      key: "type",
      header: "Loại",
      render: (item: any) => {
        const value = item.type
        const labels: Record<string, string> = {
          student_payment: "Thanh toán",
          tutor_payout: "Chi trả",
          refund: "Hoàn tiền",
          class_registration_fee: "Hoa hồng",
          test_fee: "Phí thi",
          cancellation_fee: "Phí hủy",
          escrow_hold: "Giữ hộ",
          escrow_release: "Giải ngân"
        }
        const colors: Record<string, string> = {
          student_payment: "bg-green-100 text-green-800",
          tutor_payout: "bg-blue-100 text-blue-800",
          refund: "bg-orange-100 text-orange-800",
          class_registration_fee: "bg-purple-100 text-purple-800",
          test_fee: "bg-gray-100 text-gray-800",
        }
        return <Badge className={colors[value] || "bg-gray-100"}>{labels[value] || value}</Badge>
      },
    },
    { key: "description", header: "Mô tả" },
    {
      key: "userName",
      header: "Người dùng",
      render: (item: any) => (
        <span>{item.type === 'student_payment' ? `Từ: ${item.userName}` : item.type === 'tutor_payout' ? `Đến: ${item.userName}` : item.userName}</span>
      )
    },
    {
      key: "amount",
      header: "Số tiền",
      render: (item: any) => (
        <span className={['student_payment', 'class_registration_fee', 'test_fee', 'cancellation_fee'].includes(item.type) ? "text-green-600" : "text-red-600"}>
          {['student_payment', 'class_registration_fee', 'test_fee', 'cancellation_fee'].includes(item.type) ? "+" : "-"}
          {new Intl.NumberFormat("vi-VN").format(Math.abs(item.amount))}đ
        </span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: any) => {
        const value = item.status
        const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
          completed: "default",
          pending: "secondary",
          failed: "destructive",
          refunded: "destructive"
        }
        const labels: Record<string, string> = {
          completed: "Hoàn thành",
          pending: "Chờ xử lý",
          failed: "Thất bại",
          refunded: "Đã hoàn tiền"
        }
        return <Badge variant={variants[value] || "secondary"}>{labels[value] || value}</Badge>
      },
    },
    {
      key: "actions",
      header: "",
      render: (item: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toast({ title: "Đang tải", description: "Đang mở bảng chi tiết giao dịch..." })}>
              <Eye className="h-4 w-4 mr-2" />
              Xem chi tiết
            </DropdownMenuItem>
            {item.status === "pending" && <DropdownMenuItem onClick={() => toast({ title: "Thông báo", description: "Chuyển hướng đến màn hình xử lý..." })}>Xử lý</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => toast({ title: "Thông báo", description: "Hóa đơn đang được xuất..." })}>Xuất hóa đơn</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý giao dịch</h1>
          <p className="text-muted-foreground mt-1">Theo dõi và xử lý tất cả giao dịch trong hệ thống</p>
        </div>
        <Button variant="outline" onClick={() => toast({ title: "Thông báo", description: "Báo cáo tổng hợp đang được tạo..." })}>
          <Download className="h-4 w-4 mr-2" />
          Xuất báo cáo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã GD, mô tả, người dùng..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Loại giao dịch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                <SelectItem value="student_payment">Thanh toán</SelectItem>
                <SelectItem value="tutor_payout">Chi trả</SelectItem>
                <SelectItem value="refund">Hoàn tiền</SelectItem>
                <SelectItem value="class_registration_fee">Hoa hồng</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="pending">Chờ xử lý</SelectItem>
                <SelectItem value="failed">Thất bại</SelectItem>
                <SelectItem value="refunded">Đã hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={sortedTransactions} loading={isLoading} />
        </CardContent>
      </Card>
    </div>
  )
}
