"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchTestsRequest } from "@/store/slices/tests-slice"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataTable } from "@/components/dashboard/data-table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, Sparkles, MoreHorizontal, Eye, Edit, Copy, Trash2, BarChart3 } from "lucide-react"
import Link from "next/link"

export default function TestsListPage() {
  const dispatch = useDispatch()
  const { tests, loading } = useSelector((state: RootState) => state.tests)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchTestsRequest())
  }, [dispatch])

  const allTests = [
    {
      id: "1",
      title: "Toán học - Đại số tuyến tính",
      subject: "math",
      grade: "12",
      questions: 25,
      duration: 45,
      attempts: 156,
      avgScore: 78,
      status: "published",
      createdAt: "10/12/2025",
      createdBy: "AI",
    },
    {
      id: "2",
      title: "Tiếng Anh - Reading Comprehension",
      subject: "english",
      grade: "11",
      questions: 30,
      duration: 60,
      attempts: 89,
      avgScore: 72,
      status: "published",
      createdAt: "08/12/2025",
      createdBy: "Manual",
    },
    {
      id: "3",
      title: "Vật lý - Điện từ học",
      subject: "physics",
      grade: "12",
      questions: 20,
      duration: 40,
      attempts: 67,
      avgScore: 81,
      status: "published",
      createdAt: "05/12/2025",
      createdBy: "AI",
    },
    {
      id: "4",
      title: "Hóa học - Hữu cơ cơ bản",
      subject: "chemistry",
      grade: "11",
      questions: 35,
      duration: 50,
      attempts: 0,
      avgScore: 0,
      status: "draft",
      createdAt: "14/12/2025",
      createdBy: "Manual",
    },
    {
      id: "5",
      title: "Sinh học - Di truyền học",
      subject: "biology",
      grade: "12",
      questions: 28,
      duration: 45,
      attempts: 45,
      avgScore: 75,
      status: "published",
      createdAt: "01/12/2025",
      createdBy: "AI",
    },
  ]

  const filteredTests = allTests.filter((test) => {
    const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || test.subject === subjectFilter
    const matchesStatus = statusFilter === "all" || test.status === statusFilter
    return matchesSearch && matchesSubject && matchesStatus
  })

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      math: "Toán",
      english: "Tiếng Anh",
      physics: "Vật lý",
      chemistry: "Hóa học",
      biology: "Sinh học",
    }
    return labels[subject] || subject
  }

  const columns = [
    { key: "title", label: "Tên bài kiểm tra" },
    {
      key: "subject",
      label: "Môn học",
      render: (value: string) => <Badge variant="outline">{getSubjectLabel(value)}</Badge>,
    },
    { key: "grade", label: "Lớp", render: (value: string) => `Lớp ${value}` },
    { key: "questions", label: "Số câu", render: (value: number) => `${value} câu` },
    { key: "duration", label: "Thời gian", render: (value: number) => `${value} phút` },
    { key: "attempts", label: "Lượt làm" },
    {
      key: "avgScore",
      label: "Điểm TB",
      render: (value: number, row: any) => (row.status === "published" && row.attempts > 0 ? `${value}%` : "-"),
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value: string) => (
        <Badge variant={value === "published" ? "default" : "secondary"}>
          {value === "published" ? "Đã xuất bản" : "Nháp"}
        </Badge>
      ),
    },
    {
      key: "createdBy",
      label: "Tạo bởi",
      render: (value: string) => (
        <Badge variant="outline" className={value === "AI" ? "bg-purple-100 text-purple-800" : ""}>
          {value === "AI" ? "AI" : "Thủ công"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "",
      render: (_: any, row: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/test-manager/tests/${row.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Copy className="h-4 w-4 mr-2" />
              Nhân bản
            </DropdownMenuItem>
            {row.status === "published" && (
              <DropdownMenuItem>
                <BarChart3 className="h-4 w-4 mr-2" />
                Xem thống kê
              </DropdownMenuItem>
            )}
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh sách bài kiểm tra</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả bài kiểm tra trong hệ thống</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/test-manager/create">
              <Plus className="h-4 w-4 mr-2" />
              Tạo thủ công
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/test-manager/ai-generate">
              <Sparkles className="h-4 w-4 mr-2" />
              Tạo bằng AI
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm bài kiểm tra..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Môn học" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                <SelectItem value="math">Toán</SelectItem>
                <SelectItem value="english">Tiếng Anh</SelectItem>
                <SelectItem value="physics">Vật lý</SelectItem>
                <SelectItem value="chemistry">Hóa học</SelectItem>
                <SelectItem value="biology">Sinh học</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="published">Đã xuất bản</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={filteredTests} />
        </CardContent>
      </Card>
    </div>
  )
}
