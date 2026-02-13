"use client"

import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Target, Clock, CheckCircle, XCircle, Home, RotateCcw, FileText } from "lucide-react"
import Link from "next/link"

export default function TestResultPage() {
  const params = useParams()
  const router = useRouter()

  // Mock result data
  const result = {
    testTitle: "Kiểm tra Toán học - Đại số",
    totalQuestions: 8,
    correctAnswers: 6,
    wrongAnswers: 2,
    score: 85,
    totalPoints: 100,
    duration: "32:45",
    submittedAt: "15/12/2025 14:35",
    passingScore: 70,
    passed: true,
    breakdown: [
      { category: "Trắc nghiệm một đáp án", correct: 4, total: 5, points: 32 },
      { category: "Trắc nghiệm nhiều đáp án", correct: 2, total: 2, points: 30 },
      { category: "Tự luận", correct: 1, total: 1, points: 23 },
    ],
  }

  const scorePercentage = (result.score / result.totalPoints) * 100

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center h-24 w-24 rounded-full mb-4 ${
                result.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {result.passed ? (
                <Trophy className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{result.passed ? "Chúc mừng!" : "Chưa đạt yêu cầu"}</h1>
            <p className="text-muted-foreground mb-4">{result.testTitle}</p>
            <div className="flex items-center justify-center gap-2">
              <Badge variant={result.passed ? "default" : "destructive"} className="text-lg px-4 py-1">
                {result.score}/{result.totalPoints} điểm
              </Badge>
              <Badge variant="outline" className="text-lg px-4 py-1">
                {scorePercentage.toFixed(0)}%
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Đúng
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{result.correctAnswers}</div>
            <p className="text-xs text-muted-foreground">câu hỏi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              Sai
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{result.wrongAnswers}</div>
            <p className="text-xs text-muted-foreground">câu hỏi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Thời gian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.duration}</div>
            <p className="text-xs text-muted-foreground">phút</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Điểm đạt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.passingScore}%</div>
            <p className="text-xs text-muted-foreground">yêu cầu</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Chi tiết kết quả</CardTitle>
          <CardDescription>Phân tích theo từng loại câu hỏi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.breakdown.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.category}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.correct}/{item.total} đúng - {item.points} điểm
                  </span>
                </div>
                <Progress value={(item.correct / item.total) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thông tin nộp bài</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Thời gian nộp</p>
              <p className="font-medium">{result.submittedAt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tổng số câu</p>
              <p className="font-medium">{result.totalQuestions} câu hỏi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="flex-1">
          <Link href={`/dashboard/student/tests/${params.id}/review`}>
            <FileText className="h-4 w-4 mr-2" />
            Xem lại bài làm
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 bg-transparent">
          <Link href="/dashboard/student/tests">
            <RotateCcw className="h-4 w-4 mr-2" />
            Làm bài khác
          </Link>
        </Button>
        <Button variant="outline" asChild className="flex-1 bg-transparent">
          <Link href="/dashboard/student">
            <Home className="h-4 w-4 mr-2" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
