"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTestsRequest, fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, Target, Search, Play, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function StudentTestsPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { tests, isLoading, completedTests: completedTestsFromStore } = useSelector((state: RootState) => state.tests)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchTestsRequest())
    if (user?.id) {
      dispatch(fetchCompletedTestsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const publishedTests = tests.filter((t) => t.status === "published")

  const completedTests = (completedTestsFromStore || []).map(t => ({
    id: t.id,
    title: t.className || "Bài kiểm tra",
    subject: t.subject || "unknown",
    score: t.score,
    total: 100, // mock total
    date: new Date(t.completedAt).toLocaleDateString("vi-VN"),
    duration: 0
  }))

  const filteredTests = publishedTests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || test.subjectName === subjectFilter
    const matchesDifficulty = difficultyFilter === "all" || (test as any).difficulty === difficultyFilter
    return matchesSearch && matchesSubject && matchesDifficulty
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "Dễ"
      case "medium":
        return "Trung bình"
      case "hard":
        return "Khó"
      default:
        return difficulty
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Bài kiểm tra</h1>
        <p className="text-muted-foreground mt-1">Làm bài kiểm tra để đánh giá năng lực và theo dõi tiến độ</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bài có sẵn</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedTests.length}</div>
            <p className="text-xs text-muted-foreground">Có thể làm ngay</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Đã hoàn thành</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests.length}</div>
            <p className="text-xs text-muted-foreground">Tổng số bài đã làm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Điểm trung bình</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">Trên tất cả bài kiểm tra</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="available" className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Bài kiểm tra có sẵn</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài kiểm tra..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                <SelectItem value="math">Toán</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
                <SelectItem value="physics">Vật lý</SelectItem>
                <SelectItem value="chemistry">Hóa học</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTests.map((test) => (
              <Card key={test.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{test.subjectName}</Badge>
                    <Badge className={getDifficultyColor(test.difficulty || "medium")}>{getDifficultyLabel(test.difficulty || "medium")}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
                  <CardDescription>{test.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {test.duration} phút
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      {test.questions.length} câu
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4" />
                      {test.passingScore}%
                    </div>
                  </div>
                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/student/tests/${test.id}/start`}>
                      <Play className="h-4 w-4 mr-2" />
                      Bắt đầu làm bài
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy bài kiểm tra</h3>
              <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <div className="space-y-4">
            {completedTests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{test.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Hoàn thành: {test.date} - {test.duration} phút
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {test.score}/{test.total}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {((test.score / test.total) * 100).toFixed(0)}% đúng
                        </p>
                      </div>
                      <Button variant="outline" asChild>
                        <Link href={`/dashboard/student/tests/${test.id}/review`}>Xem lại</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
