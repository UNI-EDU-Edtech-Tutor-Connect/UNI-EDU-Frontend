"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { BookOpen, Users, Calendar, Video, MapPin, ArrowRight } from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export default function TeacherClassesPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { classRequests } = useAppSelector((state) => state.classes)

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const myClasses = classRequests.filter((c) => c.assignedTutorId === user?.id || c.status === "in_progress")

  const activeClasses = myClasses.filter((c) => c.status === "in_progress")
  const completedClasses = myClasses.filter((c) => c.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lớp học của tôi</h1>
          <p className="text-muted-foreground">Quản lý các lớp học đang giảng dạy</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp đang dạy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {myClasses.reduce((sum, c) => sum + (c.studentIds?.length || 1), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Tổng học sinh</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp đã hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {myClasses.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline">{classItem.subjectName}</Badge>
                <StatusBadge status={classItem.status} />
              </div>
              <CardTitle className="text-lg mt-2">
                {classItem.subjectName} - Lớp {classItem.grade}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{classItem.studentName}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {classItem.learningFormat === "online" ? (
                  <>
                    <Video className="h-4 w-4" />
                    <span>Học online</span>
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4" />
                    <span>{classItem.location || "Tại nhà học sinh"}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {classItem.preferredSchedule.slice(0, 2).map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {dayNames[s.dayOfWeek]} {s.startTime}-{s.endTime}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-sm text-muted-foreground">Học phí/tháng</span>
                <span className="font-semibold text-accent">{formatCurrency(classItem.monthlyBudget)}</span>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/dashboard/teacher/classes/${classItem.id}`}>
                  Chi tiết lớp
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {myClasses.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có lớp học</h3>
            <p className="text-muted-foreground">Bạn chưa được phân công lớp học nào</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
