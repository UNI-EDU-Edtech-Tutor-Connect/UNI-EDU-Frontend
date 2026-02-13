"use client"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest, updateSessionAttendanceRequest } from "@/store/slices/classes-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { Calendar, Clock, Video, MapPin, ChevronLeft, ChevronRight, BookOpen, CheckCircle, Users } from "lucide-react"
import Link from "next/link"
import type { ClassSession } from "@/types"

const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
const shortDayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export default function TutorSchedulePage() {
  const dispatch = useAppDispatch()
  const { sessions, isLoading } = useAppSelector((state) => state.classes)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [showSessionDialog, setShowSessionDialog] = useState(false)
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false)
  const [attendanceStatus, setAttendanceStatus] = useState(true)
  const [sessionNotes, setSessionNotes] = useState("")

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  // Get week dates
  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    startOfWeek.setDate(date.getDate() - date.getDay())
    startOfWeek.setHours(0, 0, 0, 0)

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      week.push(day)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)
  const today = new Date()

  // Get sessions for a specific date
  const getSessionsForDate = (date: Date) => {
    return sessions.filter((session) => {
      const sessionDate = new Date(session.scheduledAt)
      return sessionDate.toDateString() === date.toDateString()
    })
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newDate = new Date(currentWeek)
    newDate.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newDate)
  }

  const formatMonthYear = () => {
    const start = weekDates[0]
    const end = weekDates[6]
    if (start.getMonth() === end.getMonth()) {
      return start.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })
    }
    return `${start.toLocaleDateString("vi-VN", { month: "short" })} - ${end.toLocaleDateString("vi-VN", { month: "short", year: "numeric" })}`
  }

  const handleSessionClick = (session: ClassSession) => {
    setSelectedSession(session)
    setShowSessionDialog(true)
  }

  const handleStartAttendance = () => {
    setShowSessionDialog(false)
    setAttendanceStatus(true)
    setSessionNotes("")
    setShowAttendanceDialog(true)
  }

  const confirmAttendance = () => {
    if (!selectedSession) return

    dispatch(
      updateSessionAttendanceRequest({
        sessionId: selectedSession.id,
        status: attendanceStatus ? "attended" : "absent",
        notes: sessionNotes,
      }),
    )
    setShowAttendanceDialog(false)
    setSelectedSession(null)
  }

  // Get upcoming sessions for today
  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.scheduledAt)
    return sessionDate.toDateString() === today.toDateString()
  })

  // Helper to get formatted status/type
  const getSessionFormat = (session: ClassSession) => {
    // Usually this would come from the class details, but assuming it's merged or available
    // For now, defaulting logic as strict mapping might require joining with class data
    // Assuming mock data structure had 'format', but ClassSession has just basic info.
    // In a real app we would join with class data. For now let's assume always online for demo
    return "online"
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lịch dạy</h1>
          <p className="text-muted-foreground">Quản lý và xem lịch giảng dạy của bạn</p>
        </div>
        <Button variant="outline" onClick={() => setCurrentWeek(new Date())}>
          Hôm nay
        </Button>
      </div>

      {/* Today's Sessions */}
      {todaySessions.length > 0 && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Buổi học hôm nay ({todaySessions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {todaySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-4 rounded-lg bg-background border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleSessionClick(session)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      {/* Note: ClassSession lacks subject/studentName directly, usually joined.
                          Using placeholders or if backend hydrates them.
                          Mock data puts them in 'session'.
                      */}
                      <p className="font-semibold">{session.notes || "Buổi học"}</p>
                      <p className="text-sm text-muted-foreground">
                        Học sinh ID: {session.studentId}
                      </p>
                    </div>
                    <Badge variant="default">Online</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(session.scheduledAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    {" - "}
                    {new Date(new Date(session.scheduledAt).getTime() + session.duration * 60000).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Calendar Navigation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">{formatMonthYear()}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Week Grid */}
          <div className="grid grid-cols-7 gap-2">
            {weekDates.map((date, index) => {
              const isToday = date.toDateString() === today.toDateString()
              const daySessions = getSessionsForDate(date)

              return (
                <div
                  key={index}
                  className={`min-h-[200px] rounded-lg border p-2 ${isToday ? "border-primary bg-primary/5" : "bg-card"}`}
                >
                  <div className="text-center mb-2">
                    <p className={`text-xs font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                      {shortDayNames[index]}
                    </p>
                    <p
                      className={`text-lg font-bold ${isToday ? "text-primary" : ""} ${date < today && !isToday ? "text-muted-foreground" : ""}`}
                    >
                      {date.getDate()}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {daySessions.map((session) => (
                      <div
                        key={session.id}
                        className={`p-2 rounded text-xs cursor-pointer transition-colors border ${session.status === 'completed' ? 'bg-green-100 border-green-200 text-green-800' :
                            session.status === 'scheduled' ? 'bg-primary/10 border-primary/20 hover:bg-primary/20' :
                              'bg-gray-100'
                          }`}
                        onClick={() => handleSessionClick(session)}
                      >
                        <p className="font-medium truncate">{session.notes || "Buổi học"}</p>
                        <p className="text-muted-foreground truncate">{session.id}</p>
                        <p className="text-muted-foreground">
                          {new Date(session.scheduledAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Session Detail Dialog */}
      <Dialog open={showSessionDialog} onOpenChange={setShowSessionDialog}>
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
                    <h3 className="font-semibold text-lg">{selectedSession.classId}</h3>
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
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Học sinh ID: <strong>{selectedSession.studentId}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedSession.scheduledAt).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(selectedSession.scheduledAt).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {" - "}
                      {new Date(new Date(selectedSession.scheduledAt).getTime() + selectedSession.duration * 60000).toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium mb-1">Ghi chú</p>
                <p className="text-sm text-muted-foreground">{selectedSession.notes || "Không có ghi chú"}</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href={`/dashboard/tutor/classes/${selectedSession.classId}`}>Xem lớp học</Link>
                </Button>
                {selectedSession.status === 'scheduled' && (
                  <Button className="flex-1" onClick={handleStartAttendance}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Điểm danh
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Điểm danh buổi học</DialogTitle>
            <DialogDescription>
              Xác nhận thông tin điểm danh cho buổi học
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
                    <p className="text-sm text-muted-foreground">Học sinh tham gia</p>
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
            <Button onClick={confirmAttendance} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xác nhận điểm danh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
