// ============================================
// MoMo - IPN (Instant Payment Notification)
// POST /api/payment/momo/ipn
// ============================================
// MoMo calls this server-to-server after payment

import { NextRequest, NextResponse } from "next/server"
import { verifyMoMoSignature, getMoMoResultMessage } from "@/lib/payment/momo"
import type { MoMoIPNPayload } from "@/lib/payment/momo"

export async function POST(request: NextRequest) {
    try {
        const payload: MoMoIPNPayload = await request.json()

        // Verify signature
        const isValid = verifyMoMoSignature(payload)
        if (!isValid) {
            console.error("[MoMo IPN] Invalid signature for order:", payload.orderId)
            return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
        }

        const { orderId, amount, resultCode, transId } = payload
        const message = getMoMoResultMessage(resultCode)

        if (resultCode === 0) {
            // Payment successful
            console.log(`[MoMo IPN] Payment confirmed - Order: ${orderId}, Amount: ${amount}, TransId: ${transId}`)
            // TODO: Update your database here:
            // await db.orders.update({ id: orderId }, { status: 'paid', momoTransId: transId, paidAt: new Date() })
        } else {
            console.log(`[MoMo IPN] Payment failed (${resultCode}: ${message}) - Order: ${orderId}`)
            // TODO: Update order status to 'failed'
        }

        return NextResponse.json({ message: "OK" }, { status: 200 })
    } catch (error) {
        console.error("[MoMo IPN] Unhandled error:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
