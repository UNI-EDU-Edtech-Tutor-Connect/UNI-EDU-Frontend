"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchTutorStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Users, Wallet, Star, Calendar, Clock, ArrowRight, TrendingUp } from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

export default function TutorDashboard() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { classRequests, sessions } = useAppSelector((state) => state.classes)
  const { tutorStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)

  useEffect(() => {
    dispatch(fetchClassesRequest())
    if (user?.id) {
      dispatch(fetchTutorStatsRequest(user.id))
    }
  }, [dispatch, user?.id])

  // Default stats while loading
  const stats = tutorStats || {
    activeClasses: 0,
    totalStudents: 0,
    monthlyEarnings: 0,
    averageRating: 0,
    upcomingSessions: 0,
    completedSessions: 0,
  }

  const myClasses = classRequests.filter((c) => c.assignedTutorId === user?.id || c.status === "in_progress")
  const upcomingSessions = sessions.filter((s) => s.status === "scheduled").slice(0, 5)
  const availableClasses = classRequests.filter((c) => c.status === "open")

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Xin chào, {user?.fullName}!</h1>
          <p className="text-muted-foreground">Đây là tổng quan hoạt động giảng dạy của bạn</p>
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
              <Button variant="outline" size="sm">
                Xem tất cả
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có lịch dạy</p>
              </div>
            ) : (
              upcomingSessions.map((session) => {
                const classInfo = classRequests.find((c) => c.id === session.classId)
                return (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{classInfo?.subjectName || "Lớp học"}</p>
                        <p className="text-sm text-muted-foreground">{classInfo?.studentName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{new Date(session.scheduledAt).toLocaleDateString("vi-VN")}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(session.scheduledAt).toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <Button size="sm">Vào lớp</Button>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Monthly Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tiến độ tháng này</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Buổi đã dạy</span>
                <span className="font-medium">
                  {stats.completedSessions}/{stats.completedSessions + stats.upcomingSessions}
                </span>
              </div>
              <Progress value={(stats.completedSessions / (stats.completedSessions + stats.upcomingSessions || 1)) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thu nhập</span>
                <span className="font-medium">{formatCurrency(stats.monthlyEarnings)}</span>
              </div>
              <Progress value={75} className="bg-success/20" />
              <p className="text-xs text-muted-foreground">75% so với mục tiêu</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success font-medium">+15%</span>
                <span className="text-muted-foreground">so với tháng trước</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Classes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Lớp đang cần gia sư</CardTitle>
          <Badge variant="secondary">{availableClasses.length} lớp</Badge>
        </CardHeader>
        <CardContent>
          {availableClasses.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">Không có lớp nào đang tìm gia sư</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableClasses.slice(0, 6).map((classItem) => (
                <div key={classItem.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{classItem.subjectName}</h3>
                      <p className="text-sm text-muted-foreground">Lớp {classItem.grade}</p>
                    </div>
                    <StatusBadge status={classItem.status} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Học sinh:</span>
                      <span>{classItem.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hình thức:</span>
                      <Badge variant="outline">{classItem.learningFormat}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Học phí:</span>
                      <span className="font-medium text-accent">{formatCurrency(classItem.monthlyBudget)}/tháng</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" size="sm">
                    Đăng ký nhận lớp
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
