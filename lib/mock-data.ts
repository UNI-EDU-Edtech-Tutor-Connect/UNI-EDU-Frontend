import type {
  User,
  TutorProfile,
  TeacherProfile,
  StudentProfile,
  ParentProfile,
  Subject,
  ClassRequest,
  ClassSession,
  Test,
  Transaction,
  Notification,
  AdminStats,
  TutorStats,
  StudentStats,
  OfficeStats,
  AccountantStats,
} from "@/types"

// ============================================
// MOCK SUBJECTS - TODO: Replace with API call GET /api/subjects
// ============================================
export const mockSubjects: Subject[] = [
  {
    id: "math",
    name: "Toán học",
    category: "academic",
    description: "Toán cơ bản và nâng cao",
    icon: "📐",
    gradeRange: { min: 1, max: 12 },
  },
  {
    id: "physics",
    name: "Vật lý",
    category: "academic",
    description: "Vật lý phổ thông",
    icon: "⚛️",
    gradeRange: { min: 6, max: 12 },
  },
  {
    id: "chemistry",
    name: "Hóa học",
    category: "academic",
    description: "Hóa học phổ thông",
    icon: "🧪",
    gradeRange: { min: 8, max: 12 },
  },
  {
    id: "biology",
    name: "Sinh học",
    category: "academic",
    description: "Sinh học phổ thông",
    icon: "🧬",
    gradeRange: { min: 6, max: 12 },
  },
  {
    id: "literature",
    name: "Ngữ văn",
    category: "academic",
    description: "Ngữ văn Việt Nam",
    icon: "📚",
    gradeRange: { min: 1, max: 12 },
  },
  {
    id: "history",
    name: "Lịch sử",
    category: "academic",
    description: "Lịch sử Việt Nam và thế giới",
    icon: "🏛️",
    gradeRange: { min: 4, max: 12 },
  },
  {
    id: "geography",
    name: "Địa lý",
    category: "academic",
    description: "Địa lý tự nhiên và kinh tế",
    icon: "🌍",
    gradeRange: { min: 4, max: 12 },
  },
  {
    id: "english",
    name: "Tiếng Anh",
    category: "language",
    description: "Tiếng Anh giao tiếp và học thuật",
    icon: "🇬🇧",
    gradeRange: { min: 1, max: 12 },
  },
  {
    id: "informatics",
    name: "Tin học",
    category: "academic",
    description: "Tin học cơ bản và lập trình",
    icon: "💻",
    gradeRange: { min: 3, max: 12 },
  },
  {
    id: "civics",
    name: "GDCD",
    category: "academic",
    description: "Giáo dục công dân",
    icon: "⚖️",
    gradeRange: { min: 6, max: 12 },
  },
  {
    id: "music",
    name: "Âm nhạc",
    category: "art",
    description: "Nhạc lý và thực hành",
    icon: "🎵",
    gradeRange: { min: 1, max: 12 },
  },
  {
    id: "art",
    name: "Mỹ thuật",
    category: "art",
    description: "Hội họa và thiết kế",
    icon: "🎨",
    gradeRange: { min: 1, max: 12 },
  },
]

// ============================================
// MOCK USERS - TODO: Replace with API call GET /api/users
// ============================================
export const mockAdmin: User = {
  id: "admin-001",
  email: "admin@educonnect.vn",
  phone: "0901234567",
  fullName: "Nguyễn Văn Admin",
  avatar: "/admin-avatar.png",
  role: "admin",
  status: "active",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-12-01T00:00:00Z",
  twoFactorEnabled: true,
  language: "vi",
}

