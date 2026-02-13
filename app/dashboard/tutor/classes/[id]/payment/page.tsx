"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  CreditCard,
  Wallet,
  Building2,
  Smartphone,
  CheckCircle,
  Shield,
  Clock,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const REGISTRATION_FEE = 500000 // 500,000 VND

export default function TutorPaymentPage() {
  const params = useParams()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState("wallet")
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [processing, setProcessing] = useState(false)

  const walletBalance = 1200000 // Mock wallet balance

  const handlePayment = () => {
    setProcessing(true)
    // TODO: API call to process payment
    setTimeout(() => {
      setProcessing(false)
      setShowSuccessDialog(true)
    }, 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Thanh toán nhận lớp</h1>
          <p className="text-muted-foreground">Hoàn tất thanh toán để nhận lớp Toán 12</p>
        </div>
      </div>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chi tiết thanh toán</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-muted/50">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Lớp Toán 12</span>
              <Badge>Đã đậu test</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Học sinh: Nguyễn Văn A</p>
            <p className="text-sm text-muted-foreground">Lịch: T3, T5, T7 - 14:00-15:30</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Phí đăng ký lớp</span>
              <span>{formatCurrency(REGISTRATION_FEE)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-600">
              <span>Hoàn lại sau 3 buổi dạy</span>
              <span>-{formatCurrency(REGISTRATION_FEE)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Tổng thanh toán</span>
              <span className="text-primary">{formatCurrency(REGISTRATION_FEE)}</span>
            </div>
          </div>

          <div className="p-3 rounded-lg border border-blue-200 bg-blue-50 text-sm">
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Bảo đảm hoàn tiền</p>
                <p className="text-blue-700">
                  Phí đăng ký sẽ được hoàn lại 100% vào ví sau khi hoàn thành 3 buổi dạy đầu tiên.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chọn phương thức thanh toán</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
            <div
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "wallet" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("wallet")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="wallet" id="wallet" />
                <Wallet className="h-5 w-5 text-primary" />
                <div>
                  <Label htmlFor="wallet" className="font-medium cursor-pointer">
                    Ví EduConnect
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Số dư: <span className="font-medium text-green-600">{formatCurrency(walletBalance)}</span>
                  </p>
                </div>
              </div>
              {walletBalance >= REGISTRATION_FEE && (
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Đủ số dư
                </Badge>
              )}
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "bank" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("bank")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="bank" id="bank" />
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <Label htmlFor="bank" className="font-medium cursor-pointer">
                    Chuyển khoản ngân hàng
                  </Label>
                  <p className="text-sm text-muted-foreground">VCB, TCB, MB, BIDV...</p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "momo" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("momo")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="momo" id="momo" />
                <Smartphone className="h-5 w-5 text-pink-600" />
                <div>
                  <Label htmlFor="momo" className="font-medium cursor-pointer">
                    Ví MoMo
                  </Label>
                  <p className="text-sm text-muted-foreground">Thanh toán qua ứng dụng MoMo</p>
                </div>
              </div>
            </div>

            <div
              className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${
                paymentMethod === "card" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value="card" id="card" />
                <CreditCard className="h-5 w-5 text-purple-600" />
                <div>
                  <Label htmlFor="card" className="font-medium cursor-pointer">
                    Thẻ Visa/Mastercard
                  </Label>
                  <p className="text-sm text-muted-foreground">Thanh toán bằng thẻ quốc tế</p>
                </div>
              </div>
            </div>
          </RadioGroup>

          {/* Bank Transfer Details */}
          {paymentMethod === "bank" && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3">
              <p className="font-medium">Thông tin chuyển khoản:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ngân hàng:</span>
                  <span className="font-medium">Vietcombank</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Số tài khoản:</span>
                  <span className="font-medium">1234567890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Chủ TK:</span>
                  <span className="font-medium">CÔNG TY EDUCONNECT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nội dung:</span>
                  <span className="font-medium text-primary">TUTOR {params.id}</span>
                </div>
              </div>
            </div>
          )}

          {/* Card Form */}
          {paymentMethod === "card" && (
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label>Số thẻ</Label>
                <Input placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ngày hết hạn</Label>
                  <Input placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input placeholder="123" type="password" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tên chủ thẻ</Label>
                <Input placeholder="NGUYEN VAN A" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Thời hạn thanh toán</p>
                <p className="text-muted-foreground">Bạn cần hoàn tất thanh toán trong vòng 24 giờ để giữ lớp.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">Chính sách hủy</p>
                <p className="text-muted-foreground">Hủy lớp trong tháng đầu tiên sẽ mất 20% phí đăng ký.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button
        className="w-full h-12 text-lg bg-accent hover:bg-accent/90"
        onClick={handlePayment}
        disabled={processing || (paymentMethod === "wallet" && walletBalance < REGISTRATION_FEE)}
      >
        {processing ? (
          <>
            <span className="animate-spin mr-2">⏳</span>
            Đang xử lý...
          </>
        ) : (
          <>Thanh toán {formatCurrency(REGISTRATION_FEE)}</>
        )}
      </Button>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-center text-xl">Thanh toán thành công!</DialogTitle>
            <DialogDescription className="text-center">
              Bạn đã nhận lớp Toán 12 thành công. Hệ thống sẽ gửi thông tin chi tiết qua email và thông báo.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm">
            <p className="font-medium text-green-800 mb-2">Các bước tiếp theo:</p>
            <ul className="space-y-1 text-green-700">
              <li>1. Liên hệ phụ huynh để xác nhận lịch học</li>
              <li>2. Chuẩn bị bài giảng cho buổi đầu tiên</li>
              <li>3. Tham gia lớp học đúng giờ</li>
            </ul>
          </div>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button className="w-full" asChild>
              <Link href={`/dashboard/tutor/classes/${params.id}`}>Xem chi tiết lớp</Link>
            </Button>
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/tutor/classes">Quay lại danh sách</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
