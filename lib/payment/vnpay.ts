// ============================================
// VNPAY PAYMENT HELPER
// ============================================
// Handles VNPay payment URL generation and IPN verification
// Docs: https://sandbox.vnpayment.vn/apis/docs/thanh-toan-pay/pay.html

import crypto from "crypto"

export const VNPAY_CONFIG = {
    tmn_code: process.env.VNPAY_TMN_CODE || "DEMO1234",
    hash_secret: process.env.VNPAY_HASH_SECRET || "DEMOSECRETKEY1234567890ABCDEFGH",
    url: process.env.VNPAY_URL || "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    return_url: process.env.VNPAY_RETURN_URL || "http://localhost:3000/api/payment/vnpay/return",
    ipn_url: process.env.VNPAY_IPN_URL || "http://localhost:3000/api/payment/vnpay/ipn",
}

export interface VNPayCreateParams {
    amount: number         // VND amount
    orderInfo: string      // Order description
    orderId: string        // Unique order/transaction ID
    ipAddr: string
    locale?: "vn" | "en"
    bankCode?: string      // Optional: pre-select bank
}

export interface VNPayReturnParams {
    vnp_Amount: string
    vnp_BankCode: string
    vnp_BankTranNo?: string
    vnp_CardType: string
    vnp_OrderInfo: string
    vnp_PayDate: string
    vnp_ResponseCode: string
    vnp_TmnCode: string
    vnp_TransactionNo: string
    vnp_TransactionStatus: string
    vnp_TxnRef: string
    vnp_SecureHash: string
    [key: string]: string | undefined
}

/**
 * Sort object keys alphabetically (required by VNPay)
 */
function sortObject(obj: Record<string, string>): Record<string, string> {
    const sorted: Record<string, string> = {}
    Object.keys(obj).sort().forEach((key) => {
        sorted[key] = obj[key]
    })
    return sorted
}

/**
 * Generate HMAC-SHA512 signature for VNPay
 */
function createHmac512(data: string, key: string): string {
    return crypto.createHmac("sha512", key).update(Buffer.from(data, "utf-8")).digest("hex")
}

/**
 * Create VNPay payment URL
 */
export function createVNPayUrl(params: VNPayCreateParams): string {
    const date = new Date()
    const createDate = formatDate(date)

    const vnpParams: Record<string, string> = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: VNPAY_CONFIG.tmn_code,
        vnp_Locale: params.locale || "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: params.orderId,
        vnp_OrderInfo: params.orderInfo,
        vnp_OrderType: "other",
        vnp_Amount: String(params.amount * 100), // VNPay amount = VND * 100
        vnp_ReturnUrl: VNPAY_CONFIG.return_url,
        vnp_IpAddr: params.ipAddr,
        vnp_CreateDate: createDate,
    }

    if (params.bankCode) {
        vnpParams.vnp_BankCode = params.bankCode
    }

    const sorted = sortObject(vnpParams)
    const signData = new URLSearchParams(sorted).toString()
    const hmac = createHmac512(signData, VNPAY_CONFIG.hash_secret)

    return `${VNPAY_CONFIG.url}?${signData}&vnp_SecureHash=${hmac}`
}

/**
 * Verify VNPay IPN / Return URL signature
 */
export function verifyVNPaySignature(params: VNPayReturnParams): boolean {
    const secureHash = params.vnp_SecureHash
    // Exclude signature fields before verifying
    const { vnp_SecureHash: _h, vnp_SecureHashType: _ht, ...rest } = params as any
    const cleanParams: Record<string, string> = {}
    Object.keys(rest).forEach((k) => {
        if (rest[k] !== undefined) cleanParams[k] = rest[k]
    })

    const sorted = sortObject(cleanParams)
    const signData = new URLSearchParams(sorted).toString()
    const hmac = createHmac512(signData, VNPAY_CONFIG.hash_secret)

    return hmac === secureHash
}

/**
 * Parse VNPay response code
 */
export function getVNPayResponseMessage(code: string): string {
    const messages: Record<string, string> = {
        "00": "Giao dịch thành công",
        "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường)",
        "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking",
        "10": "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
        "11": "Đã hết hạn chờ thanh toán",
        "12": "Thẻ/Tài khoản bị khóa",
        "13": "Nhập sai mật khẩu OTP",
        "24": "Khách hàng hủy giao dịch",
        "51": "Tài khoản không đủ số dư",
        "65": "Tài khoản vượt hạn mức giao dịch trong ngày",
        "75": "Ngân hàng thanh toán đang bảo trì",
        "79": "Nhập sai mật khẩu thanh toán quá số lần quy định",
        "99": "Lỗi không xác định",
    }
    return messages[code] || `Lỗi không xác định (${code})`
}

function formatDate(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0")
    return (
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds())
    )
}
