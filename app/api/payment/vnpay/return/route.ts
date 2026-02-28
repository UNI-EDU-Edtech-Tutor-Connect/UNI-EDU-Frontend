// ============================================
// VNPay - Return URL Handler
// GET /api/payment/vnpay/return
// ============================================
// VNPay redirects user here after payment

import { NextRequest, NextResponse } from "next/server"
import { verifyVNPaySignature, getVNPayResponseMessage } from "@/lib/payment/vnpay"
import type { VNPayReturnParams } from "@/lib/payment/vnpay"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    // Collect all vnp_ params
    const vnpParams: VNPayReturnParams = {} as VNPayReturnParams
    searchParams.forEach((value, key) => {
        if (key.startsWith("vnp_")) {
            (vnpParams as any)[key] = value
        }
    })

    // Verify signature
    const isValid = verifyVNPaySignature(vnpParams)

    if (!isValid) {
        console.error("[VNPay Return] Invalid signature")
        return NextResponse.redirect(
            new URL(`/payment/result?status=error&message=Chữ+ký+không+hợp+lệ`, request.url)
        )
    }

    const responseCode = vnpParams.vnp_ResponseCode
    const message = getVNPayResponseMessage(responseCode)
    const orderId = vnpParams.vnp_TxnRef
    const amount = parseInt(vnpParams.vnp_Amount) / 100 // Convert back from x100

    if (responseCode === "00") {
        // Payment successful — in production: update DB order status here
        console.log(`[VNPay Return] SUCCESS - Order: ${orderId}, Amount: ${amount} VND`)
        return NextResponse.redirect(
            new URL(
                `/payment/result?status=success&orderId=${orderId}&amount=${amount}&method=vnpay&message=${encodeURIComponent(message)}`,
                request.url
            )
        )
    }

    // Payment failed
    console.log(`[VNPay Return] FAILED (${responseCode}) - Order: ${orderId}`)
    return NextResponse.redirect(
        new URL(
            `/payment/result?status=failed&orderId=${orderId}&code=${responseCode}&message=${encodeURIComponent(message)}`,
            request.url
        )
    )
}
