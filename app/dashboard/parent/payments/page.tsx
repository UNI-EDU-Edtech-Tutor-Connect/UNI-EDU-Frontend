"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchUserTransactionsRequest } from "@/store/slices/transactions-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DataTable } from "@/components/dashboard/data-table"
import { Wallet, CreditCard, Clock, CheckCircle, AlertCircle, Search, Download, Plus, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import { usePayment } from "@/hooks/use-payment"

export default function ParentPaymentsPage() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const { user } = useSelector((state: RootState) => state.auth)
  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState("vnpay")

  const { isLoading: isPaymentLoading, payWithVNPay, payWithMoMo } = usePayment()

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserTransactionsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const pendingPayments = transactions
    .filter(t => t.status === 'pending')
    .map(t => ({
      id: t.id,
      child: t.userName || "Con em", // Placeholder if not available
      class: t.description || "Lớp học",
      tutor: "Gia sư", // Not in transaction
      amount: t.amount,
      dueDate: new Date(t.createdAt).toLocaleDateString("vi-VN"), // Using created date as due or close to it
      sessions: 0 // Not in transaction
    }))

  const paymentHistory = transactions
    .filter(t => t.status !== 'pending')
    .map(t => ({
      id: t.id,
      child: t.userName || "Con em",
      class: t.description || "Lớp học",
      amount: t.amount,
      date: new Date(t.createdAt).toLocaleDateString("vi-VN"),
      status: t.status,
      method: t.paymentMethod || "Chuyển khoản"
    }))

  const activePendingPayments = pendingPayments.length > 0 ? pendingPayments : [
    {
      id: "mock-pending-1",
      child: "Nguyễn Thị Lan",
      class: "Toán học nâng cao",
      tutor: "Trần Minh Tuấn",
      amount: 2500000,
      dueDate: "20/01/2026",
      sessions: 8
    },
    {
      id: "mock-pending-2",
      child: "Nguyễn Thị Lan",
      class: "Tiếng Anh giao tiếp",
      tutor: "Lê Thị Hương",
      amount: 1800000,
      dueDate: "25/01/2026",
      sessions: 6
    }
  ]

  const totalPending = activePendingPayments.reduce((sum, p) => sum + p.amount, 0)
  const totalPaid = paymentHistory.filter((p) => p.status === "completed").reduce((sum, p) => sum + p.amount, 0)
  const columns = [
    { key: "child", header: "Con em" },
    { key: "class", header: "Lớp học" },
    {
      key: "amount",
      header: "Số tiền",
      render: (item: any) => new Intl.NumberFormat("vi-VN").format(item.amount) + "đ",
    },
    { key: "date", header: "Ngày thanh toán" },
    { key: "method", header: "Phương thức" },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: any) => (
        <Badge variant={item.status === "completed" ? "default" : item.status === "refunded" ? "destructive" : "secondary"}>
          {item.status === "completed" ? "Thành công" : item.status === "refunded" ? "Hoàn tiền" : item.status}
        </Badge>
      ),
    },
  ]

  const handlePayment = (payment: any) => {
    setSelectedPayment(payment)
    setShowPaymentDialog(true)
  }

  const confirmPayment = async () => {
    if (!selectedPayment) return

    const orderInfo = `Thanh toan hoc phi: ${selectedPayment.class} - ${selectedPayment.child}`
    const orderId = `EDU-${selectedPayment.id}-${Date.now()}`

    if (paymentMethod === "vnpay") {
      await payWithVNPay({ amount: selectedPayment.amount, orderInfo, orderId })
    } else if (paymentMethod === "momo") {
      await payWithMoMo({ amount: selectedPayment.amount, orderInfo, orderId })
    } else {
      // Wallet or bank — use internal mock for now
      toast({ title: "Đang xữ lý", description: "Giao dịch đang được xử lý..." })
      setTimeout(() => {
        setShowPaymentDialog(false)
        setSelectedPayment(null)
        toast({ title: "Thanh toán thành công", description: `Đã thanh toán ${new Intl.NumberFormat("vi-VN").format(selectedPayment.amount)}đ qua Ví EduConnect.` })
      }, 1500)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý thanh toán</h1>
          <p className="text-muted-foreground mt-1">Thanh toán học phí và theo dõi lịch sử giao dịch</p>
        </div>
        <Button onClick={() => toast({ title: "Thông báo", description: "Chức năng Thanh toán mới đang được cập nhật." })}>
          <Plus className="h-4 w-4 mr-2" />
          Thanh toán mới
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Cần thanh toán</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {new Intl.NumberFormat("vi-VN").format(totalPending)}đ
            </div>
            <p className="text-xs text-muted-foreground">{activePendingPayments.length} khoản đang chờ</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã thanh toán tháng này</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat("vi-VN").format(totalPaid)}đ</div>
            <p className="text-xs text-muted-foreground">
              {paymentHistory.filter((p) => p.status === "completed").length} giao dịch
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Số dư ví</CardTitle>
            <Wallet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5,000,000đ</div>
            <Button size="sm" variant="link" className="p-0 h-auto text-xs">
              Nạp thêm
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <AlertCircle className="h-4 w-4" />
            Cần thanh toán ({activePendingPayments.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Lịch sử
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <div className="space-y-4">
            {activePendingPayments.map((payment) => (
              <Card key={payment.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{payment.class}</h3>
                        <Badge variant="outline">{payment.child}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Gia sư: {payment.tutor} - {payment.sessions} buổi học
                      </p>
                      <p className="text-sm text-orange-600">Hạn thanh toán: {payment.dueDate}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(payment.amount)}đ</p>
                        <p className="text-sm text-muted-foreground">
                          {new Intl.NumberFormat("vi-VN").format(payment.amount / payment.sessions)}đ/buổi
                        </p>
                      </div>
                      <Button onClick={() => handlePayment(payment)}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activePendingPayments.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Không có khoản nào cần thanh toán</h3>
                  <p className="text-muted-foreground">Tất cả học phí đã được thanh toán đầy đủ</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm giao dịch..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="completed">Thành công</SelectItem>
                <SelectItem value="refunded">Hoàn tiền</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => toast({ title: "Xuất Excel", description: "Báo cáo thanh toán đang được xử lý và tải xuống..." })}>
              <Download className="h-4 w-4 mr-2" />
              Xuất Excel
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <DataTable columns={columns} data={paymentHistory} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <div className="flex items-center justify-between mt-2">
            <div>
              <DialogTitle className="text-xl">Thanh toán học phí</DialogTitle>
              <DialogDescription>Chọn phương thức thanh toán</DialogDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1 px-2 py-1">
              <ShieldCheck className="h-4 w-4" />
              Secure Payment
            </Badge>
          </div>
          {selectedPayment && (
            <div className="space-y-4 py-2">
              <div className="p-4 bg-accent/50 rounded-lg border-l-4 border-green-500">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-green-800 text-sm">Escrow Protection</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tiền học phí sẽ được hệ thống giữ an toàn và chỉ thanh toán cho gia sư sau khi buổi học hoàn tất thành công.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-background border rounded-lg">
                <p className="font-medium">{selectedPayment.class}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedPayment.child} - {selectedPayment.sessions} buổi
                </p>
                <p className="text-xl font-bold mt-2 text-primary">
                  {new Intl.NumberFormat("vi-VN").format(selectedPayment.amount)}đ
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Phương thức thanh toán</label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vnpay">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">VNPAY</div>
                        <span className="font-medium">Cổng VNPay</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="momo">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-6 rounded bg-[#A50064] text-white flex items-center justify-center text-[10px] font-bold">MoMo</div>
                        <span className="font-medium">Ví MoMo</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="wallet">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-medium">Ví EduConnect (5,000,000đ)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="font-medium">Chuyển khoản ngân hàng</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>
              Hủy
            </Button>
            <Button onClick={confirmPayment} disabled={isPaymentLoading}>
              {isPaymentLoading
                ? "Đang chuyển hướng..."
                : paymentMethod === "vnpay"
                  ? "Thanh toán qua VNPay →"
                  : paymentMethod === "momo"
                    ? "Thanh toán qua MoMo →"
                    : "Xác nhận thanh toán"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
