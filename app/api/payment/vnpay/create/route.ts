// ============================================
// VNPay - Create Payment URL
// POST /api/payment/vnpay/create
// ============================================

import { NextRequest, NextResponse } from "next/server"
import { createVNPayUrl } from "@/lib/payment/vnpay"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { amount, orderInfo, orderId, locale, bankCode } = body

        // Validate input
        if (!amount || !orderInfo || !orderId) {
            return NextResponse.json(
                { success: false, message: "Thiếu thông tin bắt buộc: amount, orderInfo, orderId" },
                { status: 400 }
            )
        }

        if (amount < 5000) {
            return NextResponse.json(
                { success: false, message: "Số tiền tối thiểu là 5,000 VNĐ" },
                { status: 400 }
            )
        }

        // Get client IP
        const forwarded = request.headers.get("x-forwarded-for")
        const ipAddr = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"

        const paymentUrl = createVNPayUrl({
            amount,
            orderInfo,
            orderId,
            ipAddr,
            locale: locale || "vn",
            bankCode,
        })

        return NextResponse.json({
            success: true,
            paymentUrl,
            orderId,
            message: "Tạo đường dẫn thanh toán thành công",
        })
    } catch (error) {
        console.error("[VNPay Create] Error:", error)
        return NextResponse.json(
            { success: false, message: "Lỗi hệ thống khi tạo thanh toán VNPay" },
            { status: 500 }
        )
    }
}
