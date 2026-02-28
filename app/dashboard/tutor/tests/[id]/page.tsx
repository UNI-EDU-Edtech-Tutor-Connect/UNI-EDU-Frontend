"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
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
import { Clock, ChevronLeft, ChevronRight, Flag, Send, AlertTriangle } from "lucide-react"

interface Question {
    id: string
    type: "single" | "multiple" | "essay"
    question: string
    options?: string[]
    points: number
}

const mockQuestions: Question[] = [
    {
        id: "q1",
        type: "single",
        question: "Phương trình bậc hai ax² + bx + c = 0 (a ≠ 0) có nghiệm kép khi:",
        options: ["Δ > 0", "Δ = 0", "Δ < 0", "a = 0"],
        points: 10,
    },
    {
        id: "q2",
        type: "single",
        question: "Giới hạn lim(x→0) sin(x)/x bằng:",
        options: ["0", "1", "∞", "Không xác định"],
        points: 10,
    },
    {
        id: "q3",
        type: "multiple",
        question: "Chọn các phát biểu đúng về hàm số y = x²:",
        options: ["Hàm số chẵn", "Hàm số lẻ", "Đồ thị là parabol", "Hàm số đơn điệu trên R", "Có đỉnh tại gốc tọa độ"],
        points: 15,
    },
    {
        id: "q4",
        type: "single",
        question: "Đạo hàm của hàm số y = e^x là:",
        options: ["e^x", "x·e^(x-1)", "e^x · ln(e)", "xe^x"],
        points: 10,
    },
    {
        id: "q5",
        type: "essay",
        question: "Giải phương trình: x² - 5x + 6 = 0. Trình bày đầy đủ các bước giải.",
        points: 20,
    },
    {
        id: "q6",
        type: "single",
        question: "Tích phân ∫x dx bằng:",
        options: ["x²/2 + C", "x² + C", "2x + C", "1 + C"],
        points: 10,
    },
    {
        id: "q7",
        type: "multiple",
        question: "Trong không gian Oxyz, mặt phẳng có thể được xác định bởi:",
        options: [
            "Ba điểm không thẳng hàng",
            "Một điểm và một véc-tơ pháp tuyến",
            "Hai đường thẳng song song",
            "Hai điểm bất kỳ",
            "Một đường thẳng và một điểm không thuộc đường thẳng đó",
        ],
        points: 15,
    },
    {
        id: "q8",
        type: "single",
        question: "Ma trận đơn vị cấp 3 có định thức bằng:",
        options: ["0", "1", "3", "-1"],
        points: 10,
    },
]

