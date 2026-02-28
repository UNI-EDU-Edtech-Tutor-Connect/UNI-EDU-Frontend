"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchUsersRequest } from "@/store/slices/users-slice"
import { fetchOfficeStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, BookOpen, Calendar, MessageSquare, Bell, Phone, Mail, FileText, UserPlus, FileQuestion, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { format, isValid } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"

export default function OfficeDashboard() {
  const dispatch = useAppDispatch()
  const { tutors, students, parents, teachers, isLoading: usersLoading } = useAppSelector((state) => state.users)
  const { classRequests, sessions, isLoading: classesLoading } = useAppSelector((state) => state.classes)
  const { officeStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchUsersRequest())
    dispatch(fetchOfficeStatsRequest())
  }, [dispatch])

  // Derive Recent Registrations (All user types sorted by creation date)
  const recentRegistrations = [
    ...tutors.map(u => ({ ...u, type: 'tutor' as const })),
    ...teachers.map(u => ({ ...u, type: 'teacher' as const })),
    ...students.map(u => ({ ...u, type: 'student' as const })),
    ...parents.map(u => ({ ...u, type: 'parent' as const })),
  ].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return timeB - timeA
  }).slice(0, 5)

  // Derive Pending Requests (Class Requests + potentially others)
  const pendingRequests = classRequests
    .filter(c => c.status === "open")
    .map(c => ({
      id: c.id,
      type: "class_request",
      title: `Yêu cầu: ${c.subjectName} - Lớp ${c.grade}`,
      from: c.studentName || "Học sinh",
      time: c.createdAt ? new Date(c.createdAt) : new Date(),
      priority: "high", // Mock priority
    }))
    .sort((a, b) => b.time.getTime() - a.time.getTime())
    .slice(0, 5)

  // Derive Reported Sessions (Attendance discrepancies)
  const reportedSessions = sessions
    .filter(s => s.status === "reported")
    .map(s => {
      const cls = classRequests.find(c => c.id === s.classId);
      return {
        id: s.id,
        classId: s.classId,
        className: cls ? `${cls.subjectName} - Lớp ${cls.grade}` : s.classId,
        studentName: cls?.studentName || "Học sinh",
        tutorName: cls?.assignedTutorName || "Gia sư",
        time: s.scheduledAt ? new Date(s.scheduledAt) : new Date(),
        reason: "Xung đột kết quả điểm danh",
      }
    })
    .sort((a, b) => b.time.getTime() - a.time.getTime())

  // Mock Meetings (No API yet)
  const upcomingMeetings = [
    { id: 1, title: "Tư vấn phụ huynh mới", time: "14:00", client: "Nguyễn Văn A", type: "consultation" },
    { id: 2, title: "Phỏng vấn gia sư", time: "15:30", client: "Trần Thị B", type: "interview" },
    { id: 3, title: "Giải quyết khiếu nại", time: "16:00", client: "Lê Thị C", type: "complaint" },
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "parent":
        return <Badge className="bg-blue-100 text-blue-800">Phụ huynh</Badge>
      case "tutor":
        return <Badge className="bg-green-100 text-green-800">Gia sư</Badge>
      case "teacher":
        return <Badge className="bg-orange-100 text-orange-800">Giáo viên</Badge>
      case "student":
        return <Badge className="bg-purple-100 text-purple-800">Học sinh</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "low":
        return <Badge variant="secondary">Thấp</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Văn phòng điều hành</h1>
        <p className="text-muted-foreground mt-1">Quản lý khách hàng, hỗ trợ và điều phối hoạt động</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Lớp đang hoạt động"
          value={officeStats?.totalActiveClasses.toString() || "0"}
          description="Tổng số lớp"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Cảnh báo điểm danh"
          value={reportedSessions.length.toString()}
          description="Cần xử lý ngay"
          icon={<AlertCircle className="h-4 w-4 text-destructive" />}
        />
        <StatsCard
          title="Buổi học / tháng"
          value={officeStats?.monthlySessionsCompleted.toString() || "0"}
          description="Đã hoàn thành"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Học sinh vắng nhiều"
          value={officeStats?.studentsWithLowAttendance.toString() || "0"}
          description="Nguy cơ nghỉ học"
          icon={<Users className="h-4 w-4 text-orange-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Đăng ký mới nhất</CardTitle>
              <CardDescription>Khách hàng vừa tạo tài khoản</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/office/registrations">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Chưa có đăng ký mới</p>
              ) : (
                recentRegistrations.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{user.fullName}</p>
                          {getTypeLabel(user.type)}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm">{(user.createdAt && isValid(new Date(user.createdAt))) ? format(new Date(user.createdAt), "dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}</p>
                        <Badge variant="outline" className={user.status === 'active' ? 'text-green-600 border-green-200' : ''}>
                          {user.status === 'active' ? 'Hoạt động' : 'Chờ duyệt'}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => toast({ title: "Đang gọi", description: "Đang kết nối cuộc gọi..." })}>
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => toast({ title: "Đang mở chat", description: "Tính năng trò chuyện đang được mở..." })}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch hẹn hôm nay
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings.map((meeting) => (
                <div key={meeting.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{meeting.time}</span>
                    <Badge variant="outline">
                      {meeting.type === "consultation"
                        ? "Tư vấn"
                        : meeting.type === "interview"
                          ? "Phỏng vấn"
                          : "Khiếu nại"}
                    </Badge>
                  </div>
                  <p className="text-sm">{meeting.title}</p>
                  <p className="text-sm text-muted-foreground">{meeting.client}</p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/office/calendar">Xem lịch đầy đủ</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-500" />
              Yêu cầu chờ xử lý
            </CardTitle>
            <CardDescription>Các yêu cầu lớp học mới và hỗ trợ</CardDescription>
          </div>
          <Button asChild>
            <Link href="/dashboard/office/requests">Xử lý tất cả</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Không có yêu cầu chờ xử lý</p>
            ) : (
              pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{request.title}</p>
                        {getPriorityBadge(request.priority)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {request.from} - {isValid(request.time) ? format(request.time, "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Chi tiết", description: "Mở chi tiết yêu cầu..." })}>
                      Xem chi tiết
                    </Button>
                    <Button size="sm" onClick={() => toast({ title: "Thông báo", description: "Yêu cầu đã được chuyển trạng thái..." })}>Xử lý</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Cảnh báo điểm danh (Báo cáo sai lệch)
            </CardTitle>
            <CardDescription>Các buổi học bị học sinh/phụ huynh báo cáo sai lệch</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportedSessions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Không có báo cáo sai lệch điểm danh</p>
            ) : (
              reportedSessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50/50">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-100">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-red-800">{session.className}</p>
                        <Badge variant="destructive">Khẩn cấp</Badge>
                      </div>
                      <p className="text-sm text-red-600/80">
                        {session.studentName} (Học sinh) - {session.tutorName} (Gia sư)
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Buổi học: {isValid(session.time) ? format(session.time, "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => toast({ title: "Đang liên hệ", description: "Đang mở cửa sổ chat với Gia sư & Học sinh..." })}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Liên hệ
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => toast({ title: "Thông báo", description: "Đã đánh dấu đang xử lý vụ việc này." })}>
                      Nhận xử lý
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 sm:grid-cols-2">
            <Button className="justify-start bg-transparent" variant="outline" onClick={() => toast({ title: "Thêm thành viên", description: "Bạn có thể thêm người dùng mới từ Tab Khách hàng." })}>
              <UserPlus className="h-4 w-4 mr-2" />
              Thêm khách hàng
            </Button>
            <Button className="justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/office/classes">
                <BookOpen className="h-4 w-4 mr-2" />
                Tạo lớp mới
              </Link>
            </Button>
            <Button className="justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/office/matching">
                <Users className="h-4 w-4 mr-2" />
                Ghép lớp
              </Link>
            </Button>
            <Button className="justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/office/reports">
                <FileText className="h-4 w-4 mr-2" />
                Báo cáo
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê nhanh</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tổng học sinh</span>
                <span className="font-semibold">{students.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tổng gia sư</span>
                <span className="font-semibold">{tutors.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lớp chờ ghép</span>
                <span className="font-semibold">{classRequests.filter(c => c.status === 'open').length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Lớp đang học</span>
                <span className="font-semibold">{officeStats?.totalActiveClasses || 0}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
