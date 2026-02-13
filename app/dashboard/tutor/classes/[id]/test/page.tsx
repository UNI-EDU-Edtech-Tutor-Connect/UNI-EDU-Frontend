"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle, AlertCircle, BookOpen, Award, XCircle } from "lucide-react"

// Mock test questions for tutor qualification
const mockTestQuestions = [
  {
    id: "q1",
    question: "Cho hàm số y = x³ - 3x² + 2. Tìm các điểm cực trị của hàm số.",
    options: [
      "Cực đại tại x = 0, cực tiểu tại x = 2",
      "Cực đại tại x = 2, cực tiểu tại x = 0",
      "Cực đại tại x = 1, cực tiểu tại x = -1",
      "Hàm số không có cực trị",
    ],
    correctAnswer: 0,
    explanation:
      "Đạo hàm y' = 3x² - 6x = 3x(x-2). y' = 0 khi x = 0 hoặc x = 2. Kiểm tra dấu y' ta có cực đại tại x = 0.",
  },
  {
    id: "q2",
    question: "Tính tích phân ∫(0 đến 1) x·e^x dx",
    options: ["e - 2", "e - 1", "1", "2e - 1"],
    correctAnswer: 2,
    explanation: "Sử dụng tích phân từng phần với u = x, dv = e^x dx. Kết quả là [x·e^x - e^x] từ 0 đến 1 = 1.",
  },
  {
    id: "q3",
    question:
      "Trong không gian Oxyz, cho mặt phẳng (P): 2x - y + 2z - 6 = 0. Khoảng cách từ điểm M(1, 2, 3) đến (P) là:",
    options: ["1", "2", "3", "4"],
    correctAnswer: 1,
    explanation: "d = |2·1 - 2 + 2·3 - 6| / √(4 + 1 + 4) = |6| / 3 = 2.",
  },
  {
    id: "q4",
    question: "Cho cấp số cộng (un) với u1 = 3 và công sai d = 2. Tìm tổng S10 của 10 số hạng đầu tiên.",
    options: ["110", "120", "130", "140"],
    correctAnswer: 1,
    explanation: "S10 = 10·u1 + 10·9·d/2 = 30 + 90 = 120.",
  },
  {
    id: "q5",
    question: "Giải phương trình: log₂(x + 1) + log₂(x - 1) = 3",
    options: ["x = 3", "x = 2", "x = 4", "x = 5"],
    correctAnswer: 0,
    explanation: "log₂[(x+1)(x-1)] = 3 ⟹ x² - 1 = 8 ⟹ x = 3 (vì x > 1).",
  },
  {
    id: "q6",
    question:
      "Cho hình chóp S.ABCD có đáy ABCD là hình vuông cạnh a, SA ⊥ (ABCD) và SA = a√2. Tính góc giữa SC và (ABCD).",
    options: ["30°", "45°", "60°", "90°"],
    correctAnswer: 1,
    explanation: "tan(góc) = SA/AC = a√2/(a√2) = 1 ⟹ góc = 45°.",
  },
  {
    id: "q7",
    question: "Tìm giá trị lớn nhất của hàm số y = x + 4/x trên [1, 4].",
    options: ["4", "5", "6", "8"],
    correctAnswer: 1,
    explanation: "y' = 1 - 4/x² = 0 khi x = 2. So sánh y(1) = 5, y(2) = 4, y(4) = 5 ⟹ max = 5.",
  },
  {
    id: "q8",
    question: "Cho số phức z = 3 + 4i. Tính |z|².",
    options: ["5", "7", "25", "49"],
    correctAnswer: 2,
    explanation: "|z|² = 3² + 4² = 9 + 16 = 25.",
  },
  {
    id: "q9",
    question: "Trong mặt phẳng tọa độ Oxy, cho elip (E): x²/25 + y²/9 = 1. Tìm tiêu cự của (E).",
    options: ["4", "6", "8", "10"],
    correctAnswer: 2,
    explanation: "c² = a² - b² = 25 - 9 = 16 ⟹ c = 4. Tiêu cự = 2c = 8.",
  },
  {
    id: "q10",
    question: "Tính giới hạn lim(x→0) (sin 3x) / (2x)",
    options: ["0", "3/2", "2/3", "1"],
    correctAnswer: 1,
    explanation: "lim(x→0) (sin 3x)/(2x) = lim(x→0) (3·sin 3x)/(3·2x) = 3/2 · lim(t→0) sin(t)/t = 3/2.",
  },
]

const PASSING_SCORE = 70 // Điểm đậu: 70%