export const mockTutors: TutorProfile[] = [
  {
    id: "tutor-001",
    email: "tutor1@educonnect.vn",
    phone: "0912345678",
    fullName: "Trần Minh Tuấn",
    avatar: "/male-tutor-avatar.jpg",
    role: "tutor",
    status: "active",
    createdAt: "2024-06-15T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: true,
    language: "vi",
    university: "Đại học Bách khoa Hà Nội",
    studentId: "BK2024001",
    transcriptUrl: "/uploads/transcripts/tutor-001.pdf",
    subjects: ["math", "physics"],
    approvalStatus: "approved",
    verificationStatus: "verified",
    testScores: [
      {
        testId: "test-001",
        testType: "tutor_qualification",
        subjectId: "math",
        score: 92,
        passed: true,
        attemptDate: "2024-06-20T00:00:00Z",
      },
      {
        testId: "test-002",
        testType: "tutor_qualification",
        subjectId: "physics",
        score: 88,
        passed: true,
        attemptDate: "2024-06-21T00:00:00Z",
      },
    ],
    rating: 4.8,
    totalClasses: 15,
    monthlyEarnings: 12500000,
    backgroundCheckStatus: "passed",
  },
  {
    id: "tutor-002",
    email: "tutor2@educonnect.vn",
    phone: "0923456789",
    fullName: "Lê Thị Hương",
    avatar: "/female-tutor-avatar.jpg",
    role: "tutor",
    status: "active",
    createdAt: "2024-07-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: false,
    language: "vi",
    university: "Đại học Sư phạm Hà Nội",
    studentId: "SP2024002",
    transcriptUrl: "/uploads/transcripts/tutor-002.pdf",
    subjects: ["english", "literature"],
    approvalStatus: "approved",
    verificationStatus: "verified",
    testScores: [
      {
        testId: "test-003",
        testType: "tutor_qualification",
        subjectId: "english",
        score: 95,
        passed: true,
        attemptDate: "2024-07-05T00:00:00Z",
      },
    ],
    rating: 4.9,
    totalClasses: 22,
    monthlyEarnings: 18000000,
    backgroundCheckStatus: "passed",
  },
  {
    id: "tutor-003",
    email: "pending@educonnect.vn",
    phone: "0934567890",
    fullName: "Phạm Văn Pending",
    role: "tutor",
    status: "active",
    createdAt: "2024-12-10T00:00:00Z",
    updatedAt: "2024-12-10T00:00:00Z",
    twoFactorEnabled: false,
    language: "vi",
    university: "Đại học Kinh tế Quốc dân",
    studentId: "KT2024003",
    subjects: ["math"],
    approvalStatus: "pending",
    verificationStatus: "pending",
    testScores: [],
    rating: 0,
    totalClasses: 0,
    monthlyEarnings: 0,
    backgroundCheckStatus: "pending",
    approvalDeadline: "2024-12-12T00:00:00Z",
  },
]

export const mockTeachers: TeacherProfile[] = [
  {
    id: "teacher-001",
    email: "teacher1@educonnect.vn",
    phone: "0945678901",
    fullName: "PGS.TS Nguyễn Văn Học",
    avatar: "/professor-avatar.png",
    role: "teacher",
    status: "active",
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: true,
    language: "vi",
    degreeUrl: "/uploads/degrees/teacher-001.pdf",
    teachingCertificateUrl: "/uploads/certificates/teacher-001.pdf",
    institution: "Đại học Quốc gia Hà Nội",
    yearsOfExperience: 15,
    subjects: ["physics", "math"],
    approvalStatus: "approved",
    verificationStatus: "verified",
    testScores: [
      {
        testId: "test-004",
        testType: "tutor_qualification",
        subjectId: "physics",
        score: 98,
        passed: true,
        attemptDate: "2024-03-05T00:00:00Z",
      },
    ],
    rating: 5.0,
    totalClasses: 8,
    monthlyEarnings: 25000000,
    backgroundCheckStatus: "passed",
  },
]

