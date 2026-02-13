// ============================================
// CLASSES API SERVICE
// ============================================
// Mock API service for class management
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type {
    ApiResponse,
    CreateClassRequest,
    RegisterForClassRequest,
    UpdateAttendanceRequest,
    ClassFilters,
    PaginatedResponse
} from './types'
import type { ClassRequest, ClassSession, LearningFormat, Schedule } from '@/types'
import { mockClassRequests, mockClassSessions, mockSubjects, mockTutors } from '../mock-data'

// Local mock data storage for mutations
let classesData = [...mockClassRequests]
let sessionsData = [...mockClassSessions]

class ClassesApiService {
    /**
     * Get all classes with sessions
     * GET /api/classes
     */
    async getAllClasses(filters?: ClassFilters): Promise<ApiResponse<{
        classes: ClassRequest[]
        sessions: ClassSession[]
    }>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let classes = [...classesData]
        let sessions = [...sessionsData]

        // Apply filters
        if (filters?.status) {
            classes = classes.filter(c => c.status === filters.status)
        }

        if (filters?.subjectId) {
            classes = classes.filter(c => c.subjectId === filters.subjectId)
        }

        if (filters?.tutorId) {
            classes = classes.filter(c => c.assignedTutorId === filters.tutorId)
            sessions = sessions.filter(s => s.tutorId === filters.tutorId)
        }

        if (filters?.studentId) {
            classes = classes.filter(c => c.studentId === filters.studentId)
            sessions = sessions.filter(s => s.studentId === filters.studentId)
        }

        return {
            success: true,
            data: { classes, sessions },
            message: 'Lấy danh sách lớp học thành công',
        }
    }

    /**
     * Get classes list with pagination
     * GET /api/classes
     */
    async getClasses(filters?: ClassFilters): Promise<ApiResponse<PaginatedResponse<ClassRequest>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let classes = [...classesData]

        if (filters?.status) {
            classes = classes.filter(c => c.status === filters.status)
        }

        return {
            success: true,
            data: {
                items: classes,
                total: classes.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get class by ID
     * GET /api/classes/:id
     */
    async getClassById(classId: string): Promise<ApiResponse<ClassRequest | null>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const classItem = classesData.find(c => c.id === classId)

        if (classItem) {
            return {
                success: true,
                data: classItem,
            }
        }

        return {
            success: false,
            data: null,
            error: {
                code: 'CLASS_NOT_FOUND',
                message: 'Không tìm thấy lớp học',
            },
        }
    }

    /**
     * Create new class request
     * POST /api/classes
     */
    async createClass(data: CreateClassRequest): Promise<ApiResponse<ClassRequest>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const subject = mockSubjects.find(s => s.id === data.subjectId)

        const newClass: ClassRequest = {
            id: `class-${Date.now()}`,
            studentId: data.studentId,
            studentName: 'Học sinh', // Would come from student data
            subjectId: data.subjectId,
            subjectName: subject?.name || 'Môn học',
            grade: data.grade,
            learningFormat: data.learningFormat,
            preferredSchedule: data.preferredSchedule,
            location: data.location,
            monthlyBudget: data.monthlyBudget,
            requirements: data.requirements,
            status: 'open',
            createdAt: new Date().toISOString(),
        }

        classesData.push(newClass)

        return {
            success: true,
            data: newClass,
            message: 'Tạo yêu cầu lớp học thành công',
        }
    }

    /**
     * Register tutor for class
     * POST /api/classes/:id/register
     */
    async registerForClass(data: RegisterForClassRequest): Promise<ApiResponse<{
        classId: string
        tutorId: string
        tutorName: string
    }>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const classIndex = classesData.findIndex(c => c.id === data.classId)

        if (classIndex === -1) {
            return {
                success: false,
                data: null as any,
                error: {
                    code: 'CLASS_NOT_FOUND',
                    message: 'Không tìm thấy lớp học',
                },
            }
        }

        if (classesData[classIndex].status !== 'open') {
            return {
                success: false,
                data: null as any,
                error: {
                    code: 'CLASS_NOT_OPEN',
                    message: 'Lớp học không còn mở đăng ký',
                },
            }
        }

        // Find tutor name
        const tutor = mockTutors.find(t => t.id === data.tutorId)
        const tutorName = tutor?.fullName || 'Gia sư'

        // Update class
        classesData[classIndex] = {
            ...classesData[classIndex],
            status: 'pending_payment',
            assignedTutorId: data.tutorId,
            assignedTutorName: tutorName,
        }

        return {
            success: true,
            data: {
                classId: data.classId,
                tutorId: data.tutorId,
                tutorName,
            },
            message: 'Đăng ký nhận lớp thành công',
        }
    }

    /**
     * Get sessions list
     * GET /api/sessions
     */
    async getSessions(classId?: string): Promise<ApiResponse<ClassSession[]>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        let sessions = [...sessionsData]

        if (classId) {
            sessions = sessions.filter(s => s.classId === classId)
        }

        return {
            success: true,
            data: sessions,
        }
    }

    /**
     * Update session attendance
     * PUT /api/sessions/:id/attendance
     */
    async updateAttendance(data: UpdateAttendanceRequest): Promise<ApiResponse<ClassSession>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const sessionIndex = sessionsData.findIndex(s => s.id === data.sessionId)

        if (sessionIndex !== -1) {
            const updatedSession: ClassSession = {
                ...sessionsData[sessionIndex],
                status: data.status === 'attended' ? 'completed' : 'absent_student',
                notes: data.notes,
            }

            sessionsData[sessionIndex] = updatedSession

            return {
                success: true,
                data: updatedSession,
                message: 'Cập nhật điểm danh thành công',
            }
        }

        // Create mock session if not found
        const newSession: ClassSession = {
            id: data.sessionId,
            classId: 'mock-class',
            tutorId: 'mock-tutor',
            studentId: 'mock-student',
            scheduledAt: new Date().toISOString(),
            duration: 90,
            status: data.status === 'attended' ? 'completed' : 'absent_student',
            notes: data.notes,
        }

        sessionsData.push(newSession)

        return {
            success: true,
            data: newSession,
            message: 'Cập nhật điểm danh thành công',
        }
    }

    /**
     * Get open classes (for tutor to register)
     * GET /api/classes?status=open
     */
    async getOpenClasses(): Promise<ApiResponse<ClassRequest[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const openClasses = classesData.filter(c => c.status === 'open')

        return {
            success: true,
            data: openClasses,
        }
    }

    /**
     * Get classes by tutor
     * GET /api/classes?tutorId=:id
     */
    async getClassesByTutor(tutorId: string): Promise<ApiResponse<ClassRequest[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const tutorClasses = classesData.filter(c => c.assignedTutorId === tutorId)

        return {
            success: true,
            data: tutorClasses,
        }
    }

    /**
     * Get classes by student
     * GET /api/classes?studentId=:id
     */
    async getClassesByStudent(studentId: string): Promise<ApiResponse<ClassRequest[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const studentClasses = classesData.filter(c => c.studentId === studentId)

        return {
            success: true,
            data: studentClasses,
        }
    }

    /**
     * Reset mock data (for testing)
     */
    resetMockData(): void {
        classesData = [...mockClassRequests]
        sessionsData = [...mockClassSessions]
    }
}

export const classesApi = new ClassesApiService()
