// ============================================
// USER & AUTHENTICATION TYPES
// ============================================
export type UserRole =
  | "admin"
  | "test_user"
  | "test_manager"
  | "tutor"
  | "teacher"
  | "student"
  | "parent"
  | "accountant"
  | "office"

export type ApprovalStatus = "pending" | "approved" | "rejected" | "requires_test"

export type VerificationStatus = "unverified" | "pending" | "verified" | "failed"

export interface User {
  id: string
  email: string
  phone: string
  fullName: string
  avatar?: string
  role: UserRole
  status: "active" | "inactive" | "suspended"
  createdAt: string
  updatedAt: string
  twoFactorEnabled: boolean
  language: "vi" | "en"
}

export interface TutorProfile extends User {
  role: "tutor"
  university?: string
  studentId?: string
  transcriptUrl?: string // URL bảng điểm thi đại học - TODO: API upload endpoint
  certificatesUrls?: string[] // Chứng chỉ năng khiếu - TODO: API upload endpoint
  subjects: string[]
  approvalStatus: ApprovalStatus
  verificationStatus: VerificationStatus
  testScores: TestScore[]
  rating: number
  totalClasses: number
  monthlyEarnings: number
  backgroundCheckStatus: "pending" | "passed" | "failed"
  approvalDeadline?: string // 48h deadline
}

export interface TeacherProfile extends User {
  role: "teacher"
  degreeUrl: string // Văn bằng - TODO: API upload endpoint
  teachingCertificateUrl: string // Chứng chỉ sư phạm - TODO: API upload endpoint
  institution: string
  yearsOfExperience: number
  subjects: string[]
  approvalStatus: ApprovalStatus
  verificationStatus: VerificationStatus
  testScores: TestScore[]
  rating: number
  totalClasses: number
  monthlyEarnings: number
  backgroundCheckStatus: "pending" | "passed" | "failed"
  approvalDeadline?: string
}

export interface StudentProfile extends User {
  role: "student"
  grade: number // Lớp 1-12
  school?: string
  parentId?: string
  subjects: string[]
  testScores: TestScore[]
  totalClasses: number
  monthlyFees: number
  attendanceRate: number
}

export interface ParentProfile extends User {
  role: "parent"
  childrenIds: string[]
  totalMonthlyExpenses: number
}

// ============================================
// CLASS & SUBJECT TYPES
// ============================================
export type SubjectCategory = "academic" | "skill" | "language" | "art"

export interface Subject {
  id: string
  name: string
  category: SubjectCategory
  description: string
  icon: string
  gradeRange: { min: number; max: number }
}

export type ClassStatus =
  | "open" // Đang tìm gia sư
  | "pending_payment" // Chờ thanh toán 10%
  | "in_progress" // Đang học
  | "completed"
  | "cancelled"

export type LearningFormat = "online" | "offline" | "hybrid"

export interface ClassRequest {
  id: string
  studentId: string
  studentName: string
  parentId?: string
  subjectId: string
  subjectName: string
  grade: number
  learningFormat: LearningFormat
  preferredSchedule: Schedule[]
  location?: string // For offline classes
  monthlyBudget: number
  requirements?: string
  status: ClassStatus
  assignedTutorId?: string
  assignedTutorName?: string
  createdAt: string
  startDate?: string
}

export interface Schedule {
  dayOfWeek: number // 0-6
  startTime: string // HH:mm
  endTime: string
}

export interface ClassSession {
  id: string
  classId: string
  tutorId: string
  studentId: string
  scheduledAt: string
  duration: number // minutes
  status: "scheduled" | "completed" | "cancelled" | "absent_student" | "absent_tutor" | "pending_confirmation" | "reported"
  notes?: string
  rating?: number
}

// ============================================
// TEST & EVALUATION TYPES
// ============================================
export type TestType =
  | "tutor_qualification" // Test đầu vào cho gia sư
  | "class_registration" // Test đăng ký lớp
  | "monthly_evaluation" // Test cuối tháng
  | "online_practice" // Test online thu phí

export type QuestionType = "multiple_choice" | "essay" | "fill_blank" | "matching"

export interface Question {
  id: string
  type: QuestionType
  content: string
  options?: string[]
  correctAnswer?: string | string[]
  points: number
  explanation?: string
  aiGenerated: boolean
}