export default function TestStartPage() {
    const params = useParams()
    const router = useRouter()
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set())
    const [timeLeft, setTimeLeft] = useState(45 * 60) // 45 minutes in seconds
    const [showSubmitDialog, setShowSubmitDialog] = useState(false)
    const [showTimeWarning, setShowTimeWarning] = useState(false)

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer)
                    handleSubmit()
                    return 0
                }
                if (prev === 300 && !showTimeWarning) {
                    setShowTimeWarning(true)
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [showTimeWarning])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const question = mockQuestions[currentQuestion]
    const progress = ((currentQuestion + 1) / mockQuestions.length) * 100
    const answeredCount = Object.keys(answers).length

    const handleSingleAnswer = (value: string) => {
        setAnswers({ ...answers, [question.id]: value })
    }

    const handleMultipleAnswer = (option: string, checked: boolean) => {
        const currentAnswers = (answers[question.id] as string[]) || []
        if (checked) {
            setAnswers({ ...answers, [question.id]: [...currentAnswers, option] })
        } else {
            setAnswers({ ...answers, [question.id]: currentAnswers.filter((a) => a !== option) })
        }
    }

    const handleEssayAnswer = (value: string) => {
        setAnswers({ ...answers, [question.id]: value })
    }

    const toggleFlag = () => {
        const newFlagged = new Set(flaggedQuestions)
        if (newFlagged.has(question.id)) {
            newFlagged.delete(question.id)
        } else {
            newFlagged.add(question.id)
        }
        setFlaggedQuestions(newFlagged)
    }

    const handleSubmit = useCallback(() => {
        // TODO: Call API to submit test answers
        router.push(`/dashboard/tutor/tests`)
    }, [router, params.id])

    const getTimeColor = () => {
        if (timeLeft <= 300) return "text-red-600"
        if (timeLeft <= 600) return "text-orange-500"
        return "text-foreground"
    }

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-background border-b">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="font-semibold">Kiểm tra Toán học - Đại số</h1>
                            <p className="text-sm text-muted-foreground">
                                Câu {currentQuestion + 1}/{mockQuestions.length}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 font-mono text-lg ${getTimeColor()}`}>
                                <Clock className="h-5 w-5" />
                                {formatTime(timeLeft)}
                            </div>
                            <Button onClick={() => setShowSubmitDialog(true)}>
                                <Send className="h-4 w-4 mr-2" />
                                Nộp bài
                            </Button>
                        </div>
                    </div>
                    <Progress value={progress} className="mt-3 h-2" />
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                <div className="grid gap-6 lg:grid-cols-4">
                    {/* Question Panel */}
                    <div className="lg:col-span-3">
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Badge variant="outline" className="mb-2">
                                            {question.type === "single"
                                                ? "Một đáp án"
                                                : question.type === "multiple"
                                                    ? "Nhiều đáp án"
                                                    : "Tự luận"}
                                        </Badge>
                                        <CardTitle className="text-xl">
                                            Câu {currentQuestion + 1}: {question.question}
                                        </CardTitle>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Badge>{question.points} điểm</Badge>
                                        <Button
                                            variant={flaggedQuestions.has(question.id) ? "default" : "outline"}
                                            size="icon"
                                            onClick={toggleFlag}
                                        >
                                            <Flag className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {question.type === "single" && question.options && (
                                    <RadioGroup
                                        value={(answers[question.id] as string) || ""}
                                        onValueChange={handleSingleAnswer}
                                        className="space-y-3"
                                    >
                                        {question.options.map((option, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                                            >
                                                <RadioGroupItem value={option} id={`option-${index}`} />
                                                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                                    {String.fromCharCode(65 + index)}. {option}
                                                </Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                )}

                                {question.type === "multiple" && question.options && (
                                    <div className="space-y-3">
                                        {question.options.map((option, index) => {
                                            const currentAnswers = (answers[question.id] as string[]) || []
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-accent/50 cursor-pointer"
                                                >
                                                    <Checkbox
                                                        id={`option-${index}`}
                                                        checked={currentAnswers.includes(option)}
                                                        onCheckedChange={(checked) => handleMultipleAnswer(option, checked as boolean)}
                                                    />
                                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                                        {String.fromCharCode(65 + index)}. {option}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                {question.type === "essay" && (
                                    <Textarea
                                        placeholder="Nhập câu trả lời của bạn..."
                                        value={(answers[question.id] as string) || ""}
                                        onChange={(e) => handleEssayAnswer(e.target.value)}
                                        className="min-h-[200px]"
                                    />
                                )}

                                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                                    <Button
                                        variant="outline"
                                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                                        disabled={currentQuestion === 0}
                                    >
                                        <ChevronLeft className="h-4 w-4 mr-2" />
                                        Câu trước
                                    </Button>
                                    <Button
                                        onClick={() => setCurrentQuestion(Math.min(mockQuestions.length - 1, currentQuestion + 1))}
                                        disabled={currentQuestion === mockQuestions.length - 1}
                                    >
                                        Câu tiếp
                                        <ChevronRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Question Navigator */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-base">Danh sách câu hỏi</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Đã trả lời: {answeredCount}/{mockQuestions.length}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-5 gap-2">
                                    {mockQuestions.map((q, index) => {
                                        const isAnswered = !!answers[q.id]
                                        const isFlagged = flaggedQuestions.has(q.id)
                                        const isCurrent = index === currentQuestion

                                        return (
                                            <Button
                                                key={q.id}
                                                variant={isCurrent ? "default" : isAnswered ? "secondary" : "outline"}
                                                size="sm"
                                                className={`relative ${isFlagged ? "ring-2 ring-orange-500" : ""}`}
                                                onClick={() => setCurrentQuestion(index)}
                                            >
                                                {index + 1}
                                                {isFlagged && <Flag className="absolute -top-1 -right-1 h-3 w-3 text-orange-500" />}
                                            </Button>
                                        )
                                    })}
                                </div>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded bg-primary" />
                                        <span>Đang xem</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded bg-secondary" />
                                        <span>Đã trả lời</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded border" />
                                        <span>Chưa trả lời</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-4 w-4 rounded border ring-2 ring-orange-500" />
                                        <span>Đánh dấu</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Submit Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận nộp bài?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn đã trả lời {answeredCount}/{mockQuestions.length} câu hỏi.
                            {answeredCount < mockQuestions.length && (
                                <span className="block mt-2 text-orange-600">
                                    Còn {mockQuestions.length - answeredCount} câu chưa trả lời!
                                </span>
                            )}
                            {flaggedQuestions.size > 0 && (
                                <span className="block mt-1 text-orange-600">
                                    Có {flaggedQuestions.size} câu đã đánh dấu cần xem lại.
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

            {/* Time Warning Dialog */}
            <AlertDialog open={showTimeWarning} onOpenChange={setShowTimeWarning}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
                            <AlertTriangle className="h-5 w-5" />
                            Cảnh báo thời gian!
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn còn 5 phút để hoàn thành bài kiểm tra. Hãy kiểm tra lại các câu trả lời.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction>Đã hiểu</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
