"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileCheck, Clock, Target, Search, Play, Trophy, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchPracticeTestsRequest } from "@/store/slices/student-slice"
import { fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { useEffect } from "react"

export default function StudentPracticePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { practiceTests } = useSelector((state: RootState) => state.student)
  const { completedTests } = useSelector((state: RootState) => state.tests)

  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchPracticeTestsRequest())
    if (user?.id) {
      dispatch(fetchCompletedTestsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const myAttempts = completedTests || []

  const filteredTests = (practiceTests || []).filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || test.subjectName === subjectFilter // Simplified
    const matchesDifficulty = difficultyFilter === "all" || (test as any).difficulty === difficultyFilter
    return matchesSearch && matchesDifficulty // Removed subject filter logic for now as simplified above
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

  const avgScore = myAttempts.length > 0 ? myAttempts.reduce((sum, a) => sum + a.score, 0) / myAttempts.length : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Thi thử</h1>
        <p className="text-muted-foreground">Luyện tập với các đề thi thử để chuẩn bị tốt nhất cho kỳ thi</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{practiceTests.length}</p>
                <p className="text-sm text-muted-foreground">Đề thi có sẵn</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myAttempts.length}</p>
                <p className="text-sm text-muted-foreground">Lần thi đã thực hiện</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Target className="h-6 w-6 text-blue-600" />
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
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">+12%</p>
                <p className="text-sm text-muted-foreground">Tiến bộ tháng này</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* My Recent Attempts */}
      <Card>
        <CardHeader>
          <CardTitle>Lần thi gần đây</CardTitle>
          <CardDescription>Kết quả các bài thi thử bạn đã làm</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myAttempts.map((attempt) => (
              <div key={attempt.id} className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${attempt.score >= 80 ? "bg-green-100" : attempt.score >= 60 ? "bg-yellow-100" : "bg-red-100"
                      }`}
                  >
                    <Trophy
                      className={`h-5 w-5 ${attempt.score >= 80
                        ? "text-green-600"
                        : attempt.score >= 60
                          ? "text-yellow-600"
                          : "text-red-600"
                        }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{attempt.className}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{attempt.score}%</p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href={`/dashboard/student/results`}>Xem lại</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đề thi..."
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

      {/* Practice Tests */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTests.map((test) => (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <Badge variant="outline">{test.subjectName}</Badge>
                <Badge className={getDifficultyColor(test.difficulty)}>{getDifficultyLabel(test.difficulty)}</Badge>
              </div>
              <CardTitle className="text-lg mt-2">{test.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{test.duration} phút</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileCheck className="h-4 w-4" />
                  <span>{test.questions.length} câu</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Điểm TB cộng đồng</span>
                  <span className="font-medium">{test.avgScore}%</span>
                </div>
                <Progress value={test.avgScore} className="h-2" />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{(test as any).attempts || 0} lượt thi</span>
              </div>

              <Button className="w-full" asChild>
                <Link href={`/dashboard/student/practice/${test.id}/start`}>
                  <Play className="h-4 w-4 mr-2" />
                  Bắt đầu thi
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
