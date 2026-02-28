// ============================================
// usePayment Hook
// Wraps VNPay and MoMo payment API calls
// ============================================

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"

interface PaymentOptions {
    amount: number
    orderInfo: string
    orderId?: string
}

interface PaymentState {
    isLoading: boolean
    error: string | null
}

export function usePayment() {
    const [state, setState] = useState<PaymentState>({ isLoading: false, error: null })
    const { toast } = useToast()

    /**
     * Generate unique order ID
     */
    const genOrderId = () => `EDU-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    /**
     * Pay with VNPay — redirects user to VNPay checkout
     */
    const payWithVNPay = async (options: PaymentOptions, bankCode?: string) => {
        setState({ isLoading: true, error: null })

        const orderId = options.orderId || genOrderId()

        try {
            const response = await fetch("/api/payment/vnpay/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: options.amount,
                    orderInfo: options.orderInfo,
                    orderId,
                    bankCode,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                const msg = data.message || "Không thể tạo thanh toán VNPay"
                setState({ isLoading: false, error: msg })
                toast({ title: "Lỗi VNPay", description: msg, variant: "destructive" })
                return
            }

            // Redirect to VNPay
            window.location.href = data.paymentUrl

        } catch (err) {
            const msg = "Không thể kết nối VNPay. Vui lòng thử lại."
            setState({ isLoading: false, error: msg })
            toast({ title: "Lỗi kết nối", description: msg, variant: "destructive" })
        }
    }

    /**
     * Pay with MoMo — redirects user to MoMo checkout (or shows QR)
     */
    const payWithMoMo = async (
        options: PaymentOptions,
        onQRReady?: (qrUrl: string) => void
    ) => {
        setState({ isLoading: true, error: null })

        const orderId = options.orderId || genOrderId()

        try {
            const response = await fetch("/api/payment/momo/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: options.amount,
                    orderInfo: options.orderInfo,
                    orderId,
                }),
            })

            const data = await response.json()

            if (!data.success) {
                const msg = data.message || "Không thể tạo thanh toán MoMo"
                setState({ isLoading: false, error: msg })
                toast({ title: "Lỗi MoMo", description: msg, variant: "destructive" })
                return
            }

            // If QR callback provided and QR URL available, show QR instead of redirect
            if (onQRReady && data.qrCodeUrl) {
                setState({ isLoading: false, error: null })
                onQRReady(data.qrCodeUrl)
                return
            }

            // Redirect to MoMo
            window.location.href = data.payUrl

        } catch (err) {
            const msg = "Không thể kết nối MoMo. Vui lòng thử lại."
            setState({ isLoading: false, error: msg })
            toast({ title: "Lỗi kết nối", description: msg, variant: "destructive" })
        }
    }

    return {
        ...state,
        payWithVNPay,
        payWithMoMo,
    }
}
