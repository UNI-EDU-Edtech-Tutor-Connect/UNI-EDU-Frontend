// ============================================
// USERS API SERVICE
// ============================================
// Mock API service for user management
// TODO: Replace mock implementation with real API calls when backend is ready

import { API_CONFIG, delay } from './config'
import type { ApiResponse, ApproveUserRequest, UserFilters, PaginatedResponse, TutorStudent, TutorStudentFilters, ParentChild, ParentChildDetail } from './types'
import type { TutorProfile, TeacherProfile, StudentProfile, ParentProfile } from '@/types'
import {
    mockTutors,
    mockTeachers,
    mockStudents,
    mockParents
} from '../mock-data'

// Local mock data storage for mutations
let tutorsData = [...mockTutors]
let teachersData = [...mockTeachers]
let studentsData = [...mockStudents]
let parentsData = [...mockParents]

// Mock data for tutor students (specific view for tutor dashboard)
const mockTutorStudents: TutorStudent[] = [
    {
        id: "s1",
        name: "Nguyễn Văn Minh",
        phone: "0901234567",
        email: "minh@email.com",
        grade: "Lớp 12",
        subject: "Toán Cao Cấp",
        classId: "class-1",
        startDate: "2025-09-01",
        sessionsCompleted: 24,
        totalSessions: 36,
        attendance: 95,
        averageScore: 8.5,
        status: "active",
        parentName: "Nguyễn Văn Anh",
        parentPhone: "0912345678",
        notes: "Học sinh chăm chỉ, cần tập trung hơn vào Hình học không gian",
    },
    {
        id: "s2",
        name: "Trần Thị Lan",
        phone: "0902345678",
        email: "lan@email.com",
        grade: "Lớp 11",
        subject: "Vật lý",
        classId: "class-2",
        startDate: "2025-10-15",
        sessionsCompleted: 12,
        totalSessions: 24,
        attendance: 100,
        averageScore: 9.0,
        status: "active",
        parentName: "Trần Văn Bình",
        parentPhone: "0923456789",
        notes: "Học sinh xuất sắc, tiếp thu nhanh",
    },
    {
        id: "s3",
        name: "Lê Hoàng Nam",
        phone: "0903456789",
        email: "nam@email.com",
        grade: "Lớp 10",
        subject: "Tiếng Anh",
        classId: "class-3",
        startDate: "2025-08-01",
        sessionsCompleted: 32,
        totalSessions: 32,
        attendance: 88,
        averageScore: 7.2,
        status: "completed",
        parentName: "Lê Thị Hương",
        parentPhone: "0934567890",
        notes: "Đã hoàn thành khóa học, cần ôn tập thêm Writing",
    },
]

// Mock data for children details (Full details for Overview)
const mockChildrenDetails: ParentChildDetail[] = [
    {
        id: "c1",
        name: "Nguyễn Văn Minh",
        grade: "Lớp 12",
        school: "THPT Chuyên Lê Hồng Phong",
        classes: [
            {
                id: "cl1",
                subject: "Toán Cao Cấp",
                tutor: "Thầy Nguyễn Văn A",
                schedule: "Thứ 2, 4 - 14:00",
                sessionsCompleted: 16,
                totalSessions: 24,
                attendance: 95,
                avgScore: 8.5,
            },
            {
                id: "cl2",
                subject: "Tiếng Anh IELTS",
                tutor: "Cô Trần Thị B",
                schedule: "Thứ 3, 6 - 09:00",
                sessionsCompleted: 8,
                totalSessions: 20,
                attendance: 100,
                avgScore: 7.5,
            },
        ],
        recentResults: [
            { id: "r1", test: "Toán - Đại số", score: 85, total: 100, date: "2025-12-10" },
            { id: "r2", test: "IELTS Reading", score: 7.5, total: 9, date: "2025-12-08" },
        ],
        upcomingClasses: [
            { subject: "Toán Cao Cấp", tutor: "Thầy Nguyễn Văn A", time: "14:00 - 16:00", date: "Hôm nay" },
            { subject: "Tiếng Anh IELTS", tutor: "Cô Trần Thị B", time: "09:00 - 11:00", date: "Ngày mai" },
        ],
    },
    {
        id: "c2",
        name: "Nguyễn Thị Lan",
        grade: "Lớp 9",
        school: "THCS Trần Phú",
        classes: [
            {
                id: "cl3",
                subject: "Toán 9",
                tutor: "Cô Lê Thị D",
                schedule: "Thứ 3, 5 - 19:00",
                sessionsCompleted: 12,
                totalSessions: 20,
                attendance: 92,
                avgScore: 7.8,
            },
        ],
        recentResults: [{ id: "r3", test: "Toán - Hình học", score: 78, total: 100, date: "2025-12-05" }],
        upcomingClasses: [{ subject: "Toán 9", tutor: "Cô Lê Thị D", time: "19:00 - 21:00", date: "Thứ 5" }],
    },
]

