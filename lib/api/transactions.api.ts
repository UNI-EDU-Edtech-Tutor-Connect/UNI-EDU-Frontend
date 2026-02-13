// ============================================
// TRANSACTIONS API SERVICE
// ============================================
// Mock API service for transaction management
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type {
    ApiResponse,
    CreatePaymentRequest,
    TransactionFilters,
    PaginatedResponse
} from './types'
import type { Transaction, AccountantStats, TransactionType, TransactionStatus } from '@/types'
import { mockTransactions, mockAccountantStats } from '../mock-data'

// Local mock data storage for mutations
let transactionsData = [...mockTransactions]
let statsData = { ...mockAccountantStats }

class TransactionsApiService {
    /**
     * Get all transactions with stats
     * GET /api/transactions
     */
    async getAllTransactions(filters?: TransactionFilters): Promise<ApiResponse<{
        transactions: Transaction[]
        stats: AccountantStats
    }>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let transactions = [...transactionsData]

        // Apply filters
        if (filters?.type) {
            transactions = transactions.filter(t => t.type === filters.type)
        }

        if (filters?.status) {
            transactions = transactions.filter(t => t.status === filters.status)
        }

        if (filters?.userId) {
            transactions = transactions.filter(t => t.userId === filters.userId)
        }

        if (filters?.dateFrom) {
            const fromDate = new Date(filters.dateFrom)
            transactions = transactions.filter(t => new Date(t.createdAt) >= fromDate)
        }

        if (filters?.dateTo) {
            const toDate = new Date(filters.dateTo)
            transactions = transactions.filter(t => new Date(t.createdAt) <= toDate)
        }

        return {
            success: true,
            data: { transactions, stats: statsData },
            message: 'Lấy danh sách giao dịch thành công',
        }
    }

    /**
     * Get transactions with pagination
     * GET /api/transactions
     */
    async getTransactions(filters?: TransactionFilters): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let transactions = [...transactionsData]

        if (filters?.type) {
            transactions = transactions.filter(t => t.type === filters.type)
        }

        if (filters?.status) {
            transactions = transactions.filter(t => t.status === filters.status)
        }

        return {
            success: true,
            data: {
                items: transactions,
                total: transactions.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get transaction by ID
     * GET /api/transactions/:id
     */
    async getTransactionById(transactionId: string): Promise<ApiResponse<Transaction | null>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const transaction = transactionsData.find(t => t.id === transactionId)

        if (transaction) {
            return {
                success: true,
                data: transaction,
            }
        }

        return {
            success: false,
            data: null,
            error: {
                code: 'TRANSACTION_NOT_FOUND',
                message: 'Không tìm thấy giao dịch',
            },
        }
    }

    /**
     * Create new payment/transaction
     * POST /api/transactions
     */
    async createPayment(data: CreatePaymentRequest): Promise<ApiResponse<Transaction>> {
        await delay(API_CONFIG.MOCK_DELAY * 1.5)

        const newTransaction: Transaction = {
            id: `txn-${Date.now()}`,
            type: data.type,
            amount: data.amount,
            currency: 'VND',
            userId: data.userId,
            userName: data.userName,
            classId: data.classId,
            testId: data.testId,
            status: 'completed',
            paymentMethod: data.paymentMethod,
            description: data.description,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        }

        transactionsData.unshift(newTransaction)

        // Update stats
        statsData = {
            ...statsData,
            totalRevenue: statsData.totalRevenue + data.amount,
            monthlyTransactions: statsData.monthlyTransactions + 1,
        }

        return {
            success: true,
            data: newTransaction,
            message: 'Tạo giao dịch thành công',
        }
    }

    /**
     * Get accountant statistics
     * GET /api/transactions/stats
     */
    async getStats(): Promise<ApiResponse<AccountantStats>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        return {
            success: true,
            data: statsData,
        }
    }

    /**
     * Get user's transactions
     * GET /api/transactions?userId=:id
     */
    async getUserTransactions(userId: string): Promise<ApiResponse<Transaction[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const userTransactions = transactionsData.filter(t => t.userId === userId)

        return {
            success: true,
            data: userTransactions,
        }
    }

    /**
     * Get pending transactions
     * GET /api/transactions?status=pending
     */
    async getPendingTransactions(): Promise<ApiResponse<Transaction[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const pendingTransactions = transactionsData.filter(t => t.status === 'pending')

        return {
            success: true,
            data: pendingTransactions,
        }
    }

    /**
     * Process pending payout
     * PUT /api/transactions/:id/process
     */
    async processPayout(transactionId: string): Promise<ApiResponse<Transaction>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const transactionIndex = transactionsData.findIndex(t => t.id === transactionId)

        if (transactionIndex === -1) {
            return {
                success: false,
                data: null as any,
                error: {
                    code: 'TRANSACTION_NOT_FOUND',
                    message: 'Không tìm thấy giao dịch',
                },
            }
        }

        transactionsData[transactionIndex] = {
            ...transactionsData[transactionIndex],
            status: 'completed',
            completedAt: new Date().toISOString(),
        }

        return {
            success: true,
            data: transactionsData[transactionIndex],
            message: 'Xử lý thanh toán thành công',
        }
    }

    /**
     * Refund transaction
     * POST /api/transactions/:id/refund
     */
    async refundTransaction(transactionId: string, reason?: string): Promise<ApiResponse<Transaction>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const originalTransaction = transactionsData.find(t => t.id === transactionId)

        if (!originalTransaction) {
            return {
                success: false,
                data: null as any,
                error: {
                    code: 'TRANSACTION_NOT_FOUND',
                    message: 'Không tìm thấy giao dịch',
                },
            }
        }

        const refundTransaction: Transaction = {
            id: `txn-refund-${Date.now()}`,
            type: 'refund',
            amount: -originalTransaction.amount,
            currency: 'VND',
            userId: originalTransaction.userId,
            userName: originalTransaction.userName,
            classId: originalTransaction.classId,
            status: 'completed',
            description: `Hoàn tiền: ${reason || 'Theo yêu cầu'}`,
            createdAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
        }

        transactionsData.unshift(refundTransaction)

        return {
            success: true,
            data: refundTransaction,
            message: 'Hoàn tiền thành công',
        }
    }

    /**
     * Reset mock data (for testing)
     */
    resetMockData(): void {
        transactionsData = [...mockTransactions]
        statsData = { ...mockAccountantStats }
    }
}

export const transactionsApi = new TransactionsApiService()