export const mockStudents: StudentProfile[] = [
  {
    id: "student-001",
    email: "student1@educonnect.vn",
    phone: "0956789012",
    fullName: "Nguyễn Thị Lan",
    avatar: "/female-student-avatar.png",
    role: "student",
    status: "active",
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: false,
    language: "vi",
    grade: 11,
    school: "THPT Chu Văn An",
    parentId: "parent-001",
    subjects: ["math", "physics", "english"],
    testScores: [
      {
        testId: "test-005",
        testType: "monthly_evaluation",
        subjectId: "math",
        score: 75,
        passed: true,
        attemptDate: "2024-11-30T00:00:00Z",
      },
    ],
    totalClasses: 3,
    monthlyFees: 4500000,
    attendanceRate: 95,
  },
  {
    id: "student-002",
    email: "student2@educonnect.vn",
    phone: "0967890123",
    fullName: "Trần Văn Nam",
    avatar: "/male-student-avatar.png",
    role: "student",
    status: "active",
    createdAt: "2024-09-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: false,
    language: "vi",
    grade: 10,
    school: "THPT Nguyễn Huệ",
    parentId: "parent-002",
    subjects: ["chemistry", "biology"],
    testScores: [],
    totalClasses: 2,
    monthlyFees: 3000000,
    attendanceRate: 78, // Low attendance - needs warning
  },
]

export const mockParents: ParentProfile[] = [
  {
    id: "parent-001",
    email: "parent1@educonnect.vn",
    phone: "0978901234",
    fullName: "Nguyễn Văn Phụ Huynh",
    role: "parent",
    status: "active",
    createdAt: "2024-08-01T00:00:00Z",
    updatedAt: "2024-12-01T00:00:00Z",
    twoFactorEnabled: true,
    language: "vi",
    childrenIds: ["student-001"],
    totalMonthlyExpenses: 4500000,
  },
]

// ============================================
// MOCK CLASSES - TODO: Replace with API call GET /api/classes
// ============================================
export const mockClassRequests: ClassRequest[] = [
  {
    id: "class-001",
    studentId: "student-001",
    studentName: "Nguyễn Thị Lan",
    parentId: "parent-001",
    subjectId: "math",
    subjectName: "Toán học",
    grade: 11,
    learningFormat: "hybrid",
    preferredSchedule: [
      { dayOfWeek: 1, startTime: "18:00", endTime: "20:00" },
      { dayOfWeek: 4, startTime: "18:00", endTime: "20:00" },
    ],
    location: "Quận Cầu Giấy, Hà Nội",
    monthlyBudget: 2000000,
    requirements: "Cần gia sư có kinh nghiệm luyện thi đại học",
    status: "in_progress",
    assignedTutorId: "tutor-001",
    assignedTutorName: "Trần Minh Tuấn",
    createdAt: "2024-09-01T00:00:00Z",
    startDate: "2024-09-15T00:00:00Z",
  },
  {
    id: "class-002",
    studentId: "student-001",
    studentName: "Nguyễn Thị Lan",
    parentId: "parent-001",
    subjectId: "english",
    subjectName: "Tiếng Anh",
    grade: 11,
    learningFormat: "online",
    preferredSchedule: [
      { dayOfWeek: 2, startTime: "19:00", endTime: "21:00" },
      { dayOfWeek: 5, startTime: "19:00", endTime: "21:00" },
    ],
    monthlyBudget: 1500000,
    status: "in_progress",
    assignedTutorId: "tutor-002",
    assignedTutorName: "Lê Thị Hương",
    createdAt: "2024-09-15T00:00:00Z",
    startDate: "2024-10-01T00:00:00Z",
  },
  {
    id: "class-003",
    studentId: "student-002",
    studentName: "Trần Văn Nam",
    parentId: "parent-002",
    subjectId: "chemistry",
    subjectName: "Hóa học",
    grade: 10,
    learningFormat: "offline",
    preferredSchedule: [{ dayOfWeek: 3, startTime: "17:00", endTime: "19:00" }],
    location: "Quận Đống Đa, Hà Nội",
    monthlyBudget: 1200000,
    status: "open",
    createdAt: "2024-12-01T00:00:00Z",
  },
]