class UsersApiService {
    /**
     * Get all users grouped by type
     * GET /api/users
     */
    async getAllUsers(filters?: UserFilters): Promise<ApiResponse<{
        tutors: TutorProfile[]
        teachers: TeacherProfile[]
        students: StudentProfile[]
        parents: ParentProfile[]
    }>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let tutors = [...tutorsData]
        let teachers = [...teachersData]
        let students = [...studentsData]
        let parents = [...parentsData]

        // Apply filters
        if (filters?.approvalStatus) {
            tutors = tutors.filter(t => t.approvalStatus === filters.approvalStatus)
            teachers = teachers.filter(t => t.approvalStatus === filters.approvalStatus)
        }

        if (filters?.status) {
            tutors = tutors.filter(t => t.status === filters.status)
            teachers = teachers.filter(t => t.status === filters.status)
            students = students.filter(s => s.status === filters.status)
            parents = parents.filter(p => p.status === filters.status)
        }

        if (filters?.search) {
            const searchLower = filters.search.toLowerCase()
            tutors = tutors.filter(t =>
                t.fullName.toLowerCase().includes(searchLower) ||
                t.email.toLowerCase().includes(searchLower)
            )
            teachers = teachers.filter(t =>
                t.fullName.toLowerCase().includes(searchLower) ||
                t.email.toLowerCase().includes(searchLower)
            )
            students = students.filter(s =>
                s.fullName.toLowerCase().includes(searchLower) ||
                s.email.toLowerCase().includes(searchLower)
            )
            parents = parents.filter(p =>
                p.fullName.toLowerCase().includes(searchLower) ||
                p.email.toLowerCase().includes(searchLower)
            )
        }

