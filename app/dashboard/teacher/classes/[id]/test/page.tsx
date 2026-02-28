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
import { ArrowLeft, ArrowRight, Clock, Flag, CheckCircle, AlertCircle, BookOpen, Award, XCircle, ShieldCheck } from "lucide-react"

// Mock test questions
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
]

const PASSING_SCORE = 70 // Điểm đậu: 70%

export default function TeacherQualificationTestPage() {
    const params = useParams()
    const router = useRouter()
    const [testStarted, setTestStarted] = useState(false)
    const [testCompleted, setTestCompleted] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<string, number | null>>({})
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
    const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes
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
                        <div className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                            <ShieldCheck className="h-8 w-8 text-amber-600" />
                        </div>
                        <CardTitle className="text-2xl">Bài kiểm tra nhận lớp ưu tiên</CardTitle>
                        <CardDescription className="text-base">Dành riêng cho Mộc Giáo Viên Kiểm Định</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-primary">{mockTestQuestions.length}</p>
                                <p className="text-sm text-muted-foreground">Câu hỏi rút gọn</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-primary">15</p>
                                <p className="text-sm text-muted-foreground">Phút</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-accent">{PASSING_SCORE}%</p>
                                <p className="text-sm text-muted-foreground">Điểm đậu</p>
                            </div>
                            <div className="p-4 rounded-lg bg-muted/50">
                                <p className="text-2xl font-bold text-green-600">3</p>
                                <p className="text-sm text-muted-foreground">Lần thi / ngày</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                            <div className="flex items-start gap-3">
                                <ShieldCheck className="h-5 w-5 text-amber-600 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-amber-800">Đặc quyền Giáo Viên</p>
                                    <ul className="mt-2 space-y-1 text-amber-700">
                                        <li>• Đề kiểm tra được rút ngắn 50% thời gian</li>
                                        <li>• Tỷ lệ đậu cho phép cao hơn</li>
                                        <li>• Nếu đậu sẽ nhận lớp học ngay lập tức mà không phải chờ duyệt</li>
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
                            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${testResult.passed ? "bg-green-100" : "bg-red-100"
                                }`}
                        >
                            {testResult.passed ? (
                                <Award className="h-10 w-10 text-green-600" />
                            ) : (
                                <XCircle className="h-10 w-10 text-red-600" />
                            )}
                        </div>
                        <CardTitle className="text-2xl">
                            {testResult.passed ? "Chúc mừng! Nhận Lớp Thành Công" : "Rất tiếc! Bạn chưa đậu bài Test Ưu Tiên"}
                        </CardTitle>
                        <CardDescription className="text-base">
                            {testResult.passed
                                ? "Với đặc quyền Giáo Viên Kiểm Định, bạn đã nhận được lớp mà không cần phải chờ đợi. Tiến hành thao tác tiếp theo."
                                : "Điểm của bạn chưa đạt yêu cầu. Bạn còn 2 lần thi trong ngày hôm nay."}
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
                                            Xin mời thanh toán phí thu nhận ưu tiên qua tài khoản thanh toán nội bộ để hiển thị danh sách lớp và liên hệ học sinh.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : null}

                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" className="flex-1 bg-transparent" asChild>
                                <a href="/dashboard/teacher/classes">Về danh sách Lớp</a>
                            </Button>
                            {testResult.passed && (
                                <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
                                    <a href={`/dashboard/teacher/classes/${params.id}/payment`}>Thanh toán & Nhận thông tin</a>
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
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        Bài kiểm tra: Tuyển dụng Ưu Tiên
                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Câu {currentQuestion + 1} / {mockTestQuestions.length}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${timeLeft <= 120 ? "bg-red-100 text-red-700" : "bg-muted"
                            }`}
                    >
                        <Clock className={`h-5 w-5 ${timeLeft <= 120 ? "animate-pulse" : ""}`} />
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
                                        className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${answers[currentQ.id] === index ? "border-primary bg-primary/5" : "hover:bg-muted/50"
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
                                    className={`w-full aspect-square rounded-lg text-sm font-medium transition-colors ${currentQuestion === index
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
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Tiếp tục làm bài</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>Nộp bài</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Time Up Dialog */}
            <Dialog open={showTimeUpDialog} onOpenChange={() => { }}>
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