// ============================================
// MOCK SESSIONS - TODO: Replace with API call GET /api/sessions
// ============================================
export const mockClassSessions: ClassSession[] = [
  {
    id: "session-001",
    classId: "class-001",
    tutorId: "tutor-001",
    studentId: "student-001",
    scheduledAt: "2024-12-16T18:00:00Z",
    duration: 120,
    status: "scheduled",
  },
  {
    id: "session-002",
    classId: "class-001",
    tutorId: "tutor-001",
    studentId: "student-001",
    scheduledAt: "2024-12-12T18:00:00Z",
    duration: 120,
    status: "completed",
    notes: "Hoàn thành chương hàm số",
    rating: 5,
  },
  {
    id: "session-003",
    classId: "class-002",
    tutorId: "tutor-002",
    studentId: "student-001",
    scheduledAt: "2024-12-17T19:00:00Z",
    duration: 120,
    status: "scheduled",
  },
  {
    id: "session-005",
    classId: "class-001",
    tutorId: "tutor-001",
    studentId: "student-001",
    scheduledAt: "2024-12-18T18:00:00Z",
    duration: 120,
    status: "reported",
  },
  {
    id: "session-004",
    classId: "class-001",
    tutorId: "tutor-001",
    studentId: "student-001",
    scheduledAt: "2024-12-19T18:00:00Z",
    duration: 120,
    status: "pending_confirmation",
  },
]

// ============================================
// MOCK TESTS - TODO: Replace with API call GET /api/tests
// ============================================
export const mockTests: Test[] = [
  {
    id: "test-online-001",
    title: "Đề thi thử Toán THPT QG 2025",
    type: "online_practice",
    subjectId: "math",
    subjectName: "Toán học",
    grade: 12,
    questions: [],
    duration: 90,
    passingScore: 50,
    fee: 10000,
    createdAt: "2024-12-01T00:00:00Z",
    createdBy: "system",
    aiProctoring: true,
  },
  {
    id: "test-online-002",
    title: "Đề thi thử Tiếng Anh THPT QG 2025",
    type: "online_practice",
    subjectId: "english",
    subjectName: "Tiếng Anh",
    grade: 12,
    questions: [],
    duration: 60,
    passingScore: 50,
    fee: 10000,
    createdAt: "2024-12-01T00:00:00Z",
    createdBy: "system",
    aiProctoring: true,
  },
]

// ============================================
// MOCK TRANSACTIONS - TODO: Replace with API call GET /api/transactions
// ============================================
export const mockTransactions: Transaction[] = [
  {
    id: "txn-001",
    type: "student_payment",
    amount: 1000000,
    currency: "VND",
    userId: "student-001",
    userName: "Nguyễn Thị Lan",
    classId: "class-001",
    status: "completed",
    paymentMethod: "vnpay",
    description: "Thanh toán 50% học phí tháng 12 - Lớp Toán",
    createdAt: "2024-12-01T00:00:00Z",
    completedAt: "2024-12-01T00:05:00Z",
  },
  {
    id: "txn-002",
    type: "tutor_payout",
    amount: 1600000,
    currency: "VND",
    userId: "tutor-001",
    userName: "Trần Minh Tuấn",
    classId: "class-001",
    status: "completed",
    paymentMethod: "bank_transfer",
    description: "Chi trả 80% lương tháng 11 - Lớp Toán",
    createdAt: "2024-12-05T00:00:00Z",
    completedAt: "2024-12-05T12:00:00Z",
  },
  {
    id: "txn-003",
    type: "test_fee",
    amount: 10000,
    currency: "VND",
    userId: "student-001",
    userName: "Nguyễn Thị Lan",
    testId: "test-online-001",
    status: "completed",
    paymentMethod: "momo",
    description: "Phí thi thử online - Toán THPT QG",
    createdAt: "2024-12-10T00:00:00Z",
    completedAt: "2024-12-10T00:01:00Z",
  },
]

