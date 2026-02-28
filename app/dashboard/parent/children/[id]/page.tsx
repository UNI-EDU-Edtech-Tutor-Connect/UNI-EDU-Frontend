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
  BookOpen,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Phone,
  Video,
  AlertCircle
} from "lucide-react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchChildDetailsRequest } from "@/store/slices/users-slice"
import { useToast } from "@/components/ui/use-toast"

export default function ChildDetailPage() {
  const router = useRouter()
  const params = useParams()
  const dispatch = useDispatch()
  const { id } = params
  const { toast } = useToast()

  const { childDetails, isLoading } = useSelector((state: RootState) => state.users)
  const childData = id ? childDetails[id as string] : null

  useEffect(() => {
    if (id) {
      dispatch(fetchChildDetailsRequest(id as string))
    }
  }, [dispatch, id])

  if (!childData) {
    return <div className="p-8 text-center">Đang tải thông tin...</div>
  }

  // Map API data to component structure
  const mockChild = {
    id: childData.id,
    name: childData.name,
    grade: childData.grade,
    school: childData.school,
    phone: "0901234567", // Mock for now if not in API
    email: "email@example.com", // Mock for now
  }

  const mockClasses = childData.classes?.map((c: any) => ({
    id: c.id,
    subject: c.subject,
    tutor: { name: c.tutor, phone: "N/A", rating: 5.0 },
    schedule: c.schedule,
    type: "online", // Mock
    sessionsCompleted: c.sessionsCompleted,
    totalSessions: c.totalSessions,
    attendance: c.attendance,
    monthlyFee: 0 // Not in ParentChildDetail
  })) || []

  const mockResults = childData.recentResults?.map((r: any) => ({
    id: r.id,
    test: r.test,
    score: r.score,
    total: r.total,
    date: r.date
  })) || []

  const [localSessions, setLocalSessions] = useState<any[]>([])

  useEffect(() => {
    if (childData) {
      setLocalSessions([
        {
          id: "pending-confirm-test",
          date: "Hôm nay",
          subject: "Toán học",
          time: "18:00 - 19:30",
          status: "pending_confirmation",
          attended: null
        },
        ...(childData.upcomingClasses?.map((c: any, index: any) => ({
          id: `s-${index}`,
          date: c.date,
          subject: c.subject,
          time: c.time,
          status: "scheduled",
          attended: null
        })) || [])
      ])
    }
  }, [childData])

  const handleConfirmAttendance = (sessionId: string) => {
    setLocalSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, status: "completed", attended: true } : s)
    )
    toast({ title: "Đã xác nhận", description: "Cảm ơn phụ huynh đã xác nhận điểm danh." })
  }

  const handleReportDiscrepancy = (sessionId: string) => {
    setLocalSessions(prev =>
      prev.map(s => s.id === sessionId ? { ...s, status: "reported" } : s)
    )
    toast({ title: "Đã báo cáo văn phòng", description: "Văn phòng sẽ liên hệ để xác minh buổi học này.", variant: "destructive" })
  }

  const totalFee = 0 // Data not available yet
  const avgAttendance = mockClasses.length > 0
    ? mockClasses.reduce((sum: any, c: any) => sum + c.attendance, 0) / mockClasses.length
    : 0
  const avgScore = mockResults.length > 0
    ? mockResults.reduce((sum: any, r: any) => sum + (r.score / r.total) * 100, 0) / mockResults.length
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{mockChild.name}</h1>
          <p className="text-muted-foreground">
            {mockChild.grade} - {mockChild.school}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp đang học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgAttendance.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Chuyên cần</p>
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
                <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Điểm TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalFee)}</p>
                <p className="text-sm text-muted-foreground">Học phí/tháng</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="classes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classes">Lớp học</TabsTrigger>
          <TabsTrigger value="schedule">Lịch học</TabsTrigger>
          <TabsTrigger value="results">Kết quả</TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-4">
          {mockClasses.map((cls: any) => (
            <Card key={cls.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{cls.subject}</h3>
                    <p className="text-sm text-muted-foreground">{cls.schedule}</p>
                  </div>
                  <Badge variant={cls.type === "online" ? "default" : "secondary"}>
                    {cls.type === "online" ? (
                      <>
                        <Video className="h-3 w-3 mr-1" /> Online
                      </>
                    ) : (
                      "Offline"
                    )}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">{cls.tutor.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{cls.tutor.name}</p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{cls.tutor.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-1" />
                    Liên hệ
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold">
                      {cls.sessionsCompleted}/{cls.totalSessions}
                    </p>
                    <p className="text-xs text-muted-foreground">Buổi học</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-green-600">{cls.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Chuyên cần</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50 text-center">
                    <p className="text-lg font-bold text-accent">{formatCurrency(cls.monthlyFee)}</p>
                    <p className="text-xs text-muted-foreground">Học phí</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tiến độ khóa học</span>
                    <span>{((cls.sessionsCompleted / cls.totalSessions) * 100).toFixed(0)}%</span>
                  </div>
                  <Progress value={(cls.sessionsCompleted / cls.totalSessions) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lịch sử buổi học</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {localSessions.map((session: any) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${session.status === "scheduled" ? "border-primary/30 bg-primary/5" : ""
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${session.status === "scheduled"
                        ? "bg-blue-100"
                        : session.status === "pending_confirmation"
                          ? "bg-amber-100"
                          : session.status === "reported"
                            ? "bg-gray-100"
                            : session.attended
                              ? "bg-green-100"
                              : "bg-red-100"
                        }`}
                    >
                      {session.status === "scheduled" ? (
                        <Clock className="h-5 w-5 text-blue-600" />
                      ) : session.status === "pending_confirmation" ? (
                        <AlertCircle className="h-5 w-5 text-amber-600" />
                      ) : session.status === "reported" ? (
                        <AlertCircle className="h-5 w-5 text-gray-600" />
                      ) : session.attended ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{session.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        {session.date} - {session.time}
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
                          Xác nhận
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReportDiscrepancy(session.id)}
                        >
                          Báo sai
                        </Button>
                      </div>
                    ) : session.status === "reported" ? (
                      <Badge variant="secondary">Đã báo sự cố</Badge>
                    ) : (
                      <Badge
                        variant={session.status === "scheduled" ? "outline" : session.attended ? "default" : "destructive"}
                      >
                        {session.status === "scheduled" ? "Sắp tới" : session.attended ? "Đã học" : "Vắng"}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Kết quả kiểm tra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockResults.map((result: any) => {
                const percentage = (result.score / result.total) * 100
                return (
                  <div key={result.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-10 w-10 rounded-lg flex items-center justify-center ${percentage >= 70 ? "bg-green-100" : "bg-red-100"
                          }`}
                      >
                        {percentage >= 70 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{result.test}</p>
                        <p className="text-sm text-muted-foreground">{result.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${percentage >= 70 ? "text-green-600" : "text-red-600"}`}>
                        {result.score}/{result.total}
                      </p>
                      <p className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
