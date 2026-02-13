"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Plus, Edit, Trash2, Copy, BookOpen, FileText, Filter, Upload, Sparkles } from "lucide-react"

const questions = [
  {
    id: "Q001",
    content: "Cho hàm số y = x³ - 3x² + 2. Tìm các điểm cực trị của hàm số.",
    subject: "Toán",
    category: "Đại số",
    difficulty: "hard",
    type: "multiple_choice",
    usageCount: 45,
    correctRate: 62,
    createdAt: "10/12/2025",
  },
  {
    id: "Q002",
    content: "Which sentence is grammatically correct?",
    subject: "Tiếng Anh",
    category: "Grammar",
    difficulty: "medium",
    type: "multiple_choice",
    usageCount: 78,
    correctRate: 75,
    createdAt: "08/12/2025",
  },
  {
    id: "Q003",
    content: "Một electron chuyển động trong từ trường đều. Tính lực Lorentz tác dụng lên electron.",
    subject: "Vật Lý",
    category: "Điện từ học",
    difficulty: "hard",
    type: "essay",
    usageCount: 34,
    correctRate: 45,
    createdAt: "05/12/2025",
  },
  {
    id: "Q004",
    content: "Viết phương trình phản ứng este hóa giữa axit axetic và etanol.",
    subject: "Hóa Học",
    category: "Hữu cơ",
    difficulty: "easy",
    type: "short_answer",
    usageCount: 92,
    correctRate: 88,
    createdAt: "03/12/2025",
  },
  {
    id: "Q005",
    content: "Giải phương trình: log₂(x+1) + log₂(x-1) = 3",
    subject: "Toán",
    category: "Giải tích",
    difficulty: "medium",
    type: "multiple_choice",
    usageCount: 56,
    correctRate: 68,
    createdAt: "01/12/2025",
  },
]

const subjects = ["Toán", "Tiếng Anh", "Vật Lý", "Hóa Học", "Sinh học", "Ngữ Văn"]

export default function QuestionBankPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([])

  const filteredQuestions = questions.filter((q) => {
    const matchesSearch = q.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || q.subject === subjectFilter
    const matchesDifficulty = difficultyFilter === "all" || q.difficulty === difficultyFilter
    const matchesType = typeFilter === "all" || q.type === typeFilter
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType
  })

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-100 text-green-700">Dễ</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700">Trung bình</Badge>
      case "hard":
        return <Badge className="bg-red-100 text-red-700">Khó</Badge>
      default:
        return <Badge variant="outline">{difficulty}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return <Badge variant="outline">Trắc nghiệm</Badge>
      case "essay":
        return <Badge variant="outline">Tự luận</Badge>
      case "short_answer":
        return <Badge variant="outline">Trả lời ngắn</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const toggleSelectQuestion = (id: string) => {
    setSelectedQuestions((prev) => (prev.includes(id) ? prev.filter((q) => q !== id) : [...prev, id]))
  }

  const stats = {
    total: questions.length,
    bySubject: subjects.map((s) => ({
      subject: s,
      count: questions.filter((q) => q.subject === s).length,
    })),
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Ngân hàng câu hỏi</h1>
          <p className="text-muted-foreground">Quản lý và tổ chức câu hỏi cho các bài kiểm tra</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
          <Button variant="outline">
            <Sparkles className="mr-2 h-4 w-4" />
            Sinh bằng AI
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm câu hỏi
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Thêm câu hỏi mới</DialogTitle>
                <DialogDescription>Tạo câu hỏi mới cho ngân hàng câu hỏi</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Môn học</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn môn" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Độ khó</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="hard">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Loại câu hỏi</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="multiple_choice">Trắc nghiệm</SelectItem>
                        <SelectItem value="essay">Tự luận</SelectItem>
                        <SelectItem value="short_answer">Trả lời ngắn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Danh mục</Label>
                  <Input placeholder="VD: Đại số, Grammar..." />
                </div>
                <div className="space-y-2">
                  <Label>Nội dung câu hỏi</Label>
                  <Textarea placeholder="Nhập nội dung câu hỏi..." rows={4} />
                </div>
                <div className="space-y-2">
                  <Label>Đáp án A</Label>
                  <Input placeholder="Nhập đáp án A" />
                </div>
                <div className="space-y-2">
                  <Label>Đáp án B</Label>
                  <Input placeholder="Nhập đáp án B" />
                </div>
                <div className="space-y-2">
                  <Label>Đáp án C</Label>
                  <Input placeholder="Nhập đáp án C" />
                </div>
                <div className="space-y-2">
                  <Label>Đáp án D</Label>
                  <Input placeholder="Nhập đáp án D" />
                </div>
                <div className="space-y-2">
                  <Label>Đáp án đúng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn đáp án đúng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Giải thích (tùy chọn)</Label>
                  <Textarea placeholder="Giải thích đáp án..." rows={2} />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Lưu câu hỏi</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng câu hỏi</p>
                <p className="text-2xl font-bold">1,615</p>
              </div>
            </div>
          </CardContent>
        </Card>
        {stats.bySubject.slice(0, 4).map((s) => (
          <Card key={s.subject}>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{s.subject}</p>
              <p className="text-xl font-bold">{s.count > 0 ? s.count * 100 : Math.floor(Math.random() * 500) + 100}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm câu hỏi..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Độ khó" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="multiple_choice">Trắc nghiệm</SelectItem>
                  <SelectItem value="essay">Tự luận</SelectItem>
                  <SelectItem value="short_answer">Trả lời ngắn</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Actions */}
      {selectedQuestions.length > 0 && (
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Đã chọn {selectedQuestions.length} câu hỏi</span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Tạo đề thi
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Sao chép
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách câu hỏi</CardTitle>
          <CardDescription>Hiển thị {filteredQuestions.length} câu hỏi</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedQuestions.length === filteredQuestions.length && filteredQuestions.length > 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedQuestions(filteredQuestions.map((q) => q.id))
                      } else {
                        setSelectedQuestions([])
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Môn học</TableHead>
                <TableHead>Độ khó</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead className="text-right">Sử dụng</TableHead>
                <TableHead className="text-right">Tỷ lệ đúng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestions.map((q) => (
                <TableRow key={q.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedQuestions.includes(q.id)}
                      onCheckedChange={() => toggleSelectQuestion(q.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="truncate font-medium">{q.content}</p>
                      <p className="text-sm text-muted-foreground">{q.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{q.subject}</Badge>
                  </TableCell>
                  <TableCell>{getDifficultyBadge(q.difficulty)}</TableCell>
                  <TableCell>{getTypeBadge(q.type)}</TableCell>
                  <TableCell className="text-right">{q.usageCount}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={q.correctRate >= 70 ? "text-green-600" : q.correctRate >= 50 ? "" : "text-red-600"}
                    >
                      {q.correctRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
