"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchTestsRequest, fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { fetchStudentScheduleRequest } from "@/store/slices/student-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BookOpen, Clock, Trophy, Target, Calendar, Play, FileText, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function StudentDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { classRequests } = useSelector((state: RootState) => state.classes)

  const { tests, completedTests, availableTests: availableTestsStore } = useSelector((state: RootState) => state.tests)
  const { schedule } = useSelector((state: RootState) => state.student)
  // const { user } = useSelector((state: RootState) => state.auth) // Already present

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchTestsRequest())
    dispatch(fetchStudentScheduleRequest())
    if (user?.id) {
      dispatch(fetchCompletedTestsRequest(user.id))
      // Use existing action for available tests
      dispatch({ type: "tests/fetchAvailableTestsRequest", payload: user.id })
    }
  }, [dispatch, user?.id])

  const upcomingSchedule = schedule || []
  const recentResults = completedTests || []
  const myClasses = (classRequests || []).filter((c: any) => c.studentId === (user?.id || ""))

  const formattedAvailableTests = availableTestsStore && availableTestsStore.length > 0
    ? availableTestsStore.map((t: any) => ({
      ...t,
      title: t.className || t.title || "Bài kiểm tra",
      questionsCount: typeof t.questions === "number" ? t.questions : t.questions?.length || 0
    }))
    : (tests || []).filter((t: any) => t.status === "published" || !t.status).map((t: any) => ({
      ...t,
      questionsCount: t.questions?.length || 0
    }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Xin chào, {user?.fullName || "Học sinh"}!</h1>
        <p className="text-muted-foreground mt-1">Chào mừng trở lại. Hãy tiếp tục học tập nhé!</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Lớp đang học"
          value={myClasses.length.toString()}
          description="Đang hoạt động"
          icon={<BookOpen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Giờ học tuần này"
          value="12"
          description="+3 giờ so với tuần trước"
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 25, isPositive: true }}
        />
        <StatsCard
          title="Bài kiểm tra"
          value={formattedAvailableTests.length.toString()}
          description="Có thể làm"
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Điểm trung bình"
          value="8.2"
          description="Tháng này"
          icon={<Trophy className="h-4 w-4 text-muted-foreground" />}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch học sắp tới
            </CardTitle>
            <CardDescription>Các buổi học trong tuần</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedule.map((schedule: any) => (
                <div
                  key={schedule.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{schedule.subject}</h4>
                      <p className="text-sm text-muted-foreground">Gia sư: {schedule.tutor}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{schedule.startTime} - {schedule.endTime}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary">{schedule.date || "Sắp tới"}</Badge>
                      <Badge variant={schedule.type === "online" ? "outline" : "secondary"}>
                        {schedule.type === "online" ? "Online" : "Tại nhà"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/student/schedule">Xem lịch đầy đủ</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Mục tiêu tuần này
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Hoàn thành bài tập</span>
                <span className="font-medium">8/10</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Giờ học</span>
                <span className="font-medium">12/15 giờ</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Bài kiểm tra</span>
                <span className="font-medium">3/5 bài</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Điểm mục tiêu</span>
                <span className="font-medium">8.5/10</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Bài kiểm tra có sẵn
            </CardTitle>
            <CardDescription>Làm bài để đánh giá năng lực</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formattedAvailableTests.slice(0, 4).map((test) => (
                <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{test.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {test.duration} phút - {test.questionsCount} câu hỏi
                    </p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/dashboard/student/tests/${test.id}/start`}>Làm bài</Link>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/student/tests">Xem tất cả</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Kết quả gần đây
            </CardTitle>
            <CardDescription>Điểm số các bài kiểm tra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentResults.map((result: any) => (
                <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{result.className || result.test}</h4>
                    <p className="text-sm text-muted-foreground">{result.completedAt || result.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">
                      {result.score}
                    </p>
                    <p className="text-sm text-muted-foreground">{result.passed ? "Đạt" : "Chưa đạt"}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/student/results">Xem tất cả kết quả</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lớp học của tôi</CardTitle>
          <CardDescription>Các lớp bạn đang tham gia</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {myClasses.length > 0 ? (
              myClasses.map((cls: any) => (
                <div key={cls.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Badge>{cls.subjectName}</Badge>
                    <Badge variant={cls.status === "in_progress" ? "default" : "secondary"}>
                      {cls.status === "in_progress" ? "Đang học" : cls.status}
                    </Badge>
                  </div>
                  <h4 className="font-semibold mb-1">
                    {cls.subjectName} - Lớp {cls.grade}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {cls.preferredSchedule.map((s: any) => `${s.dayOfWeek === 1 ? "CN" : "T" + s.dayOfWeek}: ${s.startTime}-${s.endTime}`).join(", ")}
                  </p>
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src="/tutor-session.png" />
                      <AvatarFallback>T</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">Gia sư: {cls.assignedTutorName || "Chưa có"}</span>
                  </div>
                  <Button size="sm" className="w-full" asChild>
                    <Link href={`/dashboard/student/classes/${cls.id}`}>Chi tiết</Link>
                  </Button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Bạn chưa đăng ký lớp học nào</p>
                <Button className="mt-4" asChild>
                  <Link href="/dashboard/student/find-tutor">Tìm gia sư</Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

}
