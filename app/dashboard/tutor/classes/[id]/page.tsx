"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/dashboard/status-badge"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Mail,
  Video,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

// Mock session data for this class
const mockSessions = [
  {
    id: "s1",
    date: "2025-12-10",
    time: "14:00-15:30",
    status: "completed",
    attended: true,
    notes: "Hoàn thành bài tập về nhà, học sinh tiến bộ tốt",
    topic: "Đại số tuyến tính - Ma trận",
  },
  {
    id: "s2",
    date: "2025-12-12",
    time: "14:00-15:30",
    status: "completed",
    attended: true,
    notes: "Ôn tập kiến thức, chuẩn bị cho bài kiểm tra",
    topic: "Giải hệ phương trình",
  },
  {
    id: "s3",
    date: "2025-12-14",
    time: "14:00-15:30",
    status: "completed",
    attended: false,
    notes: "Học sinh nghỉ do bận việc gia đình",
    topic: "Tích phân cơ bản",
  },
  {
    id: "s4",
    date: "2025-12-16",
    time: "14:00-15:30",
    status: "scheduled",
    attended: null,
    notes: "",
    topic: "Tích phân nâng cao",
  },
  {
    id: "s5",
    date: "2025-12-18",
    time: "14:00-15:30",
    status: "scheduled",
    attended: null,
    notes: "",
    topic: "Bài tập tổng hợp",
  },
  {
    id: "s6",
    date: "2025-12-19",
    time: "14:00-15:30",
    status: "pending_confirmation",
    attended: true,
    notes: "",
    topic: "Luyện đề",
  },
]