export interface Test {
  id: string
  title: string
  type: TestType
  subjectId: string
  subjectName: string
  grade?: number
  questions: Question[]
  duration: number // minutes
  passingScore: number // percentage
  fee?: number // For online_practice tests (10,000 VND)
  createdAt: string
  createdBy: string
  aiProctoring: boolean
  status?: "draft" | "published" | "archived"
  description?: string
  difficulty?: "easy" | "medium" | "hard"
}


export interface TestAttempt {
  id: string
  testId: string
  userId: string
  startedAt: string
  completedAt?: string
  answers: Record<string, string | string[]>
  score?: number
  passed?: boolean
  proctorFlags?: ProctorFlag[]
  aiEvaluation?: string
}

export interface ProctorFlag {
  timestamp: string
  type: "face_not_visible" | "multiple_faces" | "tab_switch" | "suspicious_behavior"
  severity: "low" | "medium" | "high"
}

export interface TestScore {
  testId: string
  testType: TestType
  subjectId: string
  score: number
  passed: boolean
  attemptDate: string
}

// ============================================
// FINANCIAL TYPES
// ============================================
export type TransactionType =
  | "class_registration_fee" // 10% phí đăng ký
  | "student_payment" // 50% học phí trước
  | "student_payment_remaining" // 50% còn lại
  | "tutor_payout" // 80% lương gia sư
  | "escrow_hold" // 20% escrow
  | "escrow_release"
  | "cancellation_fee" // 20% phí hủy
  | "test_fee" // 10,000 VND test online
  | "refund"

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded"

export type PaymentMethod = "momo" | "vnpay" | "bank_transfer" | "cash"

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  currency: "VND"
  userId: string
  userName: string
  classId?: string
  testId?: string
  status: TransactionStatus
  paymentMethod?: PaymentMethod
  description: string
  createdAt: string
  completedAt?: string
}

export interface Wallet {
  userId: string
  balance: number
  pendingBalance: number // Escrow
  totalEarnings: number
  totalSpent: number
  lastUpdated: string
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export type NotificationType =
  | "approval_update"
  | "class_update"
  | "payment_update"
  | "test_reminder"
  | "attendance_warning"
  | "monthly_report"
  | "system"

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: string
}

// ============================================
// DASHBOARD STATISTICS
// ============================================
export interface AdminStats {
  totalUsers: number
  totalTutors: number
  totalTeachers: number
  totalStudents: number
  pendingApprovals: number
  activeClasses: number
  monthlyRevenue: number
  monthlyTests: number
}

export interface TutorStats {
  activeClasses: number
  totalStudents: number
  monthlyEarnings: number
  averageRating: number
  upcomingSessions: number
  completedSessions: number
}

export interface StudentStats {
  activeClasses: number
  completedTests: number
  averageScore: number
  attendanceRate: number
  upcomingSessions: number
}

export interface ScheduleItem {
  id: string
  subject: string
  tutor: string
  date?: string // For specific sessions
  dayOfWeek?: number // For recurring schedule
  startTime: string
  endTime: string
  type: LearningFormat
  status?: "scheduled" | "completed" | "cancelled"
}

export interface TestWithStats extends Test {
  attempts: number
  avgScore: number
  difficulty: "easy" | "medium" | "hard" // Add this to Test type if not present, but here for now
}

export interface OfficeStats {
  totalActiveClasses: number
  attendanceAlerts: number
  studentsWithLowAttendance: number
  tutorsWithLowAttendance: number
  monthlySessionsCompleted: number
}

export interface AccountantStats {
  totalRevenue: number
  totalPayouts: number
  pendingPayouts: number
  escrowBalance: number
  monthlyTransactions: number
  pendingTransactions: number
  monthlyGrowth: number
  completedToday: number
  monthlyData: { month: string; income: number; expense: number; profit: number }[]
  categoryBreakdown: { category: string; amount: number; percentage: number; trend: "up" | "down" | "stable" }[]
  expenseBreakdown: { category: string; amount: number; percentage: number; trend: "up" | "down" | "stable" }[]
  topTutors: { name: string; classes: number; students: number; earnings: number }[]
}

// ============================================
// AUDIT LOG TYPES
// ============================================
export interface AuditLog {
  id: string
  timestamp: string
  user: {
    name: string
    email: string
    avatar?: string
  }
  action: string
  module: string
  description: string
  ipAddress: string
  details?: any
  severity: "info" | "warning" | "error" | "success"
}

