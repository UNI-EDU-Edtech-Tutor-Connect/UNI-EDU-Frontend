// ============================================
// TESTS API SERVICE
// ============================================
// Mock API service for test management
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type {
    ApiResponse,
    StartTestRequest,
    SubmitTestRequest,
    CreateTestRequest,
    PaginatedResponse,
    AvailableTest,
    CompletedTest
} from './types'
import type { Test, TestAttempt, TestType } from '@/types'
import { mockTests } from '../mock-data'

// Local mock data storage for mutations
let testsData = [...mockTests]
let attemptsData: TestAttempt[] = []

// Mock data specific for Tutor Tests Dashboard
const mockAvailableTests: AvailableTest[] = [
    {
        id: "t1",
        classId: "class-1",
        className: "Toán Cao Cấp - Lớp 12",
        subject: "Toán",
        duration: 30,
        questions: 10,
        passingScore: 70,
        deadline: "2025-12-20",
        reward: 500000,
    },
    {
        id: "t2",
        classId: "class-2",
        className: "Vật Lý 11 - Cơ học",
        subject: "Vật lý",
        duration: 45,
        questions: 15,
        passingScore: 70,
        deadline: "2025-12-22",
        reward: 600000,
    },
    {
        id: "t3",
        classId: "class-3",
        className: "Hóa Học 12 - Hữu cơ",
        subject: "Hóa học",
        duration: 40,
        questions: 12,
        passingScore: 75,
        deadline: "2025-12-25",
        reward: 550000,
    },
]

const mockCompletedTests: CompletedTest[] = [
    {
        id: "ct1",
        className: "Tiếng Anh IELTS - Speaking",
        subject: "Tiếng Anh",
        score: 85,
        passingScore: 70,
        passed: true,
        completedAt: "2025-12-10",
        duration: 25,
    },
    {
        id: "ct2",
        className: "Toán 10 - Đại số",
        subject: "Toán",
        score: 90,
        passingScore: 70,
        passed: true,
        completedAt: "2025-12-08",
        duration: 28,
    },
    {
        id: "ct3",
        className: "Lý 12 - Điện từ",
        subject: "Vật lý",
        score: 65,
        passingScore: 70,
        passed: false,
        completedAt: "2025-12-05",
        duration: 42,
    },
]

class TestsApiService {
    /**
     * Get all tests
     * GET /api/tests
     */
    async getAllTests(filters?: {
        type?: TestType
        subjectId?: string
        grade?: number
    }): Promise<ApiResponse<Test[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let tests = [...testsData]

        if (filters?.type) {
            tests = tests.filter(t => t.type === filters.type)
        }

        if (filters?.subjectId) {
            tests = tests.filter(t => t.subjectId === filters.subjectId)
        }

        if (filters?.grade) {
            tests = tests.filter(t => t.grade === filters.grade)
        }

        return {
            success: true,
            data: tests,
            message: 'Lấy danh sách bài test thành công',
        }
    }

    /**
     * Get tests with pagination
     * GET /api/tests
     */
    async getTests(): Promise<ApiResponse<PaginatedResponse<Test>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: {
                items: testsData,
                total: testsData.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get test by ID
     * GET /api/tests/:id
     */
    async getTestById(testId: string): Promise<ApiResponse<Test | null>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const test = testsData.find(t => t.id === testId)

        if (test) {
            return {
                success: true,
                data: test,
            }
        }

        return {
            success: false,
            data: null,
            error: {
                code: 'TEST_NOT_FOUND',
                message: 'Không tìm thấy bài test',
            },
        }
    }

    /**
     * Start a test attempt
     * POST /api/tests/:id/start
     */
    async startTest(data: StartTestRequest): Promise<ApiResponse<{
        test: Test
        attempt: TestAttempt
    } | null>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const test = testsData.find(t => t.id === data.testId)

