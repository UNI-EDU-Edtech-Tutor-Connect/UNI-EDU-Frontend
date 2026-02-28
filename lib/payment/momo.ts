// ============================================
// MOMO PAYMENT HELPER
// ============================================
// Handles MoMo payment via Pay With MoMo (ATM) method
// Docs: https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method

import crypto from "crypto"

export const MOMO_CONFIG = {
    // MoMo Sandbox credentials (officially documented by MoMo)
    // Source: https://developers.momo.vn/#/docs/en/aiov2/?id=test-information
    partner_code: process.env.MOMO_PARTNER_CODE || "MOMO57RV3FF1MU22",
    access_key: process.env.MOMO_ACCESS_KEY || "F8BBA842ECF85",
    secret_key: process.env.MOMO_SECRET_KEY || "K951B6PE1waDMi640xX08PD3vg6EkVlz",
    endpoint: process.env.MOMO_ENDPOINT || "https://test-payment.momo.vn/v2/gateway/api/create",
    redirect_url: process.env.MOMO_REDIRECT_URL || "http://localhost:3000/payment/result",
    ipn_url: process.env.MOMO_IPN_URL || "https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b",
}

export interface MoMoCreateParams {
    amount: number          // VND amount
    orderInfo: string       // Description shown to user
    orderId: string         // Unique order ID
    requestId?: string      // Unique request ID (auto-generated if omitted)
    extraData?: string      // Base64-encoded extra data
}

export interface MoMoCreateResponse {
    partnerCode: string
    orderId: string
    requestId: string
    amount: number
    responseTime: number
    message: string
    resultCode: number
    payUrl: string         // Redirect user here
    deeplink?: string      // Mobile deeplink
    qrCodeUrl?: string     // QR code image URL
    applink?: string
}

export interface MoMoIPNPayload {
    partnerCode: string
    orderId: string
    requestId: string
    amount: number
    orderInfo: string
    orderType: string
    transId: number
    resultCode: number
    message: string
    payType: string
    responseTime: number
    extraData: string
    signature: string
}

/**
 * Generate HMAC-SHA256 signature for MoMo
 */
function createSignature(rawData: string): string {
    return crypto.createHmac("sha256", MOMO_CONFIG.secret_key)
        .update(rawData)
        .digest("hex")
}

/**
 * Create MoMo payment request
 * Returns redirect URL (payUrl) to send user to MoMo checkout
 */
export async function createMoMoPayment(params: MoMoCreateParams): Promise<{ success: boolean; payUrl?: string; qrCodeUrl?: string; message: string }> {
    const requestId = params.requestId || `${params.orderId}-${Date.now()}`
    const extraData = params.extraData || ""
    const autoCapture = true
    const lang = "vi"

    const rawSignature = [
        `accessKey=${MOMO_CONFIG.access_key}`,
        `amount=${params.amount}`,
        `extraData=${extraData}`,
        `ipnUrl=${MOMO_CONFIG.ipn_url}`,
        `orderId=${params.orderId}`,
        `orderInfo=${params.orderInfo}`,
        `partnerCode=${MOMO_CONFIG.partner_code}`,
        `redirectUrl=${MOMO_CONFIG.redirect_url}`,
        `requestId=${requestId}`,
        `requestType=captureWallet`,
    ].join("&")

    const signature = createSignature(rawSignature)

    const requestBody = {
        partnerCode: MOMO_CONFIG.partner_code,
        partnerName: "EduConnect",
        storeId: "EduConnectStore",
        requestId,
        amount: params.amount,
        orderId: params.orderId,
        orderInfo: params.orderInfo,
        redirectUrl: MOMO_CONFIG.redirect_url,
        ipnUrl: MOMO_CONFIG.ipn_url,
        lang,
        requestType: "captureWallet",
        autoCapture,
        extraData,
        signature,
    }

    try {
        const response = await fetch(MOMO_CONFIG.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            return { success: false, message: `MoMo API error: HTTP ${response.status}` }
        }

        const data: MoMoCreateResponse = await response.json()

        if (data.resultCode === 0) {
            return {
                success: true,
                payUrl: data.payUrl,
                qrCodeUrl: data.qrCodeUrl,
                message: data.message,
            }
        }

        return {
            success: false,
            message: getMoMoResultMessage(data.resultCode),
        }
    } catch (error) {
        return {
            success: false,
            message: `Không thể kết nối MoMo: ${String(error)}`,
        }
    }
}

/**
 * Verify MoMo IPN signature
 */
export function verifyMoMoSignature(payload: MoMoIPNPayload): boolean {
    const rawSignature = [
        `accessKey=${MOMO_CONFIG.access_key}`,
        `amount=${payload.amount}`,
        `extraData=${payload.extraData}`,
        `message=${payload.message}`,
        `orderId=${payload.orderId}`,
        `orderInfo=${payload.orderInfo}`,
        `orderType=${payload.orderType}`,
        `partnerCode=${payload.partnerCode}`,
        `payType=${payload.payType}`,
        `requestId=${payload.requestId}`,
        `responseTime=${payload.responseTime}`,
        `resultCode=${payload.resultCode}`,
        `transId=${payload.transId}`,
    ].join("&")

    const expected = createSignature(rawSignature)
    return expected === payload.signature
}

/**
 * Parse MoMo result code to Vietnamese message
 */
export function getMoMoResultMessage(code: number): string {
    const messages: Record<number, string> = {
        0: "Thành công",
        1000: "Giao dịch đang chờ xử lý",
        1001: "Giao dịch thất bại do số dư không đủ",
        1002: "Giao dịch bị từ chối do nhà phát hành thẻ",
        1003: "Giao dịch bị từ chối do quá hạn mức",
        1004: "Giao dịch vượt quá hạn mức thanh toán",
        1005: "Link thanh toán đã hết hạn hoặc đã được thanh toán",
        1006: "Người dùng hủy giao dịch",
        1007: "Tài khoản MoMo chưa được kích hoạt",
        1017: "Giao dịch đã bị hủy",
        1026: "Giao dịch bị hạn chế",
        1080: "Giao dịch thất bại, lỗi hoàn tiền",
        1081: "Hoàn tiền thất bại",
        2001: "Sai thông tin liên kết",
        2007: "Tài khoản bị khóa",
        9000: "Giao dịch đã được xác nhận thành công",
        8000: "Giao dịch đang chờ xác nhận",
        7000: "Giao dịch đang được xử lý",
        7002: "Giao dịch đang được xử lý bởi nhà cung cấp dịch vụ",
    }
    return messages[code] || `Lỗi không xác định (mã: ${code})`
}