export default function TutorQualificationTestPage() {
  const params = useParams()
  const router = useRouter()
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes
  const [showSubmitDialog, setShowSubmitDialog] = useState(false)
  const [showTimeUpDialog, setShowTimeUpDialog] = useState(false)
  const [testResult, setTestResult] = useState<{
    score: number
    correct: number
    total: number
    passed: boolean
  } | null>(null)

  // Timer
  useEffect(() => {
    if (!testStarted || testCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setShowTimeUpDialog(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [testStarted, testCompleted])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answerIndex }))
  }

  const toggleFlag = (questionId: string) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(questionId)) {
        newSet.delete(questionId)
      } else {
        newSet.add(questionId)
      }
      return newSet
    })
  }

  const calculateResult = useCallback(() => {
    let correct = 0
    mockTestQuestions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) {
        correct++
      }
    })
    const score = Math.round((correct / mockTestQuestions.length) * 100)
    return {
      score,
      correct,
      total: mockTestQuestions.length,
      passed: score >= PASSING_SCORE,
    }
  }, [answers])

  const handleSubmit = () => {
    const result = calculateResult()
    setTestResult(result)
    setTestCompleted(true)
    setShowSubmitDialog(false)
  }

  const handleTimeUp = () => {
    const result = calculateResult()
    setTestResult(result)
    setTestCompleted(true)
    setShowTimeUpDialog(false)
  }

  const answeredCount = Object.values(answers).filter((a) => a !== null).length
  const progress = (answeredCount / mockTestQuestions.length) * 100

  // Test Intro Screen
  if (!testStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Bài kiểm tra năng lực</CardTitle>
            <CardDescription className="text-base">Hoàn thành bài kiểm tra để đăng ký nhận lớp Toán 12</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary">{mockTestQuestions.length}</p>
                <p className="text-sm text-muted-foreground">Câu hỏi</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-primary">30</p>
                <p className="text-sm text-muted-foreground">Phút</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-accent">{PASSING_SCORE}%</p>
                <p className="text-sm text-muted-foreground">Điểm đậu</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold text-green-600">1</p>
                <p className="text-sm text-muted-foreground">Lần thi</p>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800">Lưu ý quan trọng</p>
                  <ul className="mt-2 space-y-1 text-amber-700">
                    <li>• Bài kiểm tra gồm {mockTestQuestions.length} câu hỏi trắc nghiệm</li>
                    <li>• Thời gian làm bài: 30 phút</li>
                    <li>• Điểm đậu tối thiểu: {PASSING_SCORE}%</li>
                    <li>• Bạn chỉ được thi 1 lần cho mỗi lớp</li>
                    <li>• Đậu bài test mới được thanh toán để nhận lớp</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <Button className="flex-1" onClick={() => setTestStarted(true)}>
                Bắt đầu làm bài
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test Result Screen
  if (testCompleted && testResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader className="text-center">
            <div
              className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                testResult.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {testResult.passed ? (
                <Award className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {testResult.passed ? "Chúc mừng! Bạn đã đậu" : "Rất tiếc! Bạn chưa đậu"}
            </CardTitle>
            <CardDescription className="text-base">
              {testResult.passed
                ? "Bạn đã vượt qua bài kiểm tra năng lực. Hãy tiến hành thanh toán để nhận lớp."
                : "Điểm của bạn chưa đạt yêu cầu. Hãy ôn tập thêm và thử lại với lớp khác."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-lg bg-muted/50">
                <p className={`text-3xl font-bold ${testResult.passed ? "text-green-600" : "text-red-600"}`}>
                  {testResult.score}%
                </p>
                <p className="text-sm text-muted-foreground">Điểm số</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-primary">
                  {testResult.correct}/{testResult.total}
                </p>
                <p className="text-sm text-muted-foreground">Câu đúng</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-3xl font-bold text-accent">{PASSING_SCORE}%</p>
                <p className="text-sm text-muted-foreground">Điểm đậu</p>
              </div>
            </div>

            {testResult.passed ? (
              <div className="p-4 rounded-lg border border-green-200 bg-green-50">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Bước tiếp theo</p>
                    <p className="text-green-700 mt-1">
                      Thanh toán phí đăng ký 500,000đ để hoàn tất nhận lớp. Số tiền này sẽ được hoàn lại sau 3 buổi dạy
                      đầu tiên.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-red-800">Gợi ý cải thiện</p>
                    <p className="text-red-700 mt-1">
                      Hãy ôn tập lại các kiến thức về Giải tích và Hình học không gian. Bạn có thể tìm các lớp khác phù
                      hợp hơn với năng lực.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Show answers review */}
            <div className="space-y-4">
              <h3 className="font-semibold">Xem lại đáp án</h3>
              {mockTestQuestions.map((q, index) => {
                const userAnswer = answers[q.id]
                const isCorrect = userAnswer === q.correctAnswer
                return (
                  <div key={q.id} className="p-4 rounded-lg border">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          isCorrect ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          Câu {index + 1}: {q.question}
                        </p>
                        <div className="mt-2 space-y-1 text-sm">
                          <p
                            className={
                              userAnswer !== null
                                ? isCorrect
                                  ? "text-green-600"
                                  : "text-red-600"
                                : "text-muted-foreground"
                            }
                          >
                            Đáp án của bạn: {userAnswer !== null ? q.options[userAnswer] : "Chưa trả lời"}
                          </p>
                          {!isCorrect && <p className="text-green-600">Đáp án đúng: {q.options[q.correctAnswer]}</p>}
                          <p className="text-muted-foreground italic mt-2">{q.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                <a href="/dashboard/tutor/classes">Quay lại danh sách lớp</a>
              </Button>
              {testResult.passed && (
                <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
                  <a href={`/dashboard/tutor/classes/${params.id}/payment`}>Thanh toán nhận lớp</a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test Taking Screen
  const currentQ = mockTestQuestions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Bài kiểm tra năng lực - Toán 12</h1>
          <p className="text-sm text-muted-foreground">
            Câu {currentQuestion + 1} / {mockTestQuestions.length}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              timeLeft <= 300 ? "bg-red-100 text-red-700" : "bg-muted"
            }`}
          >
            <Clock className={`h-5 w-5 ${timeLeft <= 300 ? "animate-pulse" : ""}`} />
            <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
          </div>
          <Button onClick={() => setShowSubmitDialog(true)}>Nộp bài</Button>
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>
            Tiến độ: {answeredCount}/{mockTestQuestions.length} câu
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Question */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Câu {currentQuestion + 1}</Badge>
                <Button
                  variant={flaggedQuestions.has(currentQ.id) ? "default" : "ghost"}
                  size="sm"
                  onClick={() => toggleFlag(currentQ.id)}
                >
                  <Flag className={`h-4 w-4 mr-1 ${flaggedQuestions.has(currentQ.id) ? "fill-current" : ""}`} />
                  {flaggedQuestions.has(currentQ.id) ? "Đã đánh dấu" : "Đánh dấu"}
                </Button>
              </div>
              <CardTitle className="text-lg font-medium mt-4">{currentQ.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={answers[currentQ.id]?.toString() || ""}
                onValueChange={(value) => handleAnswer(currentQ.id, Number.parseInt(value))}
                className="space-y-3"
              >
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      answers[currentQ.id] === index ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => handleAnswer(currentQ.id, index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Câu trước
                </Button>
                <Button
                  onClick={() => setCurrentQuestion((prev) => Math.min(mockTestQuestions.length - 1, prev + 1))}
                  disabled={currentQuestion === mockTestQuestions.length - 1}
                >
                  Câu tiếp
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Navigator */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Danh sách câu hỏi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {mockTestQuestions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-full aspect-square rounded-lg text-sm font-medium transition-colors ${
                    currentQuestion === index
                      ? "bg-primary text-primary-foreground"
                      : answers[q.id] !== undefined && answers[q.id] !== null
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-muted hover:bg-muted/80"
                  } ${flaggedQuestions.has(q.id) ? "ring-2 ring-amber-400" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100"></div>
                <span>Đã trả lời ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted"></div>
                <span>Chưa trả lời ({mockTestQuestions.length - answeredCount})</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted ring-2 ring-amber-400"></div>
                <span>Đã đánh dấu ({flaggedQuestions.size})</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận nộp bài</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn đã trả lời {answeredCount}/{mockTestQuestions.length} câu hỏi.
              {mockTestQuestions.length - answeredCount > 0 && (
                <span className="text-amber-600 block mt-2">
                  Còn {mockTestQuestions.length - answeredCount} câu chưa trả lời!
                </span>
              )}
              {flaggedQuestions.size > 0 && (
                <span className="text-amber-600 block mt-1">
                  Có {flaggedQuestions.size} câu bạn đã đánh dấu để xem lại.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Time Up Dialog */}
      <Dialog open={showTimeUpDialog} onOpenChange={() => {}}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Clock className="h-5 w-5" />
              Hết giờ làm bài!
            </DialogTitle>
            <DialogDescription>Thời gian làm bài đã kết thúc. Bài làm của bạn sẽ được tự động nộp.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleTimeUp}>Xem kết quả</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