        if (!test) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'TEST_NOT_FOUND',
                    message: 'Không tìm thấy bài test',
                },
            }
        }

        const attempt: TestAttempt = {
            id: `attempt-${Date.now()}`,
            testId: test.id,
            userId: data.userId,
            startedAt: new Date().toISOString(),
            answers: {},
        }

        attemptsData.push(attempt)

        return {
            success: true,
            data: { test, attempt },
            message: 'Bắt đầu làm bài thành công',
        }
    }

    /**
     * Submit test answers
     * POST /api/tests/attempts/:id/submit
     */
    async submitTest(data: SubmitTestRequest): Promise<ApiResponse<TestAttempt>> {
        await delay(API_CONFIG.MOCK_DELAY * 1.5)

        const attemptIndex = attemptsData.findIndex(a => a.id === data.attemptId)

        // Simulate AI grading
        const score = Math.floor(Math.random() * 40) + 60 // 60-100
        const passed = score >= 60

        const completedAttempt: TestAttempt = {
            id: data.attemptId,
            testId: attemptIndex !== -1 ? attemptsData[attemptIndex].testId : '',
            userId: attemptIndex !== -1 ? attemptsData[attemptIndex].userId : '',
            startedAt: attemptIndex !== -1 ? attemptsData[attemptIndex].startedAt : new Date().toISOString(),
            completedAt: new Date().toISOString(),
            answers: data.answers,
            score,
            passed,
            aiEvaluation: passed
                ? 'Bài làm tốt! Bạn đã nắm vững kiến thức cơ bản.'
                : 'Cần cải thiện thêm. Hãy xem lại các phần lý thuyết.',
        }

        if (attemptIndex !== -1) {
            attemptsData[attemptIndex] = completedAttempt
        } else {
            attemptsData.push(completedAttempt)
        }

        return {
            success: true,
            data: completedAttempt,
            message: 'Nộp bài thành công',
        }
    }

    /**
     * Create new test
     * POST /api/tests
     */
    async createTest(data: CreateTestRequest): Promise<ApiResponse<Test>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const newTest: Test = {
            id: `test-${Date.now()}`,
            title: data.title,
            type: data.type,
            subjectId: data.subjectId,
            subjectName: data.subjectName,
            grade: data.grade,
            questions: data.questions || [],
            duration: data.duration,
            passingScore: data.passingScore,
            fee: data.fee,
            createdAt: new Date().toISOString(),
            createdBy: 'current-user-id',
            aiProctoring: data.aiProctoring || false,
        }

        testsData.push(newTest)

        return {
            success: true,
            data: newTest,
            message: 'Tạo bài test thành công',
        }
    }

    /**
     * Get user's test attempts
     * GET /api/tests/attempts?userId=:id
     */
    async getUserAttempts(userId: string): Promise<ApiResponse<TestAttempt[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const userAttempts = attemptsData.filter(a => a.userId === userId)

        return {
            success: true,
            data: userAttempts,
        }
    }

    /**
     * Get online practice tests
     * GET /api/tests?type=online_practice
     */
    async getOnlinePracticeTests(): Promise<ApiResponse<Test[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const practiceTests = testsData.filter(t => t.type === 'online_practice')

        return {
            success: true,
            data: practiceTests,
        }
    }

    /**
     * Get available tests for user
     * GET /api/tests/available?userId=:id
     */
    async getAvailableTests(userId: string): Promise<ApiResponse<AvailableTest[]>> {
        await delay(API_CONFIG.MOCK_DELAY)
        return {
            success: true,
            data: mockAvailableTests
        }
    }

    /**
     * Get completed tests for user
     * GET /api/tests/completed?userId=:id
     */
    async getCompletedTests(userId: string): Promise<ApiResponse<CompletedTest[]>> {
        await delay(API_CONFIG.MOCK_DELAY)
        return {
            success: true,
            data: mockCompletedTests
        }
    }

    /**
     * Delete test
     * DELETE /api/tests/:id
     */
    async deleteTest(testId: string): Promise<ApiResponse<null>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const testIndex = testsData.findIndex(t => t.id === testId)

        if (testIndex === -1) {
            return {
                success: false,
                data: null,
                error: {
                    code: 'TEST_NOT_FOUND',
                    message: 'Không tìm thấy bài test',
                },
            }
        }

        testsData.splice(testIndex, 1)

        return {
            success: true,
            data: null,
            message: 'Xóa bài test thành công',
        }
    }

    /**
     * Reset mock data (for testing)
     */
    resetMockData(): void {
        testsData = [...mockTests]
        attemptsData = []
    }
}

export const testsApi = new TestsApiService()
