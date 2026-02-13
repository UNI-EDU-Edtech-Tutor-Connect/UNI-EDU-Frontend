// ============================================
// AUDIT LOG API SERVICE
// ============================================
// Mock API service for audit logs
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse, PaginatedResponse, PaginationParams } from './types'
import type { AuditLog } from '@/types'

const mockAuditLogs: AuditLog[] = [
    {
        id: "LOG001",
        timestamp: "2024-01-15 14:30:25",
        user: { name: "Nguyễn Kế Toán", email: "ketoan@example.com", avatar: "" },
        action: "CREATE",
        module: "Giao dịch",
        description: "Tạo giao dịch mới TXN001",
        ipAddress: "192.168.1.100",
        details: { transactionId: "TXN001", amount: 2500000, type: "income" },
        severity: "info",
    },
    {
        id: "LOG002",
        timestamp: "2024-01-15 14:25:10",
        user: { name: "Admin", email: "admin@example.com", avatar: "" },
        action: "UPDATE",
        module: "Cài đặt",
        description: "Cập nhật cấu hình thanh toán",
        ipAddress: "192.168.1.1",
        details: { setting: "payment_gateway", oldValue: "vnpay", newValue: "momo" },
        severity: "warning",
    },
    {
        id: "LOG003",
        timestamp: "2024-01-15 14:20:00",
        user: { name: "Trần Văn B", email: "tranvanb@example.com", avatar: "" },
        action: "DELETE",
        module: "Giao dịch",
        description: "Xóa giao dịch TXN-DRAFT-001",
        ipAddress: "192.168.1.105",
        details: { transactionId: "TXN-DRAFT-001", reason: "Duplicate entry" },
        severity: "error",
    },
    {
        id: "LOG004",
        timestamp: "2024-01-15 14:15:30",
        user: { name: "Hệ thống", email: "system@example.com", avatar: "" },
        action: "PROCESS",
        module: "Thanh toán",
        description: "Xử lý thanh toán tự động học phí",
        ipAddress: "127.0.0.1",
        details: { batchId: "BATCH001", totalTransactions: 45, successCount: 43, failedCount: 2 },
        severity: "info",
    },
    {
        id: "LOG005",
        timestamp: "2024-01-15 14:10:15",
        user: { name: "Nguyễn Kế Toán", email: "ketoan@example.com", avatar: "" },
        action: "EXPORT",
        module: "Báo cáo",
        description: "Xuất báo cáo doanh thu tháng 1/2024",
        ipAddress: "192.168.1.100",
        details: { reportType: "monthly_revenue", period: "2024-01", format: "xlsx" },
        severity: "info",
    },
    {
        id: "LOG006",
        timestamp: "2024-01-15 14:05:00",
        user: { name: "Admin", email: "admin@example.com", avatar: "" },
        action: "APPROVE",
        module: "Giao dịch",
        description: "Phê duyệt chi lương gia sư tháng 1",
        ipAddress: "192.168.1.1",
        details: { batchId: "SALARY-2024-01", totalAmount: 85000000, tutorCount: 25 },
        severity: "success",
    },
    {
        id: "LOG007",
        timestamp: "2024-01-15 13:55:20",
        user: { name: "Lê Thị C", email: "lethic@example.com", avatar: "" },
        action: "VIEW",
        module: "Báo cáo",
        description: "Xem báo cáo chi phí quý 4/2023",
        ipAddress: "192.168.1.110",
        details: { reportType: "quarterly_expense", period: "2023-Q4" },
        severity: "info",
    },
    {
        id: "LOG008",
        timestamp: "2024-01-15 13:50:10",
        user: { name: "Hệ thống", email: "system@example.com", avatar: "" },
        action: "ALERT",
        module: "Bảo mật",
        description: "Phát hiện đăng nhập bất thường",
        ipAddress: "103.45.67.89",
        details: { attemptCount: 5, blockedUntil: "2024-01-15 14:50:10" },
        severity: "error",
    },
    {
        id: "LOG009",
        timestamp: "2024-01-15 13:45:00",
        user: { name: "Phạm Văn D", email: "phamvand@example.com", avatar: "" },
        action: "CREATE",
        module: "Hoàn tiền",
        description: "Tạo yêu cầu hoàn tiền REF001",
        ipAddress: "192.168.1.115",
        details: { refundId: "REF001", originalTransaction: "TXN-2024-001", amount: 1500000 },
        severity: "warning",
    },
    {
        id: "LOG010",
        timestamp: "2024-01-15 13:40:30",
        user: { name: "Nguyễn Kế Toán", email: "ketoan@example.com", avatar: "" },
        action: "UPDATE",
        module: "Giao dịch",
        description: "Cập nhật trạng thái giao dịch TXN002",
        ipAddress: "192.168.1.100",
        details: { transactionId: "TXN002", oldStatus: "pending", newStatus: "completed" },
        severity: "success",
    },
]

class AuditLogApiService {
    /**
     * Get all audit logs
     * GET /api/audit-logs
     */
    async getAuditLogs(params?: PaginationParams & { search?: string; action?: string; module?: string; severity?: string }): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let logs = [...mockAuditLogs]

        if (params?.search) {
            const search = params.search.toLowerCase()
            logs = logs.filter(l =>
                l.description.toLowerCase().includes(search) ||
                l.user.name.toLowerCase().includes(search) ||
                l.id.toLowerCase().includes(search)
            )
        }

        if (params?.action && params.action !== 'all') {
            logs = logs.filter(l => l.action === params.action)
        }

        if (params?.module && params.module !== 'all') {
            logs = logs.filter(l => l.module === params.module)
        }

        if (params?.severity && params.severity !== 'all') {
            logs = logs.filter(l => l.severity === params.severity)
        }

        return {
            success: true,
            data: {
                items: logs,
                total: logs.length,
                page: 1,
                pageSize: 20,
                totalPages: 1
            }
        }
    }
}

export const auditLogApi = new AuditLogApiService()
