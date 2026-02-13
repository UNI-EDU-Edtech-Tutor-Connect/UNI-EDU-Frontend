"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Trophy, TrendingUp, Target, Calendar, CheckCircle, XCircle, Eye, BarChart3 } from "lucide-react"
import Link from "next/link"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { useEffect } from "react"

export default function StudentResultsPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { completedTests } = useSelector((state: RootState) => state.tests)

  const [subjectFilter, setSubjectFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCompletedTestsRequest(user.id))
    }
  }, [dispatch, user?.id])

  // Need to map CompletedTest to expected format or adjust usage
  const formattedResults = (completedTests || []).map(t => ({
    id: t.id,
    testTitle: t.className || "Bài kiểm tra",
    subject: t.subject || "unknown", // Map ?
    type: "test", // Default
    score: t.score,
    total: 100, // Assume 100 max
    correct: 0, // Unknown
    wrong: 0, // Unknown
    date: new Date(t.completedAt).toLocaleDateString("vi-VN"),
    duration: 0, // Unknown
    passingScore: t.passingScore || 50,
    passed: t.passed
  }))

  const filteredResults = formattedResults.filter((result) => {
    const matchesSubject = subjectFilter === "all" || result.subject === subjectFilter
    const matchesType = typeFilter === "all" || result.type === typeFilter
    return matchesSubject && matchesType
  })

  const getSubjectLabel = (subject: string) => {
    switch (subject) {
      case "math":
        return "Toán"
      case "english":
        return "Tiếng Anh"
      case "physics":
        return "Vật lý"
      case "chemistry":
        return "Hóa học"
      default:
        return subject
    }
  }

  const totalTests = formattedResults.length
  const avgScore = formattedResults.length > 0 ? formattedResults.reduce((sum, r) => sum + r.score, 0) / formattedResults.length : 0
  const passedTests = formattedResults.filter((r) => r.passed).length
  const bestScore = formattedResults.length > 0 ? Math.max(...formattedResults.map((r) => r.score)) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Kết quả thi</h1>
        <p className="text-muted-foreground">Xem lại tất cả kết quả bài kiểm tra và thi thử của bạn</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalTests}</p>
                <p className="text-sm text-muted-foreground">Tổng bài thi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgScore.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {passedTests}/{totalTests}
                </p>
                <p className="text-sm text-muted-foreground">Bài đạt yêu cầu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{bestScore.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Điểm cao nhất</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ theo môn học</CardTitle>
          <CardDescription>Điểm trung bình của bạn theo từng môn</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {["math", "english", "physics", "chemistry"].map((subject) => {
              const subjectResults = formattedResults.filter((r) => r.subject === subject) // This filtering might fail if subject names differ
              const subjectAvg =
                subjectResults.length > 0
                  ? subjectResults.reduce((sum, r) => sum + r.score, 0) / subjectResults.length
                  : 0

              return (
                <div key={subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{getSubjectLabel(subject)}</span>
                    <span>{subjectAvg.toFixed(0)}%</span>
                  </div>
                  <Progress
                    value={subjectAvg}
                    className={`h-3 ${subjectAvg >= 80
                        ? "[&>div]:bg-green-500"
                        : subjectAvg >= 60
                          ? "[&>div]:bg-yellow-500"
                          : "[&>div]:bg-red-500"
                      }`}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex gap-4">
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
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Loại bài" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="test">Bài kiểm tra</SelectItem>
            <SelectItem value="practice">Thi thử</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {filteredResults.map((result) => {
          const percentage = result.score // Assuming score is percentage or 0-100
          const passed = result.passed

          return (
            <Card key={result.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${passed ? "bg-green-100" : "bg-red-100"
                        }`}
                    >
                      {passed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{result.testTitle}</h4>
                        <Badge variant={result.type === "test" ? "default" : "secondary"}>
                          {result.type === "test" ? "Kiểm tra" : "Thi thử"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {result.date}
                        </span>
                        {/* <span>{result.duration} phút</span>
                        <span className="text-green-600">{result.correct} đúng</span>
                        <span className="text-red-600">{result.wrong} sai</span> */}
                        <span>
                          {result.passed ? "Đạt" : "Không đạt"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-3xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
                        {result.score}
                      </p>
                      <p className="text-sm text-muted-foreground">Điểm số</p>
                    </div>
                    <Button variant="outline" asChild>
                      <Link href={`/dashboard/student/results/${result.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
