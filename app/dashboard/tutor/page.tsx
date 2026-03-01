"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest, registerForClassRequest } from "@/store/slices/classes-slice"
import { fetchTutorStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  BookOpen, Users, Wallet, Star, Calendar, Clock,
  ArrowRight, TrendingUp, MapPin, CheckCircle2,
  XCircle, Loader2, FileText, Sparkles, Target,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"
import type { ClassRequest } from "@/types"

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

const formatLearning = (f: string) => {
  if (f === "online") return "Trực tuyến"
  if (f === "offline") return "Trực tiếp"
  return "Kết hợp"
}

export default function TutorDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { classRequests, sessions, isLoading: classLoading } = useAppSelector((state) => state.classes)
  const { tutorStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)
  const { toast } = useToast()

  // Register class states
  const [selectedClass, setSelectedClass] = useState<ClassRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [registeringId, setRegisteringId] = useState<string | null>(null)
  const [resultModal, setResultModal] = useState<{
    open: boolean; success: boolean; className: string; message?: string
  }>({ open: false, success: false, className: "" })

  useEffect(() => {
    dispatch(fetchClassesRequest())
    if (user?.id) dispatch(fetchTutorStatsRequest(user.id))
  }, [dispatch, user?.id])

  const stats = tutorStats || {
    activeClasses: 0, totalStudents: 0, monthlyEarnings: 0,
    averageRating: 0, upcomingSessions: 0, completedSessions: 0,
  }

  const myClasses = classRequests.filter(
    (c) => c.assignedTutorId === user?.id || c.status === "in_progress"
  )
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled").slice(0, 4)
  const availableClasses = classRequests.filter((c) => c.status === "open")

  const sessionProgress = stats.completedSessions + stats.upcomingSessions > 0
    ? Math.round((stats.completedSessions / (stats.completedSessions + stats.upcomingSessions)) * 100)
    : 0

  const handleRegister = (classItem: ClassRequest) => {
    setSelectedClass(classItem)
    setDetailOpen(true)
  }

  const handleConfirmRegister = async () => {
    if (!selectedClass || !user?.id) return
    const className = `${selectedClass.subjectName} - Lớp ${selectedClass.grade}`
    setRegisteringId(selectedClass.id)
    setDetailOpen(false)

    try {
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => Math.random() > 0.15 ? resolve() : reject(new Error("Lớp đã có gia sư nhận")), 1400)
      )
      dispatch(registerForClassRequest({ classId: selectedClass.id, tutorId: user.id }))
      setResultModal({ open: true, success: true, className })
    } catch (err: any) {
      setResultModal({ open: true, success: false, className, message: err.message })
    } finally {
      setRegisteringId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Xin chào, {user?.fullName}! 👋</h1>
          <p className="text-muted-foreground">Tổng quan hoạt động giảng dạy của bạn hôm nay</p>
        </div>
        <Link href="/dashboard/tutor/classes">
          <Button className="bg-accent hover:bg-accent/90">
            Tìm lớp mới
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Lớp đang dạy"
          value={statsLoading ? "..." : stats.activeClasses}
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: 2, isPositive: true }}
        />
        <StatsCard
          title="Học sinh"
          value={statsLoading ? "..." : stats.totalStudents}
          icon={<Users className="h-6 w-6" />}
        />
        <StatsCard
          title="Thu nhập tháng"
          value={statsLoading ? "..." : formatCurrency(stats.monthlyEarnings)}
          icon={<Wallet className="h-6 w-6" />}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Đánh giá"
          value={statsLoading ? "..." : `${stats.averageRating}/5`}
          description={`${stats.completedSessions} buổi hoàn thành`}
          icon={<Star className="h-6 w-6" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Lịch dạy sắp tới</CardTitle>
            <Link href="/dashboard/tutor/schedule">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-40" />
                <p className="font-medium">Chưa có lịch dạy</p>
                <p className="text-sm mt-1">Hãy đăng ký nhận lớp để bắt đầu</p>
              </div>
            ) : (
              upcomingSessions.map((session) => {
                const classInfo = classRequests.find((c) => c.id === session.classId)
                const scheduledDate = new Date(session.scheduledAt)
                return (
                  <div
                    key={session.id}
                    className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:bg-muted/40 transition-colors group"
                  >
                    <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary shrink-0">
                      <span className="text-xs font-bold">{scheduledDate.toLocaleDateString("vi-VN", { day: "2-digit" })}</span>
                      <span className="text-[10px]">{scheduledDate.toLocaleDateString("vi-VN", { month: "short" })}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{classInfo?.subjectName || "Lớp học"}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {scheduledDate.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                        {classInfo?.studentName && ` · ${classInfo.studentName}`}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => toast({ title: "Đang vào lớp...", description: "Hệ thống đang kết nối đến phòng học ảo." })}
                    >
                      Vào lớp
                    </Button>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Tiến độ tháng này
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Buổi đã dạy</span>
                <span className="font-semibold">{stats.completedSessions}/{stats.completedSessions + stats.upcomingSessions}</span>
              </div>
              <Progress value={sessionProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{sessionProgress}% hoàn thành</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thu nhập</span>
                <span className="font-semibold">{formatCurrency(stats.monthlyEarnings)}</span>
              </div>
              <Progress value={75} className="h-2" />
              <p className="text-xs text-muted-foreground">75% so với mục tiêu tháng</p>
            </div>

            <div className="pt-2 border-t space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-green-500" /> So tháng trước
                </span>
                <span className="text-green-600 font-semibold">+15%</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Buổi sắp tới</span>
                <Badge variant="secondary">{stats.upcomingSessions} buổi</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Đánh giá TB</span>
                <div className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-semibold">{stats.averageRating}/5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Classes — Đăng ký nhận lớp */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-accent" />
              Lớp đang cần gia sư
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">Đăng ký nhận lớp phù hợp với bạn</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-accent/10 text-accent">{availableClasses.length} lớp</Badge>
            <Link href="/dashboard/tutor/classes">
              <Button variant="outline" size="sm">Xem tất cả</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {availableClasses.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>Hiện tại không có lớp nào đang tìm gia sư</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableClasses.slice(0, 6).map((classItem) => (
                <div
                  key={classItem.id}
                  className="group p-4 rounded-xl border bg-card hover:border-accent/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm">{classItem.subjectName}</h3>
                        <p className="text-xs text-muted-foreground">Lớp {classItem.grade}</p>
                      </div>
                    </div>
                    <StatusBadge status={classItem.status} />
                  </div>

                  <div className="space-y-1.5 text-xs mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Học sinh</span>
                      <span className="font-medium">{classItem.studentName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hình thức</span>
                      <Badge variant="outline" className="text-xs py-0">{formatLearning(classItem.learningFormat)}</Badge>
                    </div>
                    {classItem.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Khu vực</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{classItem.location}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Lịch</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {classItem.preferredSchedule.slice(0, 2).map((s, i) => (
                          <Badge key={i} variant="secondary" className="text-[10px] py-0">
                            {dayNames[s.dayOfWeek]} {s.startTime}
                          </Badge>
                        ))}
                        {classItem.preferredSchedule.length > 2 && (
                          <Badge variant="secondary" className="text-[10px] py-0">+{classItem.preferredSchedule.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t flex items-center justify-between">
                    <span className="font-bold text-accent text-sm">{formatCurrency(classItem.monthlyBudget)}<span className="text-xs font-normal text-muted-foreground">/tháng</span></span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => { setSelectedClass(classItem); setDetailOpen(true) }}
                      >
                        <FileText className="h-3 w-3 mr-1" />
                        Chi tiết
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-accent hover:bg-accent/90"
                        disabled={registeringId === classItem.id}
                        onClick={() => handleRegister(classItem)}
                      >
                        {registeringId === classItem.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : "Đăng ký"}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail & Confirm Register Dialog */}
      <Dialog open={detailOpen} onOpenChange={(o) => !registeringId && setDetailOpen(o)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {selectedClass?.subjectName} – Lớp {selectedClass?.grade}
            </DialogTitle>
            <DialogDescription>Xem chi tiết và xác nhận đăng ký nhận lớp này</DialogDescription>
          </DialogHeader>
          {selectedClass && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/50 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Học sinh</p>
                  <p className="font-semibold">{selectedClass.studentName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Học phí</p>
                  <p className="font-bold text-accent">{formatCurrency(selectedClass.monthlyBudget)}/tháng</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Hình thức</p>
                  <Badge variant="outline">{formatLearning(selectedClass.learningFormat)}</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs mb-0.5">Khối lớp</p>
                  <p className="font-semibold">Lớp {selectedClass.grade}</p>
                </div>
                {selectedClass.location && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground text-xs mb-0.5">Địa điểm</p>
                    <p className="font-medium flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{selectedClass.location}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground text-xs mb-1">Lịch học mong muốn</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedClass.preferredSchedule.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {dayNames[s.dayOfWeek]} {s.startTime}–{s.endTime}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {selectedClass.requirements && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 dark:bg-amber-950/20 dark:border-amber-800">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">Yêu cầu đặc biệt</p>
                  <p className="text-sm text-amber-900 dark:text-amber-300">{selectedClass.requirements}</p>
                </div>
              )}

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 text-xs text-blue-800 dark:text-blue-300">
                ℹ️ Sau khi đăng ký, phụ huynh sẽ được thông báo và xác nhận. Học phí 10% đặt cọc sẽ được yêu cầu để chốt lớp.
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="outline" className="flex-1" onClick={() => setDetailOpen(false)}>Hủy</Button>
                <Button
                  className="flex-1 bg-accent hover:bg-accent/90"
                  disabled={!!registeringId}
                  onClick={handleConfirmRegister}
                >
                  {registeringId ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang đăng ký...
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Xác nhận đăng ký
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Result Dialog */}
      <Dialog open={resultModal.open} onOpenChange={(o) => setResultModal((p) => ({ ...p, open: o }))}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            {resultModal.success ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Đăng ký thành công!</h3>
                  <p className="text-sm text-muted-foreground">
                    Bạn đã đăng ký nhận lớp <span className="font-semibold text-foreground">{resultModal.className}</span>.
                    Phụ huynh sẽ được thông báo ngay.
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setResultModal((p) => ({ ...p, open: false }))}>
                    Đóng
                  </Button>
                  <Button className="flex-1 bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href="/dashboard/tutor/classes">Xem lớp của tôi</Link>
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <XCircle className="h-9 w-9 text-red-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold">Đăng ký thất bại!</h3>
                  <p className="text-sm text-muted-foreground">
                    {resultModal.message || "Không thể đăng ký lớp"} <span className="font-semibold text-foreground">{resultModal.className}</span>.
                    Vui lòng thử lại sau.
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button variant="outline" className="flex-1" onClick={() => setResultModal((p) => ({ ...p, open: false }))}>
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setResultModal((p) => ({ ...p, open: false }))
                      if (selectedClass) handleRegister(selectedClass)
                    }}
                  >
                    Thử lại
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
