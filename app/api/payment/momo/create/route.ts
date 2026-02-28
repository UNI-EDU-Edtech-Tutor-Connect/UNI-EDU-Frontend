// ============================================
// MoMo - Create Payment
// POST /api/payment/momo/create
// ============================================

import { NextRequest, NextResponse } from "next/server"
import { createMoMoPayment } from "@/lib/payment/momo"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { amount, orderInfo, orderId, extraData } = body

        // Validate input
        if (!amount || !orderInfo || !orderId) {
            return NextResponse.json(
                { success: false, message: "Thiếu thông tin bắt buộc: amount, orderInfo, orderId" },
                { status: 400 }
            )
        }

        if (amount < 1000) {
            return NextResponse.json(
                { success: false, message: "Số tiền tối thiểu là 1,000 VNĐ" },
                { status: 400 }
            )
        }

        const result = await createMoMoPayment({
            amount,
            orderInfo,
            orderId,
            extraData: extraData || "",
        })

        if (!result.success) {
            return NextResponse.json(
                { success: false, message: result.message },
                { status: 400 }
            )
        }

        return NextResponse.json({
            success: true,
            payUrl: result.payUrl,
            qrCodeUrl: result.qrCodeUrl,
            orderId,
            message: "Tạo thanh toán MoMo thành công",
        })
    } catch (error) {
        console.error("[MoMo Create] Error:", error)
        return NextResponse.json(
            { success: false, message: "Lỗi hệ thống khi tạo thanh toán MoMo" },
            { status: 500 }
        )
    }
}