export default function ClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { classRequests, sessions } = useAppSelector((state) => state.classes)
  const { toast } = useToast()

  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [showSessionDetailsDialog, setShowSessionDetailsDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<(typeof mockSessions)[0] | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState<boolean>(true)
  const [sessionNotes, setSessionNotes] = useState("")
  const [localSessions, setLocalSessions] = useState(mockSessions)

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const classItem = classRequests.find((c) => c.id === params.id)

  if (!classItem) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Không tìm thấy lớp học</p>
        <Button variant="outline" className="mt-4 bg-transparent" asChild>
          <Link href="/dashboard/tutor/classes">Quay lại danh sách</Link>
        </Button>
      </div>
    )
  }

  const completedSessions = localSessions.filter((s) => s.status === "completed")
  const attendedCount = completedSessions.filter((s) => s.attended).length
  const attendanceRate = completedSessions.length > 0 ? (attendedCount / completedSessions.length) * 100 : 0

  const handleAttendance = (e: React.MouseEvent, session: (typeof localSessions)[0]) => {
    e.stopPropagation()
    setSelectedSession(session)
    setAttendanceStatus(true)
    setSessionNotes("")
    setShowAttendanceDialog(true)
  }

  const handleShowSessionDetails = (session: (typeof localSessions)[0]) => {
    setSelectedSession(session)
    setShowSessionDetailsDialog(true)
  }

  const confirmAttendance = () => {
    if (!selectedSession) return
    const isStudentHasParent = true // Giả lập Học sinh này có Phụ huynh

    setLocalSessions((prev) =>
      prev.map((s) =>
        s.id === selectedSession.id
          ? { ...s, status: isStudentHasParent ? ("pending_confirmation" as any) : "completed", attended: attendanceStatus, notes: sessionNotes }
          : s
      )
    )
    toast({
      title: isStudentHasParent ? "Đã gửi yêu cầu xác nhận" : "Điểm danh thành công",
      description: isStudentHasParent
        ? "Yêu cầu điểm danh đã được gửi đến Học sinh và Phụ huynh để xác nhận. Nếu không đồng thuận, hệ thống sẽ báo về văn phòng."
        : "Đã lưu thông tin điểm danh cho buổi học.",
    })
    setShowAttendanceDialog(false)
  }

  const handleJoinClass = () => {
    toast({
      title: "Đang chuyển hướng...",
      description: "Hệ thống đang thiết lập phòng học ảo.",
    })
    setTimeout(() => {
      router.push(`/dashboard/virtual-room/${params.id}`)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{classItem.subjectName}</h1>
            <StatusBadge status={classItem.status} />
          </div>
          <p className="text-muted-foreground">
            Lớp {classItem.grade} - {classItem.studentName}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/tutor/classes/${params.id}/materials`}>
            <FileText className="h-4 w-4 mr-2" />
            Tài liệu
          </Link>
        </Button>
        <Button onClick={handleJoinClass}>
          <Video className="h-4 w-4 mr-2" />
          Vào lớp học
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{localSessions.length}</p>
                <p className="text-sm text-muted-foreground">Tổng buổi học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedSessions.length}</p>
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{attendanceRate.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ chuyên cần</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(classItem.monthlyBudget)}</p>
                <p className="text-sm text-muted-foreground">Học phí/tháng</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="sessions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sessions">Buổi học</TabsTrigger>
              <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
              <TabsTrigger value="progress">Tiến độ</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử buổi học</CardTitle>
                  <CardDescription>Danh sách các buổi học đã và sắp diễn ra</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {localSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${session.status === "scheduled" ? "border-primary/30 bg-primary/5" : ""
                        }`}
                      onClick={() => handleShowSessionDetails(session)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${session.status === "completed"
                            ? session.attended
                              ? "bg-green-100"
                              : "bg-red-100"
                            : session.status === "pending_confirmation"
                              ? "bg-amber-100"
                              : "bg-blue-100"
                            }`}
                        >
                          {session.status === "completed" ? (
                            session.attended ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )
                          ) : session.status === "pending_confirmation" ? (
                            <Clock className="h-5 w-5 text-amber-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{session.topic}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(session.date).toLocaleDateString("vi-VN")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.time}
                            </span>
                          </div>
                          {session.notes && (
                            <p className="text-sm text-muted-foreground mt-1 italic">"{session.notes}"</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === "completed" ? (
                          <Badge variant={session.attended ? "default" : "destructive"}>
                            {session.attended ? "Có mặt" : "Vắng"}
                          </Badge>
                        ) : session.status === "pending_confirmation" ? (
                          <Badge variant="outline" className="border-amber-300 text-amber-600">
                            Chờ phụ huynh xác nhận
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="outline" className="text-blue-600 border-blue-300">
                              Sắp tới
                            </Badge>
                            <Button size="sm" onClick={(e) => handleAttendance(e, session)}>
                              Điểm danh
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thống kê điểm danh</CardTitle>
                  <CardDescription>Tổng quan chuyên cần của học sinh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tỷ lệ chuyên cần</span>
                      <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
                    </div>
                    <Progress value={attendanceRate} className="h-3" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-2xl font-bold text-green-600">{attendedCount}</p>
                      <p className="text-sm text-green-700">Có mặt</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-2xl font-bold text-red-600">{completedSessions.length - attendedCount}</p>
                      <p className="text-sm text-red-700">Vắng mặt</p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <p className="text-2xl font-bold text-blue-600">
                        {localSessions.filter((s) => s.status === "scheduled").length}
                      </p>
                      <p className="text-sm text-blue-700">Sắp tới</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Lịch sử điểm danh</h4>
                    <div className="flex flex-wrap gap-2">
                      {localSessions
                        .filter((s) => s.status === "completed")
                        .map((session) => (
                          <div
                            key={session.id}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-medium ${session.attended ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                              }`}
                            title={`${new Date(session.date).toLocaleDateString("vi-VN")} - ${session.attended ? "Có mặt" : "Vắng"}`}
                          >
                            {new Date(session.date).getDate()}
                          </div>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ học tập</CardTitle>
                  <CardDescription>Đánh giá quá trình học của học sinh</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Hoàn thành chương trình</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Bài tập về nhà</span>
                        <span className="font-medium">80%</span>
                      </div>
                      <Progress value={80} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Điểm kiểm tra trung bình</span>
                        <span className="font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Nhận xét gần đây</h4>
                    <p className="text-sm text-muted-foreground">
                      Học sinh có tiến bộ tốt trong phần Đại số. Cần tập trung hơn vào phần Hình học không gian. Thái độ
                      học tập tích cực, chăm chỉ làm bài tập về nhà.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Student Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin học sinh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{classItem.studentName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{classItem.studentName}</p>
                  <p className="text-sm text-muted-foreground">Lớp {classItem.grade}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>0901 234 567</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>student@email.com</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span>{classItem.location || "Học online"}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                <Phone className="h-4 w-4 mr-2" />
                Liên hệ phụ huynh
              </Button>
            </CardContent>
          </Card>

          {/* Class Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin lớp học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Môn học</span>
                  <span className="font-medium">{classItem.subjectName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hình thức</span>
                  <Badge variant="outline" className="capitalize">
                    {classItem.learningFormat === "online" ? (
                      <>
                        <Video className="h-3 w-3 mr-1" /> Online
                      </>
                    ) : (
                      <>
                        <MapPin className="h-3 w-3 mr-1" /> Offline
                      </>
                    )}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Học phí</span>
                  <span className="font-semibold text-accent">{formatCurrency(classItem.monthlyBudget)}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Lịch học</p>
                <div className="flex flex-wrap gap-2">
                  {classItem.preferredSchedule.map((s, i) => (
                    <Badge key={i} variant="secondary">
                      {dayNames[s.dayOfWeek]} {s.startTime}-{s.endTime}
                    </Badge>
                  ))}
                </div>
              </div>

              {classItem.requirements && (
                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-2">Yêu cầu</p>
                  <p className="text-sm">{classItem.requirements}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Điểm danh buổi học</DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <>
                  {selectedSession.topic} - {new Date(selectedSession.date).toLocaleDateString("vi-VN")}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${attendanceStatus ? "border-green-500 bg-green-50" : "border-muted hover:border-muted-foreground/50"
                  }`}
                onClick={() => setAttendanceStatus(true)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox checked={attendanceStatus} />
                  <div>
                    <p className="font-medium">Có mặt</p>
                    <p className="text-sm text-muted-foreground">Học sinh tham gia buổi học</p>
                  </div>
                </div>
              </div>
              <div
                className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${!attendanceStatus ? "border-red-500 bg-red-50" : "border-muted hover:border-muted-foreground/50"
                  }`}
                onClick={() => setAttendanceStatus(false)}
              >
                <div className="flex items-center gap-3">
                  <Checkbox checked={!attendanceStatus} />
                  <div>
                    <p className="font-medium">Vắng mặt</p>
                    <p className="text-sm text-muted-foreground">Học sinh không tham gia</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ghi chú buổi học</label>
              <Textarea
                placeholder="Nhập ghi chú về buổi học, tiến độ học sinh..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
              Hủy
            </Button>
            <Button onClick={confirmAttendance}>Xác nhận điểm danh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Session Details Dialog */}
      <Dialog open={showSessionDetailsDialog} onOpenChange={setShowSessionDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết buổi học</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedSession.topic}</h3>
                    <Badge variant={selectedSession.status === 'completed' ? 'secondary' : 'default'} className="mt-1">
                      {
                        selectedSession.status === 'scheduled' ? 'Sắp diễn ra' :
                          selectedSession.status === 'completed' ? 'Đã hoàn thành' :
                            selectedSession.status
                      }
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedSession.date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedSession.time}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Ghi chú</p>
                <p className="text-sm text-muted-foreground">{selectedSession.notes || "Không có ghi chú"}</p>
              </div>

              {selectedSession.status === 'scheduled' && (
                <div className="flex gap-2">
                  <Button className="flex-1" onClick={() => {
                    setShowSessionDetailsDialog(false)
                    handleAttendance({ stopPropagation: () => { } } as React.MouseEvent, selectedSession)
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Điểm danh ngay
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
