"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Clock, Video, MapPin, Star, ArrowRight, Users } from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { useEffect } from "react"

export default function StudentClassesPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { classRequests: classes, sessions } = useSelector((state: RootState) => state.classes) // Alias classRequests as classes for now, but really should be specific

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const myClasses = (classes || []).filter((c) => c.studentId === (user?.id || ""))
  const activeClasses = myClasses.filter((c) => c.status === "in_progress")
  const completedClasses = myClasses.filter((c) => c.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lớp học của tôi</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tiến độ các lớp đang học</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student/find-tutor">
            <Users className="h-4 w-4 mr-2" />
            Tìm gia sư mới
          </Link>
        </Button>
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
                <p className="text-sm text-muted-foreground">Lớp đang học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{
                  activeClasses.reduce((sum, c) => {
                    const classSessions = sessions.filter(s => s.classId === c.id && s.status === 'completed')
                    return sum + classSessions.length
                  }, 0)
                }</p>
                <p className="text-sm text-muted-foreground">Buổi đã học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Classes */}
      {activeClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lớp đang học</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeClasses.map((cls) => {
              const classSessions = sessions.filter(s => s.classId === cls.id)
              const sessionsCompleted = classSessions.filter(s => s.status === 'completed').length
              const totalSessions = 24 // Mock total
              return (
                <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">Lớp {cls.grade}</Badge>
                      <Badge className="bg-green-100 text-green-800">Đang học</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{cls.subjectName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tutor Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">{(cls.assignedTutorName || 'G').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{cls.assignedTutorName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {cls.learningFormat === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      <span>{cls.learningFormat === "online" ? "Học online" : "Học tại nhà"}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cls.preferredSchedule.map((s: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s.dayOfWeek === 1 ? "CN" : "Thứ " + s.dayOfWeek} {s.startTime}-{s.endTime}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="font-medium">
                          {sessionsCompleted}/{totalSessions} buổi
                        </span>
                      </div>
                      <Progress value={(sessionsCompleted / totalSessions) * 100} className="h-2" />
                    </div>

                    {/* Next Session */}
                    {/* Mock next session logic */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Buổi tiếp theo</p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Chưa lên lịch</span>
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/student/classes/${cls.id}`}>
                        Chi tiết lớp
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lớp đã hoàn thành</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedClasses.map((cls) => {
              const classSessions = sessions.filter(s => s.classId === cls.id)
              return (
                <Card key={cls.id} className="opacity-80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{cls.subjectName}</p>
                          <p className="text-sm text-muted-foreground">
                            {cls.assignedTutorName} - {classSessions.length} buổi
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary">Hoàn thành</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