// ============================================
// MOCK NOTIFICATIONS - TODO: Replace with API call GET /api/notifications
// ============================================
export const mockNotifications: Notification[] = [
  {
    id: "notif-001",
    userId: "tutor-001",
    type: "class_update",
    title: "Lớp học mới phù hợp",
    message: "Có lớp Hóa học lớp 10 đang tìm gia sư, phù hợp với bạn.",
    read: false,
    actionUrl: "/dashboard/tutor/classes/class-003",
    createdAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "notif-002",
    userId: "parent-001",
    type: "monthly_report",
    title: "Báo cáo học tập tháng 11",
    message: "Báo cáo học tập của Nguyễn Thị Lan đã sẵn sàng.",
    read: false,
    actionUrl: "/dashboard/parent/reports/2024-11",
    createdAt: "2024-12-01T08:00:00Z",
  },
  {
    id: "notif-parent-002",
    userId: "parent-001",
    type: "payment_update",
    title: "Thanh toán học phí",
    message: "Thanh toán học phí môn Vật lý tháng 12 cần xác nhận.",
    read: false,
    actionUrl: "/dashboard/parent/payments",
    createdAt: "2024-12-12T10:00:00Z",
  },
  {
    id: "notif-parent-003",
    userId: "parent-001",
    type: "class_update", // Using class_update as generic for academic updates if score type not available, or I could use monthly_report again
    title: "Kết quả kiểm tra",
    message: "Minh đạt 9 điểm bài kiểm tra Toán.",
    read: true,
    actionUrl: "/dashboard/parent/reports",
    createdAt: "2024-12-14T15:30:00Z",
  },
  {
    id: "notif-003",
    userId: "student-002",
    type: "attendance_warning",
    title: "Cảnh báo điểm danh",
    message: "Bạn đã vắng 4 buổi học trong tháng này. Vui lòng liên hệ văn phòng.",
    read: false,
    actionUrl: "/dashboard/student/attendance",
    createdAt: "2024-12-14T09:00:00Z",
  },
]

// ============================================
// MOCK STATISTICS - TODO: Replace with API calls
// ============================================
export const mockAdminStats: AdminStats = {
  totalUsers: 1250,
  totalTutors: 180,
  totalTeachers: 45,
  totalStudents: 890,
  pendingApprovals: 12,
  activeClasses: 425,
  monthlyRevenue: 850000000,
  monthlyTests: 3200,
}

export const mockTutorStats: TutorStats = {
  activeClasses: 5,
  totalStudents: 8,
  monthlyEarnings: 12500000,
  averageRating: 4.8,
  upcomingSessions: 12,
  completedSessions: 45,
}

export const mockStudentStats: StudentStats = {
  activeClasses: 3,
  completedTests: 8,
  averageScore: 78,
  attendanceRate: 95,
  upcomingSessions: 6,
}

export const mockOfficeStats: OfficeStats = {
  totalActiveClasses: 425,
  attendanceAlerts: 28,
  studentsWithLowAttendance: 15,
  tutorsWithLowAttendance: 3,
  monthlySessionsCompleted: 4250,
}

