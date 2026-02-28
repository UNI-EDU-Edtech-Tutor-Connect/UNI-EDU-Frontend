"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { FileCheck, Clock, Target, Search, Play, Trophy, TrendingUp, BookOpen, ChevronLeft, ChevronRight, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchPracticeTestsRequest } from "@/store/slices/student-slice"
import { fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { useEffect } from "react"

const ITEMS_PER_PAGE = 6

export default function StudentPracticePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { practiceTests } = useSelector((state: RootState) => state.student)
  const { completedTests } = useSelector((state: RootState) => state.tests)

  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [testsPage, setTestsPage] = useState(1)
  const [attemptsPage, setAttemptsPage] = useState(1)
  const [selectedAttempt, setSelectedAttempt] = useState<any>(null)
  const [showAttemptDialog, setShowAttemptDialog] = useState(false)

  useEffect(() => {
    dispatch(fetchPracticeTestsRequest())
    if (user?.id) {
      dispatch(fetchCompletedTestsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const myAttempts = useMemo(() => {
    const items = completedTests || []
    // Sort newest first
    return [...items].sort((a, b) => {
      const dateA = new Date(a.completedAt).getTime()
      const dateB = new Date(b.completedAt).getTime()
      if (isNaN(dateA) || isNaN(dateB)) return 0
      return dateB - dateA
    })
  }, [completedTests])

  const filteredTests = useMemo(() => {
    return (practiceTests || []).filter((test) => {
      const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesSubject = subjectFilter === "all" || test.subjectName === subjectFilter
      const matchesDifficulty = difficultyFilter === "all" || (test as any).difficulty === difficultyFilter
      return matchesSearch && matchesDifficulty && matchesSubject
    })
  }, [practiceTests, searchTerm, subjectFilter, difficultyFilter])

  // Reset page when filters change
  useEffect(() => {
    setTestsPage(1)
  }, [searchTerm, subjectFilter, difficultyFilter])

  const testsTotalPages = Math.ceil(filteredTests.length / ITEMS_PER_PAGE)
  const paginatedTests = filteredTests.slice((testsPage - 1) * ITEMS_PER_PAGE, testsPage * ITEMS_PER_PAGE)

  const attemptsTotalPages = Math.ceil(myAttempts.length / ITEMS_PER_PAGE)
  const paginatedAttempts = myAttempts.slice((attemptsPage - 1) * ITEMS_PER_PAGE, attemptsPage * ITEMS_PER_PAGE)

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
      {myAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Lần thi gần đây</CardTitle>
            <CardDescription>Kết quả các bài thi thử bạn đã làm</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedAttempts.map((attempt) => (
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
                    <Button variant="outline" onClick={() => {
                      setSelectedAttempt(attempt)
                      setShowAttemptDialog(true)
                    }}>
                      Xem lại
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            {/* Attempts Pagination */}
            {attemptsTotalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Trang {attemptsPage} / {attemptsTotalPages} ({myAttempts.length} kết quả)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={attemptsPage === 1}
                    onClick={() => setAttemptsPage(attemptsPage - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={attemptsPage === attemptsTotalPages}
                    onClick={() => setAttemptsPage(attemptsPage + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

      {/* Practice Tests - with pagination */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedTests.map((test) => (
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
                <Link href={`/dashboard/student/tests/${test.id}/start`}>
                  <Play className="h-4 w-4 mr-2" />
                  Bắt đầu thi
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tests Grid Pagination */}
      {testsTotalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Trang {testsPage} / {testsTotalPages} ({filteredTests.length} đề thi)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={testsPage === 1}
              onClick={() => setTestsPage(testsPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(testsTotalPages, 5) }, (_, i) => {
              let pageNum: number
              if (testsTotalPages <= 5) {
                pageNum = i + 1
              } else if (testsPage <= 3) {
                pageNum = i + 1
              } else if (testsPage >= testsTotalPages - 2) {
                pageNum = testsTotalPages - 4 + i
              } else {
                pageNum = testsPage - 2 + i
              }
              return (
                <Button
                  key={pageNum}
                  variant={testsPage === pageNum ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setTestsPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={testsPage === testsTotalPages}
              onClick={() => setTestsPage(testsPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <FileCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Không tìm thấy đề thi</h3>
          <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      )}

      {/* Attempt Details Dialog */}
      <Dialog open={showAttemptDialog} onOpenChange={setShowAttemptDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết bài thi</DialogTitle>
            <DialogDescription>
              Kết quả của bài thi thử "{selectedAttempt?.className || selectedAttempt?.title}"
            </DialogDescription>
          </DialogHeader>
          {selectedAttempt && (
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-center p-6 bg-muted/30 rounded-lg">
                <div className="text-center">
                  <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${selectedAttempt.score >= 80 ? 'bg-green-100' : selectedAttempt.score >= 60 ? 'bg-yellow-100' : 'bg-red-100'}`}>
                    <Trophy className={`h-8 w-8 ${selectedAttempt.score >= 80 ? 'text-green-600' : selectedAttempt.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`} />
                  </div>
                  <h3 className="text-3xl font-bold">{selectedAttempt.score}%</h3>
                  <p className="text-sm text-muted-foreground">Điểm số</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Thời gian</p>
                    <p className="font-medium text-sm">32:45 / 45:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <Target className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Điểm đạt</p>
                    <p className="font-medium text-sm">60% yêu cầu</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Câu đúng</p>
                    <p className="font-medium text-sm">32 câu</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-lg">
                  <XCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Câu sai</p>
                    <p className="font-medium text-sm">8 câu</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowAttemptDialog(false)}>
                  Đóng
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/dashboard/student/tests/${selectedAttempt.id}/result`}>
                    Xem phân tích
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
