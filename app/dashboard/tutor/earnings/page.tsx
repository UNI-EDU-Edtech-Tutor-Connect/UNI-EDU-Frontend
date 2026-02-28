"use client"

import React, { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { fetchTutorStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Wallet, TrendingUp, CreditCard, Clock, Banknote, ShieldCheck, AlertCircle, CheckCircle, Info, CheckCircle2 } from "lucide-react"
import type { Transaction } from "@/types"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

// Withdrawal Dialog Component
interface WithdrawalDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  availableBalance: number
  escrowAmount: number
  onWithdraw: (amount: number, method: string, details: any) => void
  isProcessing: boolean
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({
  isOpen,
  onOpenChange,
  availableBalance,
  escrowAmount,
  onWithdraw,
  isProcessing,
}) => {
  const { toast } = useToast()
  const [withdrawalAmount, setWithdrawalAmount] = useState<string>("")
  const [selectedMethod, setSelectedMethod] = useState<string>("bank_transfer")
  const [bankName, setBankName] = useState<string>("")
  const [accountNumber, setAccountNumber] = useState<string>("")
  const [accountHolder, setAccountHolder] = useState<string>("")
  const [phoneNumber, setPhoneNumber] = useState<string>("") // For MoMo/VNPay

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawalAmount)
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập số tiền hợp lệ.",
        variant: "destructive",
      })
      return
    }
    if (amount > availableBalance) {
      toast({
        title: "Lỗi",
        description: "Số tiền rút vượt quá số dư khả dụng.",
        variant: "destructive",
      })
      return
    }

    let details: any = {}
    if (selectedMethod === "bank_transfer") {
      if (!bankName || !accountNumber || !accountHolder) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin ngân hàng.",
          variant: "destructive",
        })
        return
      }
      details = { bankName, accountNumber, accountHolder }
    } else if (selectedMethod === "momo_vnpay") {
      if (!phoneNumber) {
        toast({
          title: "Lỗi",
          description: "Vui lòng nhập số điện thoại MoMo/VNPay.",
          variant: "destructive",
        })
        return
      }
      details = { phoneNumber }
    } else if (selectedMethod === "eduwallet") {
      // No extra details needed for EduWallet, it's internal
    }

    onWithdraw(amount, selectedMethod, details)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Yêu cầu rút tiền</DialogTitle>
          <DialogDescription>
            Chọn phương thức và nhập số tiền bạn muốn rút.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Số dư khả dụng:</span>
            <span className="font-bold text-primary">{formatCurrency(availableBalance)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Số tiền đang giữ (Escrow):</span>
            <span className="font-bold text-warning">{formatCurrency(escrowAmount)}</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawalAmount">Số tiền muốn rút</Label>
            <Input
              id="withdrawalAmount"
              type="number"
              value={withdrawalAmount}
              onChange={(e) => setWithdrawalAmount(e.target.value)}
              placeholder="Nhập số tiền"
            />
          </div>

          <Tabs value={selectedMethod} onValueChange={setSelectedMethod} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bank_transfer">Ngân hàng</TabsTrigger>
              <TabsTrigger value="momo_vnpay">MoMo/VNPay</TabsTrigger>
              <TabsTrigger value="eduwallet">EduWallet</TabsTrigger>
            </TabsList>
            <TabsContent value="bank_transfer" className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="bankName">Tên ngân hàng</Label>
                <Input id="bankName" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="Ví dụ: Vietcombank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Số tài khoản</Label>
                <Input id="accountNumber" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder="Nhập số tài khoản" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Tên chủ tài khoản</Label>
                <Input id="accountHolder" value={accountHolder} onChange={(e) => setAccountHolder(e.target.value)} placeholder="Nhập tên chủ tài khoản" />
              </div>
            </TabsContent>
            <TabsContent value="momo_vnpay" className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Số điện thoại MoMo/VNPay</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="Nhập số điện thoại" />
              </div>
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Lưu ý</AlertTitle>
                <AlertDescription>
                  Đảm bảo số điện thoại đã đăng ký với MoMo hoặc VNPay.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="eduwallet" className="mt-4 space-y-3">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Rút về EduWallet</AlertTitle>
                <AlertDescription>
                  Số tiền sẽ được chuyển vào ví EduWallet của bạn ngay lập tức.
                  Bạn có thể sử dụng số dư này để thanh toán các dịch vụ khác trên nền tảng.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          <Alert className="mt-4">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Giao dịch an toàn</AlertTitle>
            <AlertDescription>
              Tất cả các giao dịch rút tiền đều được bảo mật bằng mã hóa SSL và xác minh hai yếu tố.
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Hủy</Button>
          <Button onClick={handleWithdraw} disabled={isProcessing}>
            {isProcessing ? "Đang xử lý..." : "Rút tiền"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


export default function TutorEarningsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { transactions } = useAppSelector((state) => state.transactions)
  const { tutorStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)
  const { toast } = useToast()

  const [isWithdrawalDialogOpen, setIsWithdrawalDialogOpen] = useState(false)
  const [isWithdrawalProcessing, setIsWithdrawalProcessing] = useState(false)

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

  const handleWithdrawal = (amount: number, method: string, details: any) => {
    setIsWithdrawalProcessing(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Withdrawal Request:", { amount, method, details })
      toast({
        title: "Yêu cầu rút tiền thành công",
        description: `Bạn đã yêu cầu rút ${formatCurrency(amount)} qua ${method}. Giao dịch đang được xử lý.`,
      })
      setIsWithdrawalProcessing(false)
      setIsWithdrawalDialogOpen(false)
      // In a real app, you'd dispatch an action here to update backend
    }, 2000)
  }

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
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: "Thành công", description: "Đang tải xuống báo cáo..." })}>Xuất báo cáo</Button>
          <Button
            className="gap-2 bg-success hover:bg-success/90"
            onClick={() => setIsWithdrawalDialogOpen(true)}
          >
            <Banknote className="h-4 w-4" />
            Rút tiền
          </Button>
        </div>
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

      <WithdrawalDialog
        isOpen={isWithdrawalDialogOpen}
        onOpenChange={setIsWithdrawalDialogOpen}
        availableBalance={availableBalance}
        escrowAmount={escrowAmount}
        onWithdraw={handleWithdrawal}
        isProcessing={isWithdrawalProcessing}
      />
    </div>
  )
}
