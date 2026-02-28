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

const REGISTRATION_FEE = 400000 // 400,000 VND (Ưu đãi Giáo Viên)

export default function TeacherPaymentPage() {
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
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold">Thanh toán nhận lớp</h1>
                        <Badge className="bg-amber-500 hover:bg-amber-600">Đại sứ</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Hoàn tất thanh toán phân bổ lớp học thông qua Escrow EduConnect</p>
                </div>
            </div>

            {/* Order Summary */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Chi tiết phiên giao dịch</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">Hóa học - Lớp 10</span>
                            <Badge>Duyệt bởi Hệ thống</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Học sinh: Trần Văn Nam</p>
                        <p className="text-sm text-muted-foreground">Lịch: T4 - 17:00-19:00 (Offline)</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Phí đăng ký nhận lớp</span>
                            <span className="line-through text-muted-foreground">{formatCurrency(500000)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-amber-600 font-medium">
                            <span>Đặc quyền phí Giáo Viên (Giảm 20%)</span>
                            <span>{formatCurrency(REGISTRATION_FEE)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-green-600">
                            <span>Escrow EduConnect - Hoàn tiền sau 3 buổi</span>
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
                                <p className="font-medium text-blue-800">Qũy bảo lãnh Escrow 100% Khép Kín</p>
                                <p className="text-blue-700 mt-1">
                                    Đây là số tiền đóng quy định theo <strong>Solution B (Escrow/Smart Contract Mode)</strong>. Tiền sẽ được giữ ở trạng thái "Tạm khóa" trong App, và tự động <strong className="text-green-700">chuyển lại ví Tài Khoản</strong> của bạn ngy lập tức khi hệ thống ghi nhận Giáo viên dạy đủ 3 buổi đầu tiên thành công!
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
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "wallet" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
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
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "bank" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                }`}
                            onClick={() => setPaymentMethod("bank")}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="bank" id="bank" />
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <div>
                                    <Label htmlFor="bank" className="font-medium cursor-pointer">
                                        Chuyển khoản ngân hàng (API Banking nội địa)
                                    </Label>
                                    <p className="text-sm text-muted-foreground">VCB, TCB, MB, BIDV...</p>
                                </div>
                            </div>
                        </div>

                        <div
                            className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                                }`}
                            onClick={() => setPaymentMethod("card")}
                        >
                            <div className="flex items-center gap-3">
                                <RadioGroupItem value="card" id="card" />
                                <CreditCard className="h-5 w-5 text-purple-600" />
                                <div>
                                    <Label htmlFor="card" className="font-medium cursor-pointer">
                                        Thẻ Napas / Master / Visa
                                    </Label>
                                    <p className="text-sm text-muted-foreground">Thanh toán bảo mật cổng quốc tế</p>
                                </div>
                            </div>
                        </div>
                    </RadioGroup>

                    {/* Bank Transfer Details */}
                    {paymentMethod === "bank" && (
                        <div className="mt-4 p-4 rounded-lg bg-muted/50 space-y-3 border border-border">
                            <p className="font-medium">Hướng dẫn chuyển khoản nhanh:</p>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ngân hàng:</span>
                                    <span className="font-medium">Vietcombank</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Số tài khoản:</span>
                                    <span className="font-medium">8866993355</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Chủ TK thụ hưởng:</span>
                                    <span className="font-medium">CÔNG TY GIÁO DỤC TƯƠNG LAI</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nội dung chuyển:</span>
                                    <span className="font-medium text-primary">EDU TEACHER {params.id}</span>
                                </div>
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
                                <p className="font-medium">Ưu tiên Giữ Lớp trong 4 Tiếng</p>
                                <p className="text-muted-foreground">Bạn cần hoàn tất thanh toán Escrow trong 4h để không bị mất suất lớp Cao Cấp này.</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
                className="w-full h-12 text-lg bg-accent hover:bg-accent/90 shadow-md"
                onClick={handlePayment}
                disabled={processing || (paymentMethod === "wallet" && walletBalance < REGISTRATION_FEE)}
            >
                {processing ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Đang mã hóa Giao Dịch vào Escrow...
                    </>
                ) : (
                    <>Khóa Quỹ {formatCurrency(REGISTRATION_FEE)} vào Escrow & Nhận Lớp</>
                )}
            </Button>

            {/* Success Dialog */}
            <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-center text-xl">Thanh toán Escrow thành công!</DialogTitle>
                        <DialogDescription className="text-center">
                            Dòng tiền đã được đóng băng tại Escrow Fund. Bạn đã kết nối với tài khoản Học Sinh.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-sm mt-2">
                        <p className="font-medium text-green-800 mb-2">Các bước tiếp theo:</p>
                        <ul className="space-y-2 text-green-700">
                            <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" /> Liên hệ số điện thoại phụ huynh trên hệ thống để làm quen.</li>
                            <li className="flex gap-2 items-start"><CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" /> Update lịch dạy vào phần mềm và sử dụng Zoom nội bộ để Record bằng chứng.</li>
                        </ul>
                    </div>
                    <DialogFooter className="flex-col gap-2 sm:flex-col mt-4">
                        <Button className="w-full bg-accent hover:bg-accent/90" asChild>
                            <Link href={`/dashboard/teacher/classes/${params.id}`}>Mở Khóa Thông Tin Liên Hệ Lớp</Link>
                        </Button>
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                            <Link href="/dashboard/teacher/classes">Trở Về Tổng Quan Lớp</Link>
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
