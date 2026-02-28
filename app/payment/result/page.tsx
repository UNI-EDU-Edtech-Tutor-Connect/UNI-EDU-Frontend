// ============================================
// PAYMENT RESULT PAGE
// /payment/result
// ============================================

"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, XCircle, Clock, ArrowLeft, Receipt } from "lucide-react"

function PaymentResultContent() {
    const searchParams = useSearchParams()
    const router = useRouter()

    const status = searchParams.get("status")
    const orderId = searchParams.get("orderId")
    const amount = searchParams.get("amount")
    const method = searchParams.get("method")
    const message = searchParams.get("message")

    const formatCurrency = (val: string | null) =>
        val ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(parseInt(val)) : ""

    const isSuccess = status === "success"
    const isFailed = status === "failed"

    useEffect(() => {
        // Could log analytics / update Redux state here
        if (isSuccess && orderId) {
            console.log(`Payment success: ${orderId}`)
        }
    }, [isSuccess, orderId])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-xl">
                <CardContent className="pt-8 pb-8">
                    <div className="flex flex-col items-center text-center space-y-6">

                        {/* Status Icon */}
                        {isSuccess && (
                            <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle className="h-14 w-14 text-green-600" />
                            </div>
                        )}
                        {isFailed && (
                            <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-14 w-14 text-red-500" />
                            </div>
                        )}
                        {!isSuccess && !isFailed && (
                            <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center">
                                <Clock className="h-14 w-14 text-amber-600" />
                            </div>
                        )}

                        {/* Title */}
                        <div>
                            <h1 className="text-2xl font-bold">
                                {isSuccess ? "Thanh toán thành công!" : isFailed ? "Thanh toán thất bại" : "Đang xử lý..."}
                            </h1>
                            <p className="text-muted-foreground mt-1 text-sm">
                                {message || (isSuccess ? "Giao dịch đã được xác nhận" : "Vui lòng thử lại hoặc liên hệ hỗ trợ")}
                            </p>
                        </div>

                        {/* Transaction Details */}
                        {(orderId || amount) && (
                            <div className="w-full p-4 bg-muted/40 rounded-xl space-y-3 text-sm">
                                {orderId && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Mã giao dịch</span>
                                        <span className="font-mono font-medium text-xs">{orderId}</span>
                                    </div>
                                )}
                                {amount && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Số tiền</span>
                                        <span className="font-bold text-green-600">{formatCurrency(amount)}</span>
                                    </div>
                                )}
                                {method && (
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Phương thức</span>
                                        <span className="font-medium capitalize">{method === "vnpay" ? "VNPay" : method === "momo" ? "MoMo" : method}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col gap-3 w-full pt-2">
                            {isSuccess && (
                                <Button className="w-full gap-2" onClick={() => router.push("/dashboard/parent/payments")}>
                                    <Receipt className="h-4 w-4" />
                                    Xem lịch sử thanh toán
                                </Button>
                            )}
                            <Button
                                variant={isSuccess ? "outline" : "default"}
                                className="w-full gap-2"
                                onClick={() => router.push("/dashboard")}
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Về trang chủ
                            </Button>
                            {isFailed && (
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => router.push("/dashboard/parent/payments")}
                                >
                                    Thử lại thanh toán
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isSuccess && (
                <p className="text-xs text-muted-foreground mt-6 text-center max-w-sm">
                    Biên lai đã được ghi nhận. Gia sư và học sinh sẽ nhận được thông báo xác nhận buổi học.
                </p>
            )}
        </div>
    )
}

export default function PaymentResultPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Đang tải...</div>}>
            <PaymentResultContent />
        </Suspense>
    )
}
