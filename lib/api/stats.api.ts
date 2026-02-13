// ============================================
// STATISTICS API SERVICE
// ============================================
// Mock API service for dashboard statistics
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse, ChildReport } from './types'
import type {
    AdminStats,
    TutorStats,
    StudentStats,
    OfficeStats,
    AccountantStats
} from '@/types'
import {
    mockAdminStats,
    mockTutorStats,
    mockStudentStats,
    mockOfficeStats,
    mockAccountantStats
} from '../mock-data'

const mockReportData: Record<string, ChildReport> = {
    c1: {
        attendance: [
            { month: "T9", value: 100 },
            { month: "T10", value: 95 },
            { month: "T11", value: 92 },
            { month: "T12", value: 97 },
        ],
        scores: [
            { month: "T9", value: 75 },
            { month: "T10", value: 78 },
            { month: "T11", value: 82 },
            { month: "T12", value: 85 },
        ],
        subjects: [
            { name: "Toán", avgScore: 85, attendance: 95, progress: 67 },
            { name: "Tiếng Anh", avgScore: 83, attendance: 100, progress: 40 },
        ],
        summary: {
            totalSessions: 48,
            attended: 45,
            avgScore: 84,
            improvement: 10,
        },
    },
    c2: {
        attendance: [
            { month: "T9", value: 95 },
            { month: "T10", value: 90 },
            { month: "T11", value: 88 },
            { month: "T12", value: 92 },
        ],
        scores: [
            { month: "T9", value: 70 },
            { month: "T10", value: 72 },
            { month: "T11", value: 75 },
            { month: "T12", value: 78 },
        ],
        subjects: [{ name: "Toán", avgScore: 78, attendance: 92, progress: 60 }],
        summary: {
            totalSessions: 24,
            attended: 22,
            avgScore: 78,
            improvement: 8,
        },
    },
}

class StatsApiService {
    /**
     * Get admin dashboard stats
     * GET /api/stats/admin
     */
    async getAdminStats(): Promise<ApiResponse<AdminStats>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockAdminStats,
        }
    }

    /**
     * Get tutor dashboard stats
     * GET /api/stats/tutor
     */
    async getTutorStats(tutorId: string): Promise<ApiResponse<TutorStats>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockTutorStats,
        }
    }

    /**
     * Get student dashboard stats
     * GET /api/stats/student
     */
    async getStudentStats(studentId: string): Promise<ApiResponse<StudentStats>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockStudentStats,
        }
    }

    /**
     * Get office staff dashboard stats
     * GET /api/stats/office
     */
    async getOfficeStats(): Promise<ApiResponse<OfficeStats>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockOfficeStats,
        }
    }

    /**
     * Get accountant dashboard stats
     * GET /api/stats/accountant
     */
    async getAccountantStats(): Promise<ApiResponse<AccountantStats>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockAccountantStats,
        }
    }

    /**
     * Get child report
     * GET /api/stats/child/:id
     */
    async getChildReport(childId: string, period: string = 'month'): Promise<ApiResponse<ChildReport>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const report = mockReportData[childId] || mockReportData['c1'] // Fallback to c1 for demo

        return {
            success: true,
            data: report
        }
    }
}

export const statsApi = new StatsApiService()
