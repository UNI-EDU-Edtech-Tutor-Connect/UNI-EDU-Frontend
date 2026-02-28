"use client"

import { useEffect, useState, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchParentChildrenRequest } from "@/store/slices/users-slice"
import { fetchChildReportRequest } from "@/store/slices/stats-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart3, TrendingUp, Calendar, BookOpen, Download, Star, Clock, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

const progressData = [
  { month: "T9", math: 6.5, physics: 7.0, english: 5.5, target: 8.0 },
  { month: "T10", math: 7.0, physics: 7.2, english: 6.0, target: 8.0 },
  { month: "T11", math: 7.5, physics: 7.5, english: 6.5, target: 8.0 },
  { month: "T12", math: 8.2, physics: 8.0, english: 7.2, target: 8.0 },
  { month: "T1", math: 8.5, physics: 8.4, english: 7.5, target: 8.0 },
  { month: "T2", math: 8.8, physics: 8.5, english: 8.0, target: 8.0 },
]

export default function ParentReportsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { parentChildren, isLoading: isLoadingChildren } = useAppSelector((state) => state.users)
  const { childReport: report, isLoading: isLoadingReport } = useAppSelector((state) => state.stats)

  const [selectedChild, setSelectedChild] = useState<string>("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [subject, setSubject] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchParentChildrenRequest(user.id))
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    if (parentChildren.length > 0 && !selectedChild) {
      setSelectedChild(parentChildren[0].id)
    }
  }, [parentChildren, selectedChild])

  useEffect(() => {
    if (selectedChild) {
      dispatch(fetchChildReportRequest({ childId: selectedChild, period: selectedPeriod }))
    }
  }, [dispatch, selectedChild, selectedPeriod])

  const currentChild = parentChildren.find((c) => c.id === selectedChild)
  const isLoading = isLoadingChildren || isLoadingReport

  // Dynamic Analysis of Report Data
  const analysis = useMemo(() => {
    if (!report) return null

    const strengths: string[] = []
    const weaknesses: string[] = []
    const forecast: string = ""

    // Analyze Subjects
    const sortedSubjects = [...report.subjects].sort((a, b) => b.avgScore - a.avgScore)
    if (sortedSubjects.length > 0) {
      const best = sortedSubjects[0]
      if (best.avgScore >= 80) strengths.push(`Học lực môn ${best.name} rất tốt (${best.avgScore}%)`)

      const worst = sortedSubjects[sortedSubjects.length - 1]
      if (worst.avgScore < 65) weaknesses.push(`Cần cải thiện môn ${worst.name} (${worst.avgScore}%)`)
    }

    // Analyze Attendance
    const avgAttendance = report.summary.attended / report.summary.totalSessions * 100
    if (avgAttendance >= 90) strengths.push("Tỷ lệ chuyên cần cao, tham gia đầy đủ các buổi học")
    else if (avgAttendance < 80) weaknesses.push("Tỷ lệ chuyên cần thấp, cần tham gia học đầy đủ hơn")

    // Analyze Trend
    const recentScores = report.scores.map(s => s.value)
    if (recentScores.length >= 2) {
      const last = recentScores[recentScores.length - 1]
      const prev = recentScores[recentScores.length - 2]
      if (last > prev) strengths.push("Điểm số có xu hướng tiến bộ trong tháng gần nhất")
      else if (last < prev) weaknesses.push("Kết quả học tập có dấu hiệu giảm sút nhẹ")
    }

    // Forecast
    const currentAvg = report.summary.avgScore
    const projectedAvg = Math.min(100, Math.round(currentAvg * (1 + report.summary.improvement / 100)))
    const forecastText = `Với đà tiến bộ hiện tại (${report.summary.improvement > 0 ? '+' : ''}${report.summary.improvement}%), dự kiến điểm trung bình có thể đạt ${projectedAvg}% trong kỳ tới.`

    return { strengths, weaknesses, forecast: forecastText }
  }, [report])


  if (isLoading && !report) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    )
  }

  if (!currentChild && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-muted/20 border-dashed">
        <div className="rounded-full bg-muted p-4 mb-4">
          <AlertTriangle className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Chưa có thông tin học sinh</h3>
        <p className="text-muted-foreground mt-2">Vui lòng liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.</p>
      </div>
    )
  }

  if (!report || !currentChild) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Báo cáo học tập</h1>
          <p className="text-muted-foreground">Theo dõi tiến độ và kết quả chi tiết của {currentChild.name}</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => toast({ title: "Xuất báo cáo", description: "Báo cáo PDF đang được tải xuống..." })}>
          <Download className="h-4 w-4" />
          Xuất báo cáo PDF
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border shadow-sm">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Học sinh</label>
          <Select value={selectedChild} onValueChange={setSelectedChild}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn con" />
            </SelectTrigger>
            <SelectContent>
              {parentChildren.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Thời gian</label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Khoảng thời gian" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Tuần này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{report.summary.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Tổng buổi học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{report.summary.attended}</p>
                <p className="text-sm text-muted-foreground">Đã tham gia</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Star className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{report.summary.avgScore}%</p>
                <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-full flex items-center justify-center ${report.summary.improvement >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <TrendingUp className={`h-6 w-6 ${report.summary.improvement >= 0 ? 'text-emerald-600' : 'text-red-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${report.summary.improvement >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {report.summary.improvement > 0 ? '+' : ''}{report.summary.improvement}%
                </p>
                <p className="text-sm text-muted-foreground">So với tháng trước</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biểu Đồ Phát Triển Mới (Line Chart) */}
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Biểu Đồ Phát Triển</CardTitle>
              <CardDescription>Tiến bộ điểm trung bình theo thời gian (Chi tiết môn học)</CardDescription>
            </div>
            <Select defaultValue={subject} onValueChange={setSubject}>
              <SelectTrigger className="w-[180px] bg-background">
                <SelectValue placeholder="Chọn môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                <SelectItem value="math">Toán học</SelectItem>
                <SelectItem value="physics">Vật lý</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280' }} domain={[0, 10]} dx={-10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                {/* Target Line */}
                <Line
                  type="stepAfter"
                  name="Mục tiêu"
                  dataKey="target"
                  stroke="#ef4444"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />

                {/* Curves */}
                {(subject === "all" || subject === "math") && (
                  <Line
                    type="monotone"
                    name="Toán Học"
                    dataKey="math"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(subject === "all" || subject === "physics") && (
                  <Line
                    type="monotone"
                    name="Vật Lý"
                    dataKey="physics"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}
                {(subject === "all" || subject === "english") && (
                  <Line
                    type="monotone"
                    name="Tiếng Anh"
                    dataKey="english"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Child Profile & Detailed Stats */}
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin học sinh</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
              <AvatarImage src={currentChild.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {currentChild.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{currentChild.name}</h2>
              <Badge variant="secondary" className="mt-1">{currentChild.grade}</Badge>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent space-x-6">
              <TabsTrigger
                value="overview"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
              >
                Môn học
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2"
              >
                Phân tích & Xu hướng
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 pt-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Biểu đồ chuyên cần</CardTitle>
                    <CardDescription>Tỷ lệ tham gia lớp học qua các tháng</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {report.attendance.map((item) => (
                        <div key={item.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-muted-foreground">{item.month}</span>
                            <span className="font-bold">{item.value}%</span>
                          </div>
                          <Progress value={item.value} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Biểu đồ điểm số</CardTitle>
                    <CardDescription>Điểm trung bình các bài kiểm tra</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      {report.scores.map((item) => (
                        <div key={item.month} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-muted-foreground">{item.month}</span>
                            <span className={`font-bold ${item.value >= 80 ? 'text-green-600' : item.value >= 65 ? 'text-amber-600' : 'text-red-600'}`}>{item.value}%</span>
                          </div>
                          <Progress
                            value={item.value}
                            className={`h-2 ${item.value >= 80 ? '[&>div]:bg-green-500' : item.value >= 65 ? '[&>div]:bg-amber-500' : '[&>div]:bg-red-500'}`}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="subjects" className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2">
              {report.subjects.map((subject) => (
                <Card key={subject.name} className="overflow-hidden">
                  <CardHeader className="bg-muted/10 pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <CardTitle className="text-base">{subject.name}</CardTitle>
                      </div>
                      <Badge variant={subject.progress >= 70 ? "default" : "secondary"}>
                        {subject.progress}% hoàn thành
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Điểm trung bình</p>
                        <div className="flex items-end gap-2">
                          <p className="text-3xl font-bold text-primary">{subject.avgScore}</p>
                          <span className="text-sm text-muted-foreground mb-1">/ 100</span>
                        </div>
                        <Progress value={subject.avgScore} className="h-1.5" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Chuyên cần</p>
                        <p className="text-3xl font-bold text-green-600">{subject.attendance}%</p>
                        <Progress value={subject.attendance} className="h-1.5" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Tiến độ</p>
                        <p className="text-3xl font-bold text-blue-600">{subject.progress}%</p>
                        <Progress value={subject.progress} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="trends" className="pt-4 space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="grid gap-4 md:grid-cols-2">
                {/* Strengths */}
                <Card className="border-green-100 bg-green-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <CardTitle className="text-base text-green-800">Điểm mạnh</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis?.strengths.length ? (
                        analysis.strengths.map((s, i) => (
                          <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-600 flex-shrink-0" />
                            {s}
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Chưa có dữ liệu nổi bật</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Weaknesses */}
                <Card className="border-amber-100 bg-amber-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-amber-600" />
                      <CardTitle className="text-base text-amber-800">Cần cải thiện</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis?.weaknesses.length ? (
                        analysis.weaknesses.map((s, i) => (
                          <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-amber-600 flex-shrink-0" />
                            {s}
                          </li>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">Không có điểm yếu đáng kể</p>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Forecast */}
              <Card className="bg-blue-50/30 border-blue-100">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <CardTitle className="text-base text-blue-800">Dự báo kết quả</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    {analysis?.forecast}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
