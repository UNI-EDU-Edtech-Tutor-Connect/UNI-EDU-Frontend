// ============================================
// VNPay - IPN (Instant Payment Notification)
// POST /api/payment/vnpay/ipn
// ============================================
// VNPay calls this server-to-server after payment
// This is where you update your database

import { NextRequest, NextResponse } from "next/server"
import { verifyVNPaySignature } from "@/lib/payment/vnpay"
import type { VNPayReturnParams } from "@/lib/payment/vnpay"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const vnpParams: VNPayReturnParams = {} as VNPayReturnParams
    searchParams.forEach((value, key) => {
        if (key.startsWith("vnp_")) {
            (vnpParams as any)[key] = value
        }
    })

    // Verify signature
    const isValid = verifyVNPaySignature(vnpParams)
    if (!isValid) {
        return NextResponse.json({ RspCode: "97", Message: "Fail checksum" })
    }

    const orderId = vnpParams.vnp_TxnRef
    const amount = parseInt(vnpParams.vnp_Amount) / 100
    const responseCode = vnpParams.vnp_ResponseCode

    // TODO: Connect to database here to:
    // 1. Find the order by orderId
    // 2. Verify amount matches
    // 3. Check order hasn't been processed (idempotency)
    // 4. Update order status to 'completed' or 'failed'
    // 5. Trigger any post-payment actions (e.g., activate class, send receipt email)

    if (responseCode === "00") {
        console.log(`[VNPay IPN] Payment confirmed - Order: ${orderId}, Amount: ${amount} VND`)
        // Example: await db.orders.update({ id: orderId }, { status: 'paid', paidAt: new Date() })
        return NextResponse.json({ RspCode: "00", Message: "Confirm Success" })
    }

    console.log(`[VNPay IPN] Payment failed (${responseCode}) - Order: ${orderId}`)
    return NextResponse.json({ RspCode: "00", Message: "Confirm Success" }) // Always return 00 to VNPay
}
