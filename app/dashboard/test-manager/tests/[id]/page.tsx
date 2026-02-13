"use client"

import type React from "react"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Copy,
  Share2,
  Download,
  Eye,
  FileText,
  Users,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"

const testData = {
  id: "1",
  title: "Toán học - Đại số tuyến tính",
  subject: "Toán",
  description: "Bài kiểm tra về đại số tuyến tính bao gồm ma trận, định thức và hệ phương trình.",
  duration: 60,
  totalQuestions: 30,
  passingScore: 60,
  status: "published",
  createdAt: "10/12/2025",
  updatedAt: "12/12/2025",
  attempts: 156,
  avgScore: 78,
  passRate: 85,
}

const questionStats = [
  { id: 1, content: "Tính định thức ma trận 3x3...", correctRate: 92, attempts: 156 },
  { id: 2, content: "Giải hệ phương trình...", correctRate: 78, attempts: 156 },
  { id: 3, content: "Tìm ma trận nghịch đảo...", correctRate: 65, attempts: 156 },
  { id: 4, content: "Chứng minh không gian vectơ...", correctRate: 45, attempts: 156 },
  { id: 5, content: "Tính giá trị riêng...", correctRate: 58, attempts: 156 },
]

const recentAttempts = [
  {
    id: 1,
    user: { name: "Nguyễn Văn A", role: "student" },
    score: 85,
    time: "45 phút",
    date: "15/12/2025 14:30",
    status: "passed",
  },
  {
    id: 2,
    user: { name: "Trần Thị B", role: "tutor" },
    score: 92,
    time: "38 phút",
    date: "15/12/2025 10:15",
    status: "passed",
  },
  {
    id: 3,
    user: { name: "Lê Văn C", role: "student" },
    score: 55,
    time: "58 phút",
    date: "14/12/2025 16:45",
    status: "failed",
  },
  {
    id: 4,
    user: { name: "Phạm Thị D", role: "student" },
    score: 78,
    time: "52 phút",
    date: "14/12/2025 09:20",
    status: "passed",
  },
  {
    id: 5,
    user: { name: "Hoàng Văn E", role: "tutor" },
    score: 88,
    time: "42 phút",
    date: "13/12/2025 15:00",
    status: "passed",
  },
]

const scoreDistribution = [
  { range: "0-20%", count: 2, percentage: 1.3 },
  { range: "21-40%", count: 8, percentage: 5.1 },
  { range: "41-60%", count: 21, percentage: 13.5 },
  { range: "61-80%", count: 68, percentage: 43.6 },
  { range: "81-100%", count: 57, percentage: 36.5 },
]

export default function TestDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/test-manager/tests">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{testData.title}</h1>
            <Badge className={testData.status === "published" ? "bg-green-100 text-green-700" : ""}>
              {testData.status === "published" ? "Đã xuất bản" : "Nháp"}
            </Badge>
          </div>
          <p className="text-muted-foreground">{testData.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button variant="destructive" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Số câu hỏi</p>
                <p className="text-xl font-bold">{testData.totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="text-xl font-bold">{testData.duration} phút</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lượt làm</p>
                <p className="text-xl font-bold">{testData.attempts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <Target className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Điểm TB</p>
                <p className="text-xl font-bold">{testData.avgScore}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
                <p className="text-xl font-bold">{testData.passRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="questions">Câu hỏi</TabsTrigger>
          <TabsTrigger value="attempts">Lượt làm</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài kiểm tra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Môn học</p>
                    <p className="font-medium">{testData.subject}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm đậu</p>
                    <p className="font-medium">{testData.passingScore}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày tạo</p>
                    <p className="font-medium">{testData.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Cập nhật</p>
                    <p className="font-medium">{testData.updatedAt}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Phân bố điểm</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {scoreDistribution.map((dist) => (
                  <div key={dist.range} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{dist.range}</span>
                      <span className="text-muted-foreground">
                        {dist.count} ({dist.percentage}%)
                      </span>
                    </div>
                    <Progress value={dist.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lượt làm gần đây</CardTitle>
              <CardDescription>5 lượt làm bài gần nhất</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người làm</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Ngày làm</TableHead>
                    <TableHead>Kết quả</TableHead>
                    <TableHead className="text-right">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{attempt.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{attempt.user.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {attempt.user.role === "student" ? "Học sinh" : "Gia sư"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={attempt.score >= 60 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                          {attempt.score}%
                        </span>
                      </TableCell>
                      <TableCell>{attempt.time}</TableCell>
                      <TableCell className="text-muted-foreground">{attempt.date}</TableCell>
                      <TableCell>
                        {attempt.status === "passed" ? (
                          <Badge className="bg-green-100 text-green-700">Đậu</Badge>
                        ) : (
                          <Badge variant="destructive">Rớt</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Danh sách câu hỏi</CardTitle>
                <CardDescription>{testData.totalQuestions} câu hỏi trong bài kiểm tra</CardDescription>
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm câu hỏi
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead className="text-right">Tỷ lệ đúng</TableHead>
                    <TableHead className="text-right">Lượt trả lời</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionStats.map((q, index) => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {q.correctRate >= 70 ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : q.correctRate >= 50 ? (
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="truncate max-w-[400px]">{q.content}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            q.correctRate >= 70
                              ? "text-green-600"
                              : q.correctRate >= 50
                                ? "text-amber-600"
                                : "text-red-600"
                          }
                        >
                          {q.correctRate}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">{q.attempts}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attempts" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tất cả lượt làm</CardTitle>
                <CardDescription>Lịch sử {testData.attempts} lượt làm bài</CardDescription>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Xuất Excel
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Người làm</TableHead>
                    <TableHead>Vai trò</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Ngày làm</TableHead>
                    <TableHead>Kết quả</TableHead>
                    <TableHead className="text-right">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentAttempts.map((attempt) => (
                    <TableRow key={attempt.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>{attempt.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{attempt.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{attempt.user.role === "student" ? "Học sinh" : "Gia sư"}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={attempt.score >= 60 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                          {attempt.score}%
                        </span>
                      </TableCell>
                      <TableCell>{attempt.time}</TableCell>
                      <TableCell className="text-muted-foreground">{attempt.date}</TableCell>
                      <TableCell>
                        {attempt.status === "passed" ? (
                          <Badge className="bg-green-100 text-green-700">Đậu</Badge>
                        ) : (
                          <Badge variant="destructive">Rớt</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          Xem chi tiết
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Câu hỏi khó nhất
                </CardTitle>
                <CardDescription>Top 5 câu hỏi có tỷ lệ đúng thấp nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionStats
                    .sort((a, b) => a.correctRate - b.correctRate)
                    .slice(0, 5)
                    .map((q, index) => (
                      <div key={q.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="truncate max-w-[200px]">{q.content}</span>
                        </div>
                        <Badge variant="destructive">{q.correctRate}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Câu hỏi dễ nhất
                </CardTitle>
                <CardDescription>Top 5 câu hỏi có tỷ lệ đúng cao nhất</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {questionStats
                    .sort((a, b) => b.correctRate - a.correctRate)
                    .slice(0, 5)
                    .map((q, index) => (
                      <div key={q.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="truncate max-w-[200px]">{q.content}</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">{q.correctRate}%</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Thống kê tổng hợp</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold text-green-600">{testData.passRate}%</p>
                  <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{testData.avgScore}%</p>
                  <p className="text-sm text-muted-foreground">Điểm trung bình</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">45 phút</p>
                  <p className="text-sm text-muted-foreground">Thời gian TB</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-3xl font-bold">{testData.attempts}</p>
                  <p className="text-sm text-muted-foreground">Tổng lượt làm</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
