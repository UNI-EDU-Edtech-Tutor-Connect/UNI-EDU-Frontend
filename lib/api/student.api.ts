// ============================================
// STUDENT API SERVICE
// ============================================
// Service for student dashboard and related features
// Aggregates data from other services or provides specific student views

import { API_CONFIG, delay } from './config'
import type { ApiResponse } from './types'
import type { ScheduleItem, TestWithStats, Question } from '@/types'
import { mockScheduleItems, mockPracticeTestsWithStats, mockTestQuestions } from '../mock-data'


class StudentApiService {
    /**
     * Get student's upcoming schedule
     * GET /api/student/schedule
     */
    async getSchedule(startDate?: string, endDate?: string): Promise<ApiResponse<ScheduleItem[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        // In real API, filter by date range
        return {
            success: true,
            data: mockScheduleItems
        }
    }

    /**
     * Get practice tests with statistics
     * GET /api/student/practice-tests
     */
    async getPracticeTests(): Promise<ApiResponse<TestWithStats[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: mockPracticeTestsWithStats
        }
    }

    /**
     * Get questions for a test attempt
     * GET /api/student/tests/:id/questions
     */
    async getTestQuestions(testId: string): Promise<ApiResponse<Question[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        // Logic to get questions for specific test
        return {
            success: true,
            data: mockTestQuestions
        }
    }
}

export const studentApi = new StudentApiService()
