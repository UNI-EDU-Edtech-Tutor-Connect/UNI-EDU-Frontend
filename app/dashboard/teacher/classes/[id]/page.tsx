"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { ArrowLeft, Calendar, Clock, Video, Users, CheckCircle, XCircle, Star, Phone, Mail, MapPin } from "lucide-react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const mockClassData = {
  id: "class-1",
  subject: "Toán Cao Cấp",
  grade: "Lớp 12",
  student: {
    name: "Nguyễn Văn Minh",
    phone: "0901234567",
    email: "minh@email.com",
    avatar: null,
  },
  parent: {
    name: "Nguyễn Văn Anh",
    phone: "0912345678",
  },
  schedule: [
    { day: "Thứ 2", time: "14:00 - 16:00" },
    { day: "Thứ 4", time: "14:00 - 16:00" },
  ],
  type: "online",
  monthlyFee: 4800000,
  status: "active",
}

const mockSessions = [
  {
    id: "s1",
    date: "2025-12-10",
    time: "14:00-16:00",
    status: "completed",
    attended: true,
    topic: "Đại số tuyến tính",
  },
  {
    id: "s2",
    date: "2025-12-12",
    time: "14:00-16:00",
    status: "completed",
    attended: true,
    topic: "Giải hệ phương trình",
  },
  {
    id: "s3",
    date: "2025-12-14",
    time: "14:00-16:00",
    status: "completed",
    attended: false,
    topic: "Tích phân cơ bản",
  },
  {
    id: "s4",
    date: "2025-12-16",
    time: "14:00-16:00",
    status: "scheduled",
    attended: null,
    topic: "Tích phân nâng cao",
  },
  { id: "s5", date: "2025-12-18", time: "14:00-16:00", status: "scheduled", attended: null, topic: "Bài tập tổng hợp" },
]

export default function TeacherClassDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [selectedSession, setSelectedSession] = useState<(typeof mockSessions)[0] | null>(null)
  const [attendanceStatus, setAttendanceStatus] = useState(true)
  const [sessionNotes, setSessionNotes] = useState("")

  const completedSessions = mockSessions.filter((s) => s.status === "completed")
  const attendedCount = completedSessions.filter((s) => s.attended).length
  const attendanceRate = completedSessions.length > 0 ? (attendedCount / completedSessions.length) * 100 : 0

  const handleAttendance = (session: (typeof mockSessions)[0]) => {
    setSelectedSession(session)
    setShowAttendanceDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mockClassData.subject}</h1>
          <p className="text-muted-foreground">
            {mockClassData.grade} - {mockClassData.student.name}
          </p>
        </div>
        <Button>
          <Video className="h-4 w-4 mr-2" />
          Vào lớp học
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockSessions.length}</p>
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
                <p className="text-2xl font-bold">{formatCurrency(mockClassData.monthlyFee)}</p>
                <p className="text-sm text-muted-foreground">Học phí/tháng</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
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
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        session.status === "scheduled" ? "border-primary/30 bg-primary/5" : ""
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                            session.status === "completed"
                              ? session.attended
                                ? "bg-green-100"
                                : "bg-red-100"
                              : "bg-blue-100"
                          }`}
                        >
                          {session.status === "completed" ? (
                            session.attended ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-600" />
                            )
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{session.topic}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span>{new Date(session.date).toLocaleDateString("vi-VN")}</span>
                            <span>{session.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {session.status === "completed" ? (
                          <Badge variant={session.attended ? "default" : "destructive"}>
                            {session.attended ? "Có mặt" : "Vắng"}
                          </Badge>
                        ) : (
                          <>
                            <Badge variant="outline" className="text-blue-600">
                              Sắp tới
                            </Badge>
                            <Button size="sm" onClick={() => handleAttendance(session)}>
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
                        {mockSessions.filter((s) => s.status === "scheduled").length}
                      </p>
                      <p className="text-sm text-blue-700">Sắp tới</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ học tập</CardTitle>
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
                        <span>Điểm kiểm tra trung bình</span>
                        <span className="font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin học sinh</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={mockClassData.student.avatar || undefined} />
                  <AvatarFallback>{mockClassData.student.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{mockClassData.student.name}</p>
                  <p className="text-sm text-muted-foreground">{mockClassData.grade}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{mockClassData.student.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{mockClassData.student.email}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin lớp học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Hình thức</span>
                  <Badge variant="outline">
                    {mockClassData.type === "online" ? (
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
                  <span className="font-semibold text-accent">{formatCurrency(mockClassData.monthlyFee)}</span>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm text-muted-foreground mb-2">Lịch học</p>
                <div className="space-y-2">
                  {mockClassData.schedule.map((s, i) => (
                    <Badge key={i} variant="secondary" className="mr-2">
                      {s.day} {s.time}
                    </Badge>
                  ))}
                </div>
              </div>
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
              {selectedSession?.topic} - {selectedSession?.date}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="attended"
                checked={attendanceStatus}
                onCheckedChange={(checked) => setAttendanceStatus(checked as boolean)}
              />
              <label htmlFor="attended" className="text-sm font-medium">
                Học sinh có mặt
              </label>
            </div>
            <Textarea
              placeholder="Ghi chú về buổi học..."
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAttendanceDialog(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAttendanceDialog(false)}>Lưu điểm danh</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