export const mockAccountantStats: AccountantStats = {
  totalRevenue: 850000000,
  totalPayouts: 680000000,
  pendingPayouts: 45000000,
  escrowBalance: 125000000,
  monthlyTransactions: 2150,
  pendingTransactions: 18,
  monthlyGrowth: 12.5,
  completedToday: 18,
  monthlyData: [
    { month: "Tháng 1", income: 125000000, expense: 78000000, profit: 47000000 },
    { month: "Tháng 2", income: 138000000, expense: 82000000, profit: 56000000 },
    { month: "Tháng 3", income: 145000000, expense: 85000000, profit: 60000000 },
    { month: "Tháng 4", income: 132000000, expense: 79000000, profit: 53000000 },
    { month: "Tháng 5", income: 156000000, expense: 89000000, profit: 67000000 },
    { month: "Tháng 6", income: 168000000, expense: 95000000, profit: 73000000 },
  ],
  categoryBreakdown: [
    { category: "Học phí", amount: 120000000, percentage: 71.4, trend: "up" },
    { category: "Phí đăng ký gia sư", amount: 25000000, percentage: 14.9, trend: "up" },
    { category: "Hoa hồng giới thiệu", amount: 15000000, percentage: 8.9, trend: "down" },
    { category: "Khác", amount: 8000000, percentage: 4.8, trend: "stable" },
  ],
  expenseBreakdown: [
    { category: "Lương gia sư", amount: 65000000, percentage: 68.4, trend: "up" },
    { category: "Vận hành", amount: 15000000, percentage: 15.8, trend: "stable" },
    { category: "Marketing", amount: 10000000, percentage: 10.5, trend: "up" },
    { category: "Lương nhân viên", amount: 5000000, percentage: 5.3, trend: "stable" },
  ],
  topTutors: [
    { name: "Nguyễn Văn A", classes: 8, students: 24, earnings: 12500000 },
    { name: "Trần Thị B", classes: 6, students: 18, earnings: 9800000 },
    { name: "Lê Văn C", classes: 5, students: 15, earnings: 8200000 },
    { name: "Phạm Thị D", classes: 5, students: 14, earnings: 7500000 },

    { name: "Hoàng Văn E", classes: 4, students: 12, earnings: 6800000 },
  ],
}

// ============================================
// STUDENT DASHBOARD MOCK DATA
// ============================================

import type { ScheduleItem, TestWithStats, Question } from "@/types"

export const mockScheduleItems: ScheduleItem[] = [
  {
    id: "1",
    subject: "Toán Cao Cấp",
    tutor: "Nguyễn Văn A",
    dayOfWeek: 1, // Monday
    startTime: "14:00",
    endTime: "16:00",
    type: "online",
    status: "scheduled",
    date: "2025-12-18",
  },
  {
    id: "2",
    subject: "Tiếng Anh IELTS",
    tutor: "Trần Thị B",
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "11:00",
    type: "offline",
    status: "scheduled",
    date: "2025-12-19",
  },
  {
    id: "3",
    subject: "Vật lý 12",
    tutor: "Lê Văn C",
    dayOfWeek: 4, // Thursday
    startTime: "19:00",
    endTime: "21:00",
    type: "online",
    status: "scheduled",
    date: "2025-12-21",
  },
]

export const mockPracticeTestsWithStats: TestWithStats[] = [
  {
    id: "p1",
    title: "Toán học - Đề thi thử THPT Quốc gia 2025",
    type: "online_practice",
    subjectId: "math",
    subjectName: "Toán học",
    duration: 90,
    questions: [],
    passingScore: 50,
    createdAt: "2025-01-01",
    createdBy: "system",
    aiProctoring: true,
    attempts: 1245,
    avgScore: 72,
    difficulty: "hard",
  },
  {
    id: "p2",
    title: "Tiếng Anh - Đề thi thử IELTS Reading",
    type: "online_practice",
    subjectId: "english",
    subjectName: "Tiếng Anh",
    duration: 60,
    questions: [],
    passingScore: 60,
    createdAt: "2025-01-01",
    createdBy: "system",
    aiProctoring: true,
    attempts: 890,
    avgScore: 68,
    difficulty: "medium",
  },
]

export const mockTestQuestions: Question[] = [
  {
    id: "q1",
    type: "multiple_choice",
    content: "Phương trình bậc hai ax² + bx + c = 0 (a ≠ 0) có nghiệm kép khi:",
    options: ["Δ > 0", "Δ = 0", "Δ < 0", "a = 0"],
    correctAnswer: "Δ = 0",
    points: 10,
    aiGenerated: false,
  },
  {
    id: "q2",
    type: "multiple_choice",
    content: "Giới hạn lim(x→0) sin(x)/x bằng:",
    options: ["0", "1", "∞", "Không xác định"],
    correctAnswer: "1",
    points: 10,
    aiGenerated: false,
  },
]