        return {
            success: true,
            data: { tutors, teachers, students, parents },
            message: 'Lấy danh sách người dùng thành công',
        }
    }

    /**
     * Get tutors list
     * GET /api/users/tutors
     */
    async getTutors(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<TutorProfile>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let tutors = [...tutorsData]

        if (filters?.approvalStatus) {
            tutors = tutors.filter(t => t.approvalStatus === filters.approvalStatus)
        }

        if (filters?.search) {
            const searchLower = filters.search.toLowerCase()
            tutors = tutors.filter(t =>
                t.fullName.toLowerCase().includes(searchLower) ||
                t.email.toLowerCase().includes(searchLower) ||
                t.university?.toLowerCase().includes(searchLower)
            )
        }

        return {
            success: true,
            data: {
                items: tutors,
                total: tutors.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get teachers list
     * GET /api/users/teachers
     */
    async getTeachers(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<TeacherProfile>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let teachers = [...teachersData]

        if (filters?.approvalStatus) {
            teachers = teachers.filter(t => t.approvalStatus === filters.approvalStatus)
        }

        return {
            success: true,
            data: {
                items: teachers,
                total: teachers.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get students list
     * GET /api/users/students
     */
    async getStudents(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<StudentProfile>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: {
                items: studentsData,
                total: studentsData.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get students for a specific tutor
     * GET /api/tutors/:id/students
     */
    async getTutorStudents(tutorId: string, filters?: TutorStudentFilters): Promise<ApiResponse<TutorStudent[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        let students = [...mockTutorStudents]

        if (filters?.search) {
            const searchLower = filters.search.toLowerCase()
            students = students.filter(s =>
                s.name.toLowerCase().includes(searchLower) ||
                s.subject.toLowerCase().includes(searchLower)
            )
        }

        return {
            success: true,
            data: students
        }
    }

    /**
     * Get children for a parent
     * GET /api/parents/:id/children
     */
    async getParentChildren(parentId: string): Promise<ApiResponse<ParentChildDetail[]>> { // Return full details
        await delay(API_CONFIG.MOCK_DELAY)
        return {
            success: true,
            data: mockChildrenDetails
        }
    }

    /**
     * Get child details
     * GET /api/parents/children/:id
     */
    async getChildDetails(childId: string): Promise<ApiResponse<ParentChildDetail>> {
        await delay(API_CONFIG.MOCK_DELAY)
        const child = mockChildrenDetails.find(c => c.id === childId) || mockChildrenDetails[0]
        return {
            success: true,
            data: child
        }
    }

    /**
     * Get parents list
     * GET /api/users/parents
     */
    async getParents(filters?: UserFilters): Promise<ApiResponse<PaginatedResponse<ParentProfile>>> {
        await delay(API_CONFIG.MOCK_DELAY)

        return {
            success: true,
            data: {
                items: parentsData,
                total: parentsData.length,
                page: 1,
                pageSize: 20,
                totalPages: 1,
            },
        }
    }

    /**
     * Get pending approvals
     * GET /api/users?approvalStatus=pending
     */
    async getPendingApprovals(): Promise<ApiResponse<(TutorProfile | TeacherProfile)[]>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const pendingTutors = tutorsData.filter(t => t.approvalStatus === 'pending')
        const pendingTeachers = teachersData.filter(t => t.approvalStatus === 'pending')

        return {
            success: true,
            data: [...pendingTutors, ...pendingTeachers],
        }
    }

    /**
     * Approve or reject a user
     * PUT /api/users/:id/approve
     */
    async approveUser(request: ApproveUserRequest): Promise<ApiResponse<{ userId: string; approved: boolean }>> {
        await delay(API_CONFIG.MOCK_DELAY)

        const { userId, approved, reason } = request

        // Update tutor
        const tutorIndex = tutorsData.findIndex(t => t.id === userId)
        if (tutorIndex !== -1) {
            tutorsData[tutorIndex] = {
                ...tutorsData[tutorIndex],
                approvalStatus: approved ? 'approved' : 'rejected',
                verificationStatus: approved ? 'verified' : 'failed',
                updatedAt: new Date().toISOString(),
            }

            return {
                success: true,
                data: { userId, approved },
                message: approved ? 'Đã phê duyệt gia sư' : 'Đã từ chối gia sư',
            }
        }

        // Update teacher
        const teacherIndex = teachersData.findIndex(t => t.id === userId)
        if (teacherIndex !== -1) {
            teachersData[teacherIndex] = {
                ...teachersData[teacherIndex],
                approvalStatus: approved ? 'approved' : 'rejected',
                verificationStatus: approved ? 'verified' : 'failed',
                updatedAt: new Date().toISOString(),
            }

            return {
                success: true,
                data: { userId, approved },
                message: approved ? 'Đã phê duyệt giáo viên' : 'Đã từ chối giáo viên',
            }
        }

        return {
            success: false,
            data: null as any,
            error: {
                code: 'USER_NOT_FOUND',
                message: 'Không tìm thấy người dùng',
            },
        }
    }

    /**
     * Get user by ID
     * GET /api/users/:id
     */
    async getUserById(userId: string): Promise<ApiResponse<TutorProfile | TeacherProfile | StudentProfile | ParentProfile | null>> {
        await delay(API_CONFIG.MOCK_DELAY / 2)

        const tutor = tutorsData.find(t => t.id === userId)
        if (tutor) return { success: true, data: tutor }

        const teacher = teachersData.find(t => t.id === userId)
        if (teacher) return { success: true, data: teacher }

        const student = studentsData.find(s => s.id === userId)
        if (student) return { success: true, data: student }

        const parent = parentsData.find(p => p.id === userId)
        if (parent) return { success: true, data: parent }

        return {
            success: false,
            data: null,
            error: {
                code: 'USER_NOT_FOUND',
                message: 'Không tìm thấy người dùng',
            },
        }
    }

    /**
     * Reset mock data (for testing)
     */
    resetMockData(): void {
        tutorsData = [...mockTutors]
        teachersData = [...mockTeachers]
        studentsData = [...mockStudents]
        parentsData = [...mockParents]
    }
}

export const usersApi = new UsersApiService()
