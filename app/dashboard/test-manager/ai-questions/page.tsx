"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Sparkles, Upload, FileText, Wand2, Save, RefreshCw, Check } from "lucide-react"

const generatedQuestions = [
  {
    id: 1,
    content: "Cho hàm số y = x³ - 3x + 2. Tìm giá trị cực đại của hàm số.",
    type: "multiple_choice",
    difficulty: "medium",
    options: ["y = 4", "y = 0", "y = 2", "y = -2"],
    answer: "A",
    selected: false,
  },
  {
    id: 2,
    content: "Giải phương trình: 2sin²x - 3sinx + 1 = 0",
    type: "multiple_choice",
    difficulty: "hard",
    options: [
      "x = π/6 + kπ hoặc x = π/2 + k2π",
      "x = π/3 + kπ hoặc x = π/4 + k2π",
      "x = π/6 + k2π hoặc x = π/2 + k2π",
      "x = π/3 + k2π hoặc x = π/2 + kπ",
    ],
    answer: "A",
    selected: false,
  },
  {
    id: 3,
    content: "Tính tích phân: ∫(0 đến 1) x²e^x dx",
    type: "multiple_choice",
    difficulty: "hard",
    options: ["e - 2", "e - 1", "2e - 5", "e + 1"],
    answer: "A",
    selected: false,
  },
  {
    id: 4,
    content: "Cho cấp số nhân (uₙ) với u₁ = 2 và công bội q = 3. Tính S₅.",
    type: "multiple_choice",
    difficulty: "easy",
    options: ["242", "243", "240", "244"],
    answer: "A",
    selected: false,
  },
]

export default function AIQuestionsPage() {
  const [subject, setSubject] = useState("")
  const [topic, setTopic] = useState("")
  const [questionCount, setQuestionCount] = useState("10")
  const [difficulty, setDifficulty] = useState("mixed")
  const [documentText, setDocumentText] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [questions, setQuestions] = useState(generatedQuestions)
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setShowResults(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  const toggleQuestionSelection = (id: number) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q)))
  }

  const selectAllQuestions = () => {
    setQuestions((prev) => prev.map((q) => ({ ...q, selected: true })))
  }

  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case "easy":
        return <Badge className="bg-green-100 text-green-700">Dễ</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700">TB</Badge>
      case "hard":
        return <Badge className="bg-red-100 text-red-700">Khó</Badge>
      default:
        return <Badge variant="outline">{diff}</Badge>
    }
  }

  const selectedCount = questions.filter((q) => q.selected).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sinh câu hỏi từ tài liệu</h1>
        <p className="text-muted-foreground">Sử dụng AI để tạo câu hỏi từ nội dung tài liệu</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Nhập tài liệu
            </CardTitle>
            <CardDescription>Dán nội dung hoặc tải file tài liệu lên</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nội dung tài liệu</Label>
              <Textarea
                placeholder="Dán nội dung tài liệu vào đây... AI sẽ phân tích và tạo câu hỏi từ nội dung này."
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value)}
                rows={10}
              />
            </div>
            <div className="text-center py-4 border-2 border-dashed rounded-lg">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Hoặc kéo thả file PDF, DOCX, TXT</p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Chọn file
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Cấu hình sinh câu hỏi
            </CardTitle>
            <CardDescription>Tùy chỉnh các thông số để tạo câu hỏi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Môn học</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn môn học" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Toán học</SelectItem>
                    <SelectItem value="physics">Vật lý</SelectItem>
                    <SelectItem value="chemistry">Hóa học</SelectItem>
                    <SelectItem value="english">Tiếng Anh</SelectItem>
                    <SelectItem value="literature">Ngữ văn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Số câu hỏi</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 câu</SelectItem>
                    <SelectItem value="10">10 câu</SelectItem>
                    <SelectItem value="20">20 câu</SelectItem>
                    <SelectItem value="30">30 câu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Chủ đề / Chương</Label>
              <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="VD: Giải tích, Đại số..." />
            </div>

            <div className="space-y-2">
              <Label>Độ khó</Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mixed">Hỗn hợp</SelectItem>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Loại câu hỏi</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="multiple" defaultChecked />
                  <label htmlFor="multiple" className="text-sm">
                    Trắc nghiệm
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="essay" />
                  <label htmlFor="essay" className="text-sm">
                    Tự luận
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="fill" />
                  <label htmlFor="fill" className="text-sm">
                    Điền khuyết
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="truefalse" />
                  <label htmlFor="truefalse" className="text-sm">
                    Đúng/Sai
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={handleGenerate} disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Đang sinh câu hỏi...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Sinh câu hỏi
                </>
              )}
            </Button>

            {isGenerating && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">Đang phân tích tài liệu... {progress}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {showResults && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Câu hỏi được sinh ra
              </CardTitle>
              <CardDescription>
                Đã sinh {questions.length} câu hỏi - Đã chọn {selectedCount} câu
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={selectAllQuestions}>
                Chọn tất cả
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Sinh lại
              </Button>
              <Button size="sm" disabled={selectedCount === 0}>
                <Save className="mr-2 h-4 w-4" />
                Lưu ({selectedCount})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    q.selected ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => toggleQuestionSelection(q.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          q.selected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground"
                        }`}
                      >
                        {q.selected && <Check className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">Câu {index + 1}</Badge>
                          {getDifficultyBadge(q.difficulty)}
                          <Badge variant="secondary">Trắc nghiệm</Badge>
                        </div>
                        <p className="font-medium mb-2">{q.content}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded ${
                                String.fromCharCode(65 + i) === q.answer ? "bg-green-50 text-green-700" : "bg-muted"
                              }`}
                            >
                              <span className="font-medium">{String.fromCharCode(65 + i)}.</span> {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
