"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTestsRequest } from "@/store/slices/tests-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Clock, TrendingUp, Plus, Sparkles, BarChart3, BookOpen } from "lucide-react"
import Link from "next/link"

export default function TestManagerDashboard() {
  const dispatch = useDispatch()
  const { tests, loading } = useSelector((state: RootState) => state.tests)

  useEffect(() => {
    dispatch(fetchTestsRequest())
  }, [dispatch])

  const stats = {
    totalTests: tests.length,
    publishedTests: tests.filter((t) => t.status === "published").length,
    draftTests: tests.filter((t) => t.status === "draft").length,
    totalAttempts: 1250,
    avgScore: 76.5,
  }

  const recentTests = [
    {
      id: "1",
      title: "Toán học - Đại số tuyến tính",
      subject: "math",
      attempts: 156,
      avgScore: 78,
      status: "published",
      createdAt: "10/12/2025",
    },
    {
      id: "2",
      title: "Tiếng Anh - Reading Comprehension",
      subject: "english",
      attempts: 89,
      avgScore: 72,
      status: "published",
      createdAt: "08/12/2025",
    },
    {
      id: "3",
      title: "Vật lý - Điện từ học",
      subject: "physics",
      attempts: 67,
      avgScore: 81,
      status: "published",
      createdAt: "05/12/2025",
    },
    {
      id: "4",
      title: "Hóa học - Hữu cơ cơ bản",
      subject: "chemistry",
      attempts: 0,
      avgScore: 0,
      status: "draft",
      createdAt: "14/12/2025",
    },
  ]

  const questionBanks = [
    { subject: "Toán", count: 520, categories: 15 },
    { subject: "Tiếng Anh", count: 380, categories: 12 },
    { subject: "Vật lý", count: 290, categories: 10 },
    { subject: "Hóa học", count: 245, categories: 8 },
    { subject: "Sinh học", count: 180, categories: 6 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Quản lý bài kiểm tra</h1>
          <p className="text-muted-foreground mt-1">Tạo, quản lý và phân tích các bài kiểm tra</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/test-manager/create">
              <Plus className="h-4 w-4 mr-2" />
              Tạo thủ công
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/test-manager/ai-generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Tạo bằng AI
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng bài kiểm tra"
          value={stats.totalTests.toString()}
          description={`${stats.publishedTests} đã xuất bản`}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Lượt làm bài"
          value={stats.totalAttempts.toLocaleString()}
          description="Tổng số lần làm bài"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Điểm trung bình"
          value={`${stats.avgScore}%`}
          description="Trên tất cả bài kiểm tra"
          icon={<TrendingUp className="h-4 w-4 text-green-600" />}
          trend={{ value: 3.2, isPositive: true }}
        />
        <StatsCard
          title="Bài nháp"
          value={stats.draftTests.toString()}
          description="Chưa xuất bản"
          icon={<Clock className="h-4 w-4 text-orange-500" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bài kiểm tra gần đây</CardTitle>
              <CardDescription>Các bài kiểm tra mới tạo và cập nhật</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/test-manager/tests">Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        test.subject === "math"
                          ? "bg-blue-100"
                          : test.subject === "english"
                            ? "bg-green-100"
                            : test.subject === "physics"
                              ? "bg-purple-100"
                              : "bg-orange-100"
                      }`}
                    >
                      <FileText
                        className={`h-5 w-5 ${
                          test.subject === "math"
                            ? "text-blue-600"
                            : test.subject === "english"
                              ? "text-green-600"
                              : test.subject === "physics"
                                ? "text-purple-600"
                                : "text-orange-600"
                        }`}
                      />
                    </div>
                    <div>
                      <h4 className="font-medium">{test.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {test.attempts} lượt làm - Tạo: {test.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {test.status === "published" && (
                      <div className="text-right">
                        <p className="font-semibold">{test.avgScore}%</p>
                        <p className="text-xs text-muted-foreground">Điểm TB</p>
                      </div>
                    )}
                    <Badge variant={test.status === "published" ? "default" : "secondary"}>
                      {test.status === "published" ? "Đã xuất bản" : "Nháp"}
                    </Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/test-manager/tests/${test.id}`}>Chi tiết</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Ngân hàng câu hỏi
            </CardTitle>
            <CardDescription>Số lượng câu hỏi theo môn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questionBanks.map((bank) => (
                <div key={bank.subject} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{bank.subject}</p>
                    <p className="text-sm text-muted-foreground">{bank.categories} danh mục</p>
                  </div>
                  <Badge variant="secondary">{bank.count} câu</Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" asChild>
              <Link href="/dashboard/test-manager/question-bank">Quản lý câu hỏi</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Công cụ AI
            </CardTitle>
            <CardDescription>Tận dụng AI để tạo và cải thiện bài kiểm tra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/test-manager/ai-generate">
                <Sparkles className="h-4 w-4 mr-2" />
                Tạo bài kiểm tra tự động
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/test-manager/ai-questions">
                <FileText className="h-4 w-4 mr-2" />
                Sinh câu hỏi từ tài liệu
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/dashboard/test-manager/ai-analysis">
                <BarChart3 className="h-4 w-4 mr-2" />
                Phân tích kết quả thông minh
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Thống kê nhanh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Bài kiểm tra tuần này</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Câu hỏi mới thêm</span>
                <span className="font-semibold">45</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tỷ lệ hoàn thành</span>
                <span className="font-semibold text-green-600">87%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Câu hỏi khó nhất</span>
                <span className="font-semibold text-red-600">32% đúng</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
