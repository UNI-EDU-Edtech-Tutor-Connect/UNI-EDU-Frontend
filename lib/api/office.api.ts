
import { delay } from "./config"

export interface OfficeAppointment {
    id: string
    title: string
    client: { name: string; phone: string }
    type: "consultation" | "interview" | "complaint" | "meeting" | "class_session"
    time: string
    date: string
    location: string
    notes: string
    status: "confirmed" | "pending" | "cancelled" | "completed"
}

export interface StaffPerformance {
    name: string
    role: string
    calls: number
    conversions: number
    satisfaction: number
}

export interface SourceBreakdown {
    source: string
    count: number
    percentage: number
}

export interface SupportRequest {
    id: string
    type: "support" | "complaint" | "refund"
    title: string
    from: string
    time: string
    priority: "high" | "medium" | "low"
    status: "open" | "in_progress" | "resolved"
}

// Mock Data
const MOCK_APPOINTMENTS: OfficeAppointment[] = [
    {
        id: "APT001",
        title: "Tư vấn phụ huynh mới",
        client: { name: "Nguyễn Văn A", phone: "0901234567" },
        type: "consultation",
        time: "09:00 - 09:30",
        date: new Date().toISOString(),
        location: "Văn phòng",
        notes: "Phụ huynh muốn tìm gia sư Toán cho con lớp 12",
        status: "confirmed",
    },
    {
        id: "APT002",
        title: "Phỏng vấn gia sư",
        client: { name: "Trần Thị B", phone: "0912345678" },
        type: "interview",
        time: "10:00 - 10:45",
        date: new Date().toISOString(),
        location: "Online - Zoom",
        notes: "Ứng viên dạy IELTS, cần kiểm tra speaking",
        status: "confirmed",
    },
    {
        id: "APT003",
        title: "Giải quyết khiếu nại",
        client: { name: "Lê Thị C", phone: "0923456789" },
        type: "complaint",
        time: "14:00 - 14:30",
        date: new Date().toISOString(),
        location: "Văn phòng",
        notes: "Phản hồi về chất lượng gia sư",
        status: "pending",
    },
    {
        id: "APT004",
        title: "Họp team văn phòng",
        client: { name: "Team", phone: "" },
        type: "meeting",
        time: "15:00 - 16:00",
        date: new Date().toISOString(),
        location: "Phòng họp A",
        notes: "Tổng kết tuần, phân công công việc",
        status: "confirmed",
    },
]

const MOCK_STAFF_PERFORMANCE: StaffPerformance[] = [
    { name: "Nguyễn Văn A", role: "Tư vấn viên", calls: 156, conversions: 42, satisfaction: 96 },
    { name: "Trần Thị B", role: "Tư vấn viên", calls: 143, conversions: 38, satisfaction: 94 },
    { name: "Lê Văn C", role: "Điều phối", calls: 89, conversions: 28, satisfaction: 93 },
    { name: "Phạm Thị D", role: "Hỗ trợ KH", calls: 124, conversions: 0, satisfaction: 97 },
]

const MOCK_SOURCE_BREAKDOWN: SourceBreakdown[] = [
    { source: "Website", count: 120, percentage: 40 },
    { source: "Facebook", count: 75, percentage: 25 },
    { source: "Giới thiệu", count: 60, percentage: 20 },
    { source: "Zalo", count: 30, percentage: 10 },
    { source: "Khác", count: 15, percentage: 5 },
]

const MOCK_SUPPORT_REQUESTS: SupportRequest[] = [
    {
        id: "REQ001",
        type: "support",
        title: "Hỗ trợ kỹ thuật: Không vào được lớp học",
        from: "Nguyễn Văn A (Học viên)",
        time: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        priority: "high",
        status: "open",
    },
    {
        id: "REQ002",
        type: "complaint",
        title: "Khiếu nại: Gia sư thường xuyên đi muộn",
        from: "Trần Thị B (Phụ huynh)",
        time: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        priority: "high",
        status: "in_progress",
    },
    {
        id: "REQ003",
        type: "refund",
        title: "Yêu cầu hoàn phí: Lớp Toán 12",
        from: "Phạm Văn C (Phụ huynh)",
        time: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        priority: "medium",
        status: "open",
    },
]

export const officeService = {
    getAppointments: async (): Promise<OfficeAppointment[]> => {
        await delay(500)
        return MOCK_APPOINTMENTS
    },

    getReports: async (): Promise<{ staff: StaffPerformance[], sources: SourceBreakdown[] }> => {
        await delay(800)
        return {
            staff: MOCK_STAFF_PERFORMANCE,
            sources: MOCK_SOURCE_BREAKDOWN
        }
    },

    getSupportRequests: async (): Promise<SupportRequest[]> => {
        await delay(600)
        return MOCK_SUPPORT_REQUESTS
    }
}
