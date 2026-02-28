"use client"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  CheckCircle,
  XCircle,
  Star,
  Phone,
  Mail,
  FileText,
  Play,
  AlertCircle
} from "lucide-react"

import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import type { RootState } from "@/store"
import { useParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { fetchClassesRequest } from "@/store/slices/classes-slice"

const mockMaterials = [
  { id: "m1", name: "Bài giảng Đại số tuyến tính", type: "pdf", size: "2.5 MB", date: "2025-12-10" },
  { id: "m2", name: "Bài tập về nhà tuần 1", type: "pdf", size: "1.2 MB", date: "2025-12-12" },
  { id: "m3", name: "Video giải bài tập", type: "video", size: "45 MB", date: "2025-12-14" },
]

export default function StudentClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useDispatch()
  const { toast } = useToast()

  const { classRequests, sessions } = useSelector((state: RootState) => state.classes)

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const classDetail = classRequests.find((c: any) => c.id === params.id)
  const classSessions = sessions.filter((s: any) => s.classId === params.id)

  const [localSessions, setLocalSessions] = useState<any[]>([])

  useEffect(() => {
    if (classSessions.length > 0 && localSessions.length === 0) {
      setLocalSessions(classSessions)
    }
  }, [classSessions, localSessions.length])

  const handleConfirmAttendance = (sessionId: string) => {
    setLocalSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, status: "completed", attended: true } : s)
    )
    toast({ title: "Đã xác nhận", description: "Cảm ơn bạn đã xác nhận điểm danh." })
  }

  const handleReportDiscrepancy = (sessionId: string) => {
    setLocalSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, status: "reported" } : s)
    )
    toast({ title: "Đã báo cáo văn phòng", description: "Văn phòng sẽ liên hệ để xác minh buổi học này.", variant: "destructive" })
  }

  const completedSessions = localSessions.filter((s: any) => s.status === "completed")
  const attendedCount = completedSessions.filter((s: any) => s.status === "completed").length

  const attendedSessions = localSessions.filter((s: any) => s.status === 'completed')
  const attendanceRate = completedSessions.length > 0
    ? (attendedSessions.length / (localSessions.filter((s: any) => ['completed', 'absent_student'].includes(s.status)).length)) * 100
    : 100

  const totalSessionsMock = 24
  const sessionsCompletedCount = localSessions.filter((s: any) => ['completed', 'absent_student'].includes(s.status)).length

  if (!classDetail) return <div>Đang tải...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{classDetail.subjectName}</h1>
          <p className="text-muted-foreground">Lớp {classDetail.grade}</p>
        </div>
        {classDetail.learningFormat === "online" && (
          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <a href="https://zoom.us/test" target="_blank" rel="noopener noreferrer">
              <Video className="h-4 w-4 mr-2" />
              Vào lớp học (Zoom)
            </a>
          </Button>
        )}
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
                <p className="text-2xl font-bold">{classSessions.length > 0 ? classSessions.length : totalSessionsMock}</p>
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
                <p className="text-2xl font-bold">{sessionsCompletedCount}</p>
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{attendanceRate.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ đi học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockMaterials.length}</p>
                <p className="text-sm text-muted-foreground">Tài liệu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Tabs defaultValue="sessions" className="space-y-4">
            <TabsList>
              <TabsTrigger value="sessions">Buổi học</TabsTrigger>
              <TabsTrigger value="materials">Tài liệu</TabsTrigger>
              <TabsTrigger value="progress">Tiến độ</TabsTrigger>
            </TabsList>

            <TabsContent value="sessions">
              <Card>
                <CardHeader>
                  <CardTitle>Lịch sử buổi học</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(localSessions.length > 0 ? localSessions : classSessions).map((session: any) => (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${session.status === "scheduled" ? "border-primary/30 bg-primary/5" : ""
                        }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${session.status === "completed"
                              ? "bg-green-100"
                              : session.status === "absent_student"
                                ? "bg-red-100"
                                : session.status === "pending_confirmation"
                                  ? "bg-amber-100"
                                  : session.status === "reported"
                                    ? "bg-gray-100"
                                    : "bg-blue-100"
                            }`}
                        >
                          {session.status === "completed" ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : session.status === "absent_student" ? (
                            <XCircle className="h-5 w-5 text-red-600" />
                          ) : session.status === "pending_confirmation" ? (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                          ) : session.status === "reported" ? (
                            <AlertCircle className="h-5 w-5 text-gray-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{session.topic}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(session.scheduledAt).toLocaleDateString("vi-VN")} - {session.duration} phút
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {session.status === "pending_confirmation" ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleConfirmAttendance(session.id)}
                            >
                              Xác nhận học
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReportDiscrepancy(session.id)}
                            >
                              Báo sai lệch
                            </Button>
                          </div>
                        ) : session.status === "reported" ? (
                          <Badge variant="secondary">Đã báo sự cố</Badge>
                        ) : (
                          <Badge>
                            {session.status === "scheduled" ? "Sắp tới" : session.status === "completed" ? "Đã học" : "Vắng"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card>
                <CardHeader>
                  <CardTitle>Tài liệu học tập</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockMaterials.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-10 w-10 rounded-lg flex items-center justify-center ${material.type === "pdf" ? "bg-red-100" : "bg-blue-100"
                            }`}
                        >
                          {material.type === "pdf" ? (
                            <FileText className="h-5 w-5 text-red-600" />
                          ) : (
                            <Play className="h-5 w-5 text-blue-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{material.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {material.size} - {material.date}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toast({ title: "Đang tải xuống", description: `Đang tải xuống ${material.name}...` })}>
                        Tải xuống
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ học tập</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Hoàn thành khóa học</span>
                      <span className="font-medium">
                        {((sessionsCompletedCount / totalSessionsMock) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <Progress
                      value={(sessionsCompletedCount / totalSessionsMock) * 100}
                      className="h-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                      <p className="text-2xl font-bold text-green-600">{attendedSessions.length}</p>
                      <p className="text-sm text-green-700">Buổi đi học</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-center">
                      <p className="text-2xl font-bold text-red-600">{sessionsCompletedCount - attendedSessions.length}</p>
                      <p className="text-sm text-red-700">Buổi vắng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar - Tutor Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Thông tin gia sư</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {(classDetail.assignedTutorName || 'G').charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-lg">{classDetail.assignedTutorName}</p>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">4.9</span>
                    <span className="text-muted-foreground">(56 đánh giá)</span>
                  </div>
                  <p className="text-sm text-muted-foreground">5 năm kinh nghiệm</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:0901234567`} className="hover:text-primary">
                    0901234567
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:tutor@email.com`} className="hover:text-primary">
                    tutor@email.com
                  </a>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={() => toast({ title: "Đang mở tin nhắn...", description: "Hệ thống đang kết nối với gia sư." })}>
                Liên hệ gia sư
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lịch học</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="space-y-2">
                  {classDetail.preferredSchedule.map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="font-medium">Thứ {s.dayOfWeek}</span>
                      <Badge variant="secondary">{s.startTime} - {s.endTime}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  )
}
