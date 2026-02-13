"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  FileText,
  Upload,
  Loader2,
  CheckCircle,
  RefreshCw,
  Save,
  Eye,
  Wand2,
  BookOpen,
  Target,
} from "lucide-react"

interface GeneratedQuestion {
  id: string
  type: "single" | "multiple" | "essay"
  question: string
  options?: string[]
  correctAnswer?: string | string[]
  explanation?: string
  difficulty: "easy" | "medium" | "hard"
  points: number
}

export default function AIGeneratePage() {
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set())

  // Form states
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [grade, setGrade] = useState("")
  const [questionCount, setQuestionCount] = useState([10])
  const [difficulty, setDifficulty] = useState("medium")
  const [includeExplanations, setIncludeExplanations] = useState(true)
  const [customPrompt, setCustomPrompt] = useState("")

  const handleGenerate = async () => {
    setGenerating(true)
    setProgress(0)
    setGeneratedQuestions([])

    // Simulate AI generation with progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 500)

    // TODO: Call AI API to generate questions
    // POST /api/ai/generate-test with subject, topic, grade, questionCount, difficulty, customPrompt
    setTimeout(() => {
      clearInterval(interval)
      setProgress(100)
      setGenerating(false)

      // Mock generated questions
      const mockQuestions: GeneratedQuestion[] = [
        {
          id: "q1",
          type: "single",
          question: "Phương trình bậc hai ax² + bx + c = 0 (a ≠ 0) có nghiệm kép khi:",
          options: ["Δ > 0", "Δ = 0", "Δ < 0", "a = 0"],
          correctAnswer: "Δ = 0",
          explanation:
            "Phương trình bậc hai có nghiệm kép khi và chỉ khi biệt thức Δ = b² - 4ac = 0. Khi đó, nghiệm kép x = -b/(2a).",
          difficulty: "medium",
          points: 10,
        },
        {
          id: "q2",
          type: "single",
          question: "Giới hạn lim(x→0) sin(x)/x bằng:",
          options: ["0", "1", "∞", "Không xác định"],
          correctAnswer: "1",
          explanation:
            "Đây là giới hạn cơ bản quan trọng trong giải tích. Có thể chứng minh bằng quy tắc kẹp hoặc quy tắc L'Hôpital.",
          difficulty: "medium",
          points: 10,
        },
        {
          id: "q3",
          type: "multiple",
          question: "Chọn các phát biểu đúng về hàm số y = x²:",
          options: [
            "Hàm số chẵn",
            "Hàm số lẻ",
            "Đồ thị là parabol",
            "Hàm số đơn điệu trên R",
            "Có đỉnh tại gốc tọa độ",
          ],
          correctAnswer: ["Hàm số chẵn", "Đồ thị là parabol", "Có đỉnh tại gốc tọa độ"],
          explanation:
            "y = x² là hàm chẵn vì f(-x) = f(x). Đồ thị là parabol có đỉnh tại O(0,0). Hàm không đơn điệu trên R vì giảm trên (-∞,0) và tăng trên (0,+∞).",
          difficulty: "hard",
          points: 15,
        },
        {
          id: "q4",
          type: "single",
          question: "Đạo hàm của hàm số y = e^x là:",
          options: ["e^x", "x·e^(x-1)", "e^x · ln(e)", "xe^x"],
          correctAnswer: "e^x",
          explanation:
            "Hàm số e^x có tính chất đặc biệt là đạo hàm của nó bằng chính nó. Đây là một trong những tính chất quan trọng nhất của hàm mũ cơ số e.",
          difficulty: "easy",
          points: 10,
        },
        {
          id: "q5",
          type: "essay",
          question: "Giải phương trình: x² - 5x + 6 = 0. Trình bày đầy đủ các bước giải.",
          explanation:
            "Sử dụng công thức nghiệm hoặc phân tích thành nhân tử: x² - 5x + 6 = (x-2)(x-3) = 0, suy ra x = 2 hoặc x = 3.",
          difficulty: "easy",
          points: 20,
        },
      ]

      setGeneratedQuestions(mockQuestions)
    }, 5500)
  }

  const toggleQuestionSelection = (id: string) => {
    const newSelected = new Set(selectedQuestions)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedQuestions(newSelected)
  }

  const selectAll = () => {
    if (selectedQuestions.size === generatedQuestions.length) {
      setSelectedQuestions(new Set())
    } else {
      setSelectedQuestions(new Set(generatedQuestions.map((q) => q.id)))
    }
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "easy":
        return <Badge className="bg-green-100 text-green-800">Dễ</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>
      case "hard":
        return <Badge className="bg-red-100 text-red-800">Khó</Badge>
      default:
        return <Badge>{diff}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "single":
        return <Badge variant="outline">Một đáp án</Badge>
      case "multiple":
        return <Badge variant="outline">Nhiều đáp án</Badge>
      case "essay":
        return <Badge variant="outline">Tự luận</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-8 w-8 text-primary" />
          Tạo bài kiểm tra bằng AI
        </h1>
        <p className="text-muted-foreground mt-1">Sử dụng trí tuệ nhân tạo để tạo câu hỏi chất lượng cao tự động</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Configuration Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Cấu hình
            </CardTitle>
            <CardDescription>Thiết lập thông số cho bài kiểm tra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Toán học</SelectItem>
                  <SelectItem value="english">Tiếng Anh</SelectItem>
                  <SelectItem value="physics">Vật lý</SelectItem>
                  <SelectItem value="chemistry">Hóa học</SelectItem>
                  <SelectItem value="biology">Sinh học</SelectItem>
                  <SelectItem value="literature">Ngữ văn</SelectItem>
                  <SelectItem value="history">Lịch sử</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chủ đề / Chương</Label>
              <Input
                placeholder="VD: Đại số tuyến tính, Điện từ học..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Lớp / Cấp độ</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Lớp 10</SelectItem>
                  <SelectItem value="11">Lớp 11</SelectItem>
                  <SelectItem value="12">Lớp 12</SelectItem>
                  <SelectItem value="university">Đại học</SelectItem>
                  <SelectItem value="ielts">IELTS</SelectItem>
                  <SelectItem value="toeic">TOEIC</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Số câu hỏi</Label>
                <span className="text-sm font-medium">{questionCount[0]} câu</span>
              </div>
              <Slider value={questionCount} onValueChange={setQuestionCount} min={5} max={50} step={5} />
            </div>

            <div className="space-y-2">
              <Label>Độ khó</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                  <SelectItem value="mixed">Hỗn hợp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Bao gồm giải thích</Label>
                <p className="text-xs text-muted-foreground">AI sẽ tạo lời giải cho mỗi câu</p>
              </div>
              <Switch checked={includeExplanations} onCheckedChange={setIncludeExplanations} />
            </div>

            <div className="space-y-2">
              <Label>Yêu cầu tùy chỉnh (tùy chọn)</Label>
              <Textarea
                placeholder="VD: Tập trung vào ứng dụng thực tế, bao gồm các dạng bài tập khó..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={generating || !subject || !topic || !grade}>
              {generating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Tạo câu hỏi
                </>
              )}
            </Button>

            {generating && (
              <div className="space-y-2">
                <Progress value={progress} className="h-2" />
                <p className="text-sm text-center text-muted-foreground">AI đang phân tích và tạo câu hỏi...</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Generated Questions Panel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Câu hỏi đã tạo
                </CardTitle>
                <CardDescription>
                  {generatedQuestions.length > 0
                    ? `${generatedQuestions.length} câu hỏi - Đã chọn: ${selectedQuestions.size}`
                    : "Cấu hình và nhấn tạo để xem câu hỏi"}
                </CardDescription>
              </div>
              {generatedQuestions.length > 0 && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={selectAll}>
                    {selectedQuestions.size === generatedQuestions.length ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleGenerate}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tạo lại
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {generatedQuestions.length === 0 ? (
              <div className="text-center py-12">
                <Sparkles className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có câu hỏi</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Điền thông tin cấu hình bên trái và nhấn &quot;Tạo câu hỏi&quot; để AI tạo bài kiểm tra cho bạn
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedQuestions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedQuestions.has(question.id) ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                    }`}
                    onClick={() => toggleQuestionSelection(question.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          selectedQuestions.has(question.id) ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeBadge(question.type)}
                          {getDifficultyBadge(question.difficulty)}
                          <Badge variant="secondary">{question.points} điểm</Badge>
                        </div>
                        <p className="font-medium mb-3">{question.question}</p>

                        {question.options && (
                          <div className="space-y-2 mb-3">
                            {question.options.map((option, optIndex) => {
                              const isCorrect = Array.isArray(question.correctAnswer)
                                ? question.correctAnswer.includes(option)
                                : question.correctAnswer === option

                              return (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded text-sm ${
                                    isCorrect ? "bg-green-100 text-green-800" : "bg-muted"
                                  }`}
                                >
                                  {String.fromCharCode(65 + optIndex)}. {option}
                                  {isCorrect && <CheckCircle className="inline h-4 w-4 ml-2" />}
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {question.explanation && includeExplanations && (
                          <div className="p-3 bg-blue-50 rounded-lg text-sm">
                            <p className="font-medium text-blue-800 mb-1">Giải thích:</p>
                            <p className="text-blue-700">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>

          {generatedQuestions.length > 0 && selectedQuestions.size > 0 && (
            <div className="p-4 border-t bg-muted/50">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Đã chọn {selectedQuestions.size} câu hỏi - Tổng điểm:{" "}
                  {generatedQuestions.filter((q) => selectedQuestions.has(q.id)).reduce((sum, q) => sum + q.points, 0)}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Xem trước
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Lưu bài kiểm tra
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Additional AI Features */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Tạo từ tài liệu
            </CardTitle>
            <CardDescription>Upload PDF, Word để AI trích xuất câu hỏi</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Kéo thả tài liệu vào đây hoặc</p>
              <Button variant="outline" size="sm">
                Chọn file
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Từ ngân hàng câu hỏi
            </CardTitle>
            <CardDescription>Chọn câu hỏi có sẵn và để AI bổ sung</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              AI sẽ phân tích các câu hỏi có sẵn và tạo thêm câu hỏi tương tự hoặc bổ sung
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Chọn từ ngân hàng
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Theo mục tiêu học tập
            </CardTitle>
            <CardDescription>Tạo câu hỏi theo chuẩn đầu ra</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Nhập mục tiêu học tập, AI sẽ tạo câu hỏi đánh giá việc đạt được mục tiêu đó
            </p>
            <Button variant="outline" className="w-full bg-transparent">
              Thiết lập mục tiêu
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
