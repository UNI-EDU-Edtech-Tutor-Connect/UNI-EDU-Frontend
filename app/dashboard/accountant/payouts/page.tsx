"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTransactionsRequest, processPayoutRequest } from "@/store/slices/transactions-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Search, Send, CheckCircle, Clock, AlertCircle, Wallet } from "lucide-react"
export default function PayoutsPage() {
  const dispatch = useDispatch()
  const { transactions, isLoading } = useSelector((state: RootState) => state.transactions)
  const [selectedPayouts, setSelectedPayouts] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [selectedPayout, setSelectedPayout] = useState<any>(null)

  useEffect(() => {
    dispatch(fetchTransactionsRequest())
  }, [dispatch])

  // Filter for pending teacher payouts
  // Note: Mock data used 'tutor' field, but Transaction has 'userName'
  const pendingPayouts = transactions.filter(
    (t) => t.type === "tutor_payout" && t.status === "pending"
  )

  const filteredPayouts = pendingPayouts.filter(
    (p) =>
      p.userName.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedPayouts)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedPayouts(newSelected)
  }

  const selectAll = () => {
    if (selectedPayouts.size === filteredPayouts.length) {
      setSelectedPayouts(new Set())
    } else {
      setSelectedPayouts(new Set(filteredPayouts.map((p) => p.id)))
    }
  }

  const totalSelected = filteredPayouts.filter((p) => selectedPayouts.has(p.id)).reduce((sum, p) => sum + p.amount, 0)
  const totalPendingAmount = pendingPayouts.reduce((sum, p) => sum + p.amount, 0)

  // Calculate stats from transactions
  const totalPaidThisMonth = transactions
    .filter(t => t.type === 'tutor_payout' && t.status === 'completed' && new Date(t.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, t) => sum + t.amount, 0)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Chờ duyệt
          </Badge>
        )
      case "approved":
        return (
          <Badge className="bg-blue-100 text-blue-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            Đã duyệt
          </Badge>
        )
      case "processing":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
            <AlertCircle className="h-3 w-3" />
            Đang xử lý
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 gap-1">
            <CheckCircle className="h-3 w-3" />
            Hoàn thành
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleProcessPayouts = () => {
    selectedPayouts.forEach(id => {
      dispatch(processPayoutRequest(id))
    })
    setShowConfirmDialog(false)
    setSelectedPayouts(new Set())
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chi trả gia sư</h1>
          <p className="text-muted-foreground mt-1">Xử lý thanh toán cho gia sư theo định kỳ</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tổng chờ chi trả</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {new Intl.NumberFormat("vi-VN").format(totalPendingAmount)}đ
            </div>
            <p className="text-xs text-muted-foreground">{pendingPayouts.length} khoản</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Đã chọn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat("vi-VN").format(totalSelected)}đ
            </div>
            <p className="text-xs text-muted-foreground">{selectedPayouts.size} khoản</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Escrow Balance</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mock escrow balance or get from stats */}
            <div className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(52000000)}đ</div>
            <p className="text-xs text-muted-foreground">Có thể chi trả</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chi trả tháng này</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{new Intl.NumberFormat("vi-VN").format(totalPaidThisMonth)}đ</div>
            <p className="text-xs text-muted-foreground">Đã xử lý</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Danh sách chi trả</CardTitle>
              <CardDescription>Chọn và xử lý các khoản chi trả cho gia sư</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm..."
                  className="pl-9 w-[200px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => setShowConfirmDialog(true)} disabled={selectedPayouts.size === 0}>
                <Send className="h-4 w-4 mr-2" />
                Xử lý ({selectedPayouts.size})
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : filteredPayouts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không có khoản chi trả nào chờ xử lý</div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Checkbox
                  checked={
                    selectedPayouts.size === filteredPayouts.length &&
                    selectedPayouts.size > 0
                  }
                  onCheckedChange={selectAll}
                />
                <span className="text-sm font-medium">
                  Chọn tất cả ({filteredPayouts.length} khoản chờ duyệt)
                </span>
              </div>

              {filteredPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className={`flex items-center gap-4 p-4 border rounded-lg ${selectedPayouts.has(payout.id) ? "border-primary bg-primary/5" : ""
                    }`}
                >
                  <Checkbox
                    checked={selectedPayouts.has(payout.id)}
                    onCheckedChange={() => toggleSelect(payout.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{payout.userName}</span>
                      <span className="text-sm text-muted-foreground">({payout.id})</span>
                      {getStatusBadge(payout.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {payout.paymentMethod || 'Bank Transfer'} | {payout.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">{new Intl.NumberFormat("vi-VN").format(payout.amount)}đ</p>
                    <p className="text-sm text-muted-foreground">Ngày tạo: {new Date(payout.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedPayout(payout)
                      setShowDetailDialog(true)
                    }}
                  >
                    Chi tiết
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận chi trả</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn sắp xử lý {selectedPayouts.size} khoản chi trả với tổng số tiền{" "}
              <span className="font-semibold">{new Intl.NumberFormat("vi-VN").format(totalSelected)}đ</span>
              <br />
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleProcessPayouts}>Xác nhận chi trả</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Dialog */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chi tiết chi trả</DialogTitle>
            <DialogDescription>Thông tin chi tiết về khoản chi trả cho gia sư</DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Gia sư</p>
                  <p className="font-medium">{selectedPayout.userName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mã chi trả</p>
                  <p className="font-medium">{selectedPayout.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phương thức</p>
                  <p className="font-medium">{selectedPayout.paymentMethod || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nội dung</p>
                  <p className="font-medium">{selectedPayout.description}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ngày tạo</p>
                  <p className="font-medium">{new Date(selectedPayout.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  {getStatusBadge(selectedPayout.status)}
                </div>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Số tiền chi trả</p>
                <p className="text-2xl font-bold">{new Intl.NumberFormat("vi-VN").format(selectedPayout.amount)}đ</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailDialog(false)}>
              Đóng
            </Button>
            {selectedPayout?.status === "pending" && (
              <Button
                onClick={() => {
                  setSelectedPayouts(new Set([selectedPayout.id]))
                  setShowDetailDialog(false)
                  setShowConfirmDialog(true)
                }}
              >
                <Wallet className="h-4 w-4 mr-2" />
                Chi trả ngay
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
