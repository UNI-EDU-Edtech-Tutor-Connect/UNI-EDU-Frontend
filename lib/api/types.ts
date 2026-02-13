// ============================================
// API RESPONSE TYPES
// ============================================
// Standard API response format

export interface ApiResponse<T> {
    success: boolean
    data: T
    message?: string
    error?: ApiError
}

export interface ApiError {
    code: string
    message: string
    details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
    items: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

export interface PaginationParams {
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// Auth specific types
export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    user: import('@/types').User
    accessToken: string
    refreshToken: string
    expiresIn: number
}

export interface RegisterRequest {
    email: string
    password: string
    fullName: string
    phone: string
    role: import('@/types').UserRole
}

// User specific types
export interface ApproveUserRequest {
    userId: string
    approved: boolean
    reason?: string
}

export interface TutorStudent {
    id: string
    name: string
    avatar?: string
    phone: string
    email: string
    grade: string
    subject: string
    classId: string
    startDate: string
    sessionsCompleted: number
    totalSessions: number
    attendance: number
    averageScore: number
    status: "active" | "paused" | "completed"
    parentName: string
    parentPhone: string
    notes?: string
}

export interface ParentChild {
    id: string
    name: string
    grade: string
    avatar?: string
}

export interface ParentChildDetail extends ParentChild {
    school: string
    classes: {
        id: string
        subject: string
        tutor: string
        schedule: string
        sessionsCompleted: number
        totalSessions: number
        attendance: number
        avgScore: number
    }[]
    recentResults: {
        id: string
        test: string
        score: number
        total: number
        date: string
    }[]
    upcomingClasses: {
        subject: string
        tutor: string
        time: string
        date: string
    }[]
}

// Class specific types
export interface CreateClassRequest {
    studentId: string
    subjectId: string
    grade: number
    learningFormat: import('@/types').LearningFormat
    preferredSchedule: import('@/types').Schedule[]
    location?: string
    monthlyBudget: number
    requirements?: string
}

export interface RegisterForClassRequest {
    classId: string
    tutorId: string
}

export interface UpdateAttendanceRequest {
    sessionId: string
    status: 'attended' | 'absent'
    notes?: string
}

// Test specific types
export interface StartTestRequest {
    testId: string
    userId: string
}

export interface SubmitTestRequest {
    attemptId: string
    answers: Record<string, string | string[]>
}

export interface CreateTestRequest {
    title: string
    type: import('@/types').TestType
    subjectId: string
    subjectName: string
    grade?: number
    questions: import('@/types').Question[]
    duration: number
    passingScore: number
    fee?: number
    aiProctoring?: boolean
}

// Transaction specific types
export interface CreatePaymentRequest {
    type: import('@/types').TransactionType
    amount: number
    userId: string
    userName: string
    classId?: string
    testId?: string
    paymentMethod: import('@/types').PaymentMethod
    description: string
}

// Filter types
export interface UserFilters {
    role?: import('@/types').UserRole
    status?: string
    approvalStatus?: import('@/types').ApprovalStatus
    search?: string
}

export interface TutorStudentFilters {
    search?: string
    status?: string
}

export interface ClassFilters {
    status?: import('@/types').ClassStatus
    subjectId?: string
    tutorId?: string
    studentId?: string
}

export interface TransactionFilters {
    type?: import('@/types').TransactionType
    status?: import('@/types').TransactionStatus
    userId?: string
    dateFrom?: string
    dateTo?: string
}

export interface AvailableTest {
    id: string
    classId: string
    className: string
    subject: string
    duration: number
    questions: number
    passingScore: number
    deadline: string
    reward: number
}

export interface CompletedTest {
    id: string
    className: string
    subject: string
    score: number
    passingScore: number
    passed: boolean
    completedAt: string
    duration: number
}

export interface ChildReport {
    summary: {
        totalSessions: number
        attended: number
        avgScore: number
        improvement: number
    }
    attendance: {
        month: string
        value: number
    }[]
    scores: {
        month: string
        value: number
    }[]
    subjects: {
        name: string
        avgScore: number
        attendance: number
        progress: number
    }[]
}
