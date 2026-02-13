"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch } from "@/hooks/use-redux"
import { createTestRequest } from "@/store/slices/tests-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2, GripVertical, Save, Eye, ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import type { Question } from "@/types"

export default function CreateTestPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [testInfo, setTestInfo] = useState({
    title: "",
    subject: "",
    grade: "",
    description: "",
    duration: 45,
    passingScore: 50,
    shuffleQuestions: true,
    shuffleOptions: true,
    showResults: true,
    allowReview: true,
  })

  // Types from local state might differ slightly from global types, ensuring compatibility
  // Using explicit local type matching current implementation for now, or just mapping when saving
  const [questions, setQuestions] = useState<any[]>([])
  const [showAddQuestion, setShowAddQuestion] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<any | null>(null)
  const [newQuestion, setNewQuestion] = useState<any>({
    type: "single",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
    points: 10,
    explanation: "",
  })

  const handleAddQuestion = () => {
    if (!newQuestion.question) return

    const question = {
      id: `q${Date.now()}`,
      type: newQuestion.type === "single" ? "multiple_choice" : newQuestion.type === "multiple" ? "multiple_choice" : "essay", // Mapping to global type
      content: newQuestion.question,
      options: newQuestion.type === "essay" ? [] : newQuestion.options || [],
      correctAnswer: newQuestion.correctAnswer || "",
      points: newQuestion.points || 10,
      explanation: newQuestion.explanation,
      // Store original type for UI edit if needed
      _uiType: newQuestion.type,
    }

    if (editingQuestion) {
      setQuestions(questions.map((q) => (q.id === editingQuestion.id ? question : q)))
      setEditingQuestion(null)
    } else {
      setQuestions([...questions, question])
    }

    setNewQuestion({
      type: "single",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: "",
      points: 10,
      explanation: "",
    })
    setShowAddQuestion(false)
  }

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question)
    setNewQuestion({
      type: question._uiType || (question.type === "multiple_choice" ? "single" : "essay"),
      question: question.content,
      options: question.options,
      correctAnswer: question.correctAnswer,
      points: question.points,
      explanation: question.explanation,
    })
    setShowAddQuestion(true)
  }

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const handleSaveTest = (publish: boolean) => {
    const payload = {
      title: testInfo.title,
      subjectId: testInfo.subject, // Assuming ID is value
      subjectName: testInfo.subject === 'math' ? 'Toán học' : 'Môn khác', // Simple mock mapping
      grade: parseInt(testInfo.grade) || 12,
      duration: testInfo.duration,
      passingScore: testInfo.passingScore,
      aiProctoring: true, // Default
      questions: questions.map(q => ({
        id: q.id,
        type: q.type,
        content: q.content || q.question, // Handle both if mixing types
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: q.points,
        explanation: q.explanation,
        aiGenerated: false
      })),
      // Additional metadata
    }

    dispatch(createTestRequest(payload))
    router.push("/dashboard/test-manager/tests")
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/test-manager/tests">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tạo bài kiểm tra mới</h1>
            <p className="text-muted-foreground mt-1">Tạo bài kiểm tra thủ công với các câu hỏi tùy chỉnh</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleSaveTest(false)}>
            <Save className="h-4 w-4 mr-2" />
            Lưu nháp
          </Button>
          <Button onClick={() => handleSaveTest(true)} disabled={questions.length === 0}>
            <Eye className="h-4 w-4 mr-2" />
            Xuất bản
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Test Info */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bài kiểm tra</CardTitle>
            <CardDescription>Cấu hình cơ bản cho bài kiểm tra</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input
                placeholder="VD: Kiểm tra Toán học chương 1"
                value={testInfo.title}
                onChange={(e) => setTestInfo({ ...testInfo, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Môn học</Label>
              <Select value={testInfo.subject} onValueChange={(v) => setTestInfo({ ...testInfo, subject: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="math">Toán học</SelectItem>
                  <SelectItem value="english">Tiếng Anh</SelectItem>
                  <SelectItem value="physics">Vật lý</SelectItem>
                  <SelectItem value="chemistry">Hóa học</SelectItem>
                  <SelectItem value="biology">Sinh học</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Lớp</Label>
              <Select value={testInfo.grade} onValueChange={(v) => setTestInfo({ ...testInfo, grade: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Lớp 10</SelectItem>
                  <SelectItem value="11">Lớp 11</SelectItem>
                  <SelectItem value="12">Lớp 12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                placeholder="Mô tả ngắn về bài kiểm tra..."
                value={testInfo.description}
                onChange={(e) => setTestInfo({ ...testInfo, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Thời gian (phút)</Label>
                <Input
                  type="number"
                  value={testInfo.duration}
                  onChange={(e) => setTestInfo({ ...testInfo, duration: Number.parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Điểm đạt (%)</Label>
                <Input
                  type="number"
                  value={testInfo.passingScore}
                  onChange={(e) => setTestInfo({ ...testInfo, passingScore: Number.parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <Label>Xáo trộn câu hỏi</Label>
                <Switch
                  checked={testInfo.shuffleQuestions}
                  onCheckedChange={(v) => setTestInfo({ ...testInfo, shuffleQuestions: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Xáo trộn đáp án</Label>
                <Switch
                  checked={testInfo.shuffleOptions}
                  onCheckedChange={(v) => setTestInfo({ ...testInfo, shuffleOptions: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Hiện kết quả ngay</Label>
                <Switch
                  checked={testInfo.showResults}
                  onCheckedChange={(v) => setTestInfo({ ...testInfo, showResults: v })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Cho phép xem lại</Label>
                <Switch
                  checked={testInfo.allowReview}
                  onCheckedChange={(v) => setTestInfo({ ...testInfo, allowReview: v })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Câu hỏi ({questions.length})</CardTitle>
                <CardDescription>Tổng điểm: {totalPoints}</CardDescription>
              </div>
              <Button onClick={() => setShowAddQuestion(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm câu hỏi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {questions.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Chưa có câu hỏi</h3>
                <p className="text-muted-foreground mb-4">Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu tạo bài kiểm tra</p>
                <Button onClick={() => setShowAddQuestion(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm câu hỏi đầu tiên
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="cursor-move text-muted-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold">Câu {index + 1}.</span>
                        <Badge variant="outline">
                          {question._uiType === "single"
                            ? "Một đáp án"
                            : question._uiType === "multiple"
                              ? "Nhiều đáp án"
                              : "Tự luận"}
                        </Badge>
                        <Badge variant="secondary">{question.points} điểm</Badge>
                      </div>
                      <p className="mb-2">{question.content || question.question}</p>
                      {question.options.length > 0 && (
                        <div className="space-y-1 text-sm text-muted-foreground">
                          {question.options.map((opt: string, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <span>{String.fromCharCode(65 + i)}.</span>
                              <span>{opt}</span>
                              {(Array.isArray(question.correctAnswer)
                                ? question.correctAnswer.includes(opt)
                                : question.correctAnswer === opt) && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">Đúng</Badge>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleEditQuestion(question)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteQuestion(question.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Question Dialog */}
      <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}</DialogTitle>
            <DialogDescription>Điền thông tin câu hỏi và đáp án</DialogDescription>
          </DialogHeader>

          <Tabs
            value={newQuestion.type}
            onValueChange={(v) => setNewQuestion({ ...newQuestion, type: v as "single" | "multiple" | "essay" })}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">Một đáp án</TabsTrigger>
              <TabsTrigger value="multiple">Nhiều đáp án</TabsTrigger>
              <TabsTrigger value="essay">Tự luận</TabsTrigger>
            </TabsList>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Câu hỏi</Label>
                <Textarea
                  placeholder="Nhập nội dung câu hỏi..."
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Điểm</Label>
                  <Input
                    type="number"
                    value={newQuestion.points}
                    onChange={(e) => setNewQuestion({ ...newQuestion, points: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <TabsContent value="single" className="space-y-4 mt-0">
                <Label>Các đáp án (chọn đáp án đúng)</Label>
                <RadioGroup
                  value={newQuestion.correctAnswer as string}
                  onValueChange={(v) => setNewQuestion({ ...newQuestion, correctAnswer: v })}
                >
                  {newQuestion.options?.map((opt: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <RadioGroupItem value={opt || `option-${index}`} id={`option-${index}`} />
                      <Input
                        placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                        value={opt}
                        onChange={(e) => {
                          const newOptions = [...(newQuestion.options || [])]
                          newOptions[index] = e.target.value
                          setNewQuestion({ ...newQuestion, options: newOptions })
                        }}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </RadioGroup>
              </TabsContent>

              <TabsContent value="multiple" className="space-y-4 mt-0">
                <Label>Các đáp án (chọn các đáp án đúng)</Label>
                {newQuestion.options?.map((opt: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Checkbox
                      checked={(newQuestion.correctAnswer as string[])?.includes(opt)}
                      onCheckedChange={(checked) => {
                        const current = (newQuestion.correctAnswer as string[]) || []
                        if (checked) {
                          setNewQuestion({ ...newQuestion, correctAnswer: [...current, opt] })
                        } else {
                          setNewQuestion({ ...newQuestion, correctAnswer: current.filter((a) => a !== opt) })
                        }
                      }}
                    />
                    <Input
                      placeholder={`Đáp án ${String.fromCharCode(65 + index)}`}
                      value={opt}
                      onChange={(e) => {
                        const newOptions = [...(newQuestion.options || [])]
                        newOptions[index] = e.target.value
                        setNewQuestion({ ...newQuestion, options: newOptions })
                      }}
                      className="flex-1"
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="essay" className="mt-0">
                <p className="text-sm text-muted-foreground">
                  Câu hỏi tự luận không cần đáp án. Học sinh sẽ nhập câu trả lời dạng văn bản.
                </p>
              </TabsContent>

              <div className="space-y-2">
                <Label>Giải thích (tùy chọn)</Label>
                <Textarea
                  placeholder="Giải thích đáp án đúng..."
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                />
              </div>
            </div>
          </Tabs>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddQuestion(false)
                setEditingQuestion(null)
                setNewQuestion({
                  type: "single",
                  question: "",
                  options: ["", "", "", ""],
                  correctAnswer: "",
                  points: 10,
                  explanation: "",
                })
              }}
            >
              Hủy
            </Button>
            <Button onClick={handleAddQuestion}>{editingQuestion ? "Cập nhật" : "Thêm câu hỏi"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
