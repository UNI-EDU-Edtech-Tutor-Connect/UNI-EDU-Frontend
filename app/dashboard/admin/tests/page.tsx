"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileCheck, Search, Filter, Plus, Edit, Trash2, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const mockTests = [
    {
        id: "T001",
        title: "Bài kiểm tra Toán Đại số 11",
        subject: "Toán học",
        level: "Lớp 11",
        type: "Tự luận & Trắc nghiệm",
        submissions: 156,
        status: "active",
        createdAt: "2024-03-01",
    },
    {
        id: "T002",
        title: "Đề thi thử IELTS Reading 1",
        subject: "Tiếng Anh",
        level: "IELTS 6.0+",
        type: "Trắc nghiệm",
        submissions: 342,
        status: "active",
        createdAt: "2024-02-15",
    },
    {
        id: "T003",
        title: "Đề cương Ôn tập Vật lý 12",
        subject: "Vật lý",
        level: "Lớp 12",
        type: "Trắc nghiệm",
        submissions: 89,
        status: "draft",
        createdAt: "2024-03-10",
    },
    {
        id: "T004",
        title: "Kiểm tra Năng lực Hóa Hữu cơ",
        subject: "Hóa học",
        level: "Lớp 11",
        type: "Tự luận",
        submissions: 0,
        status: "archived",
        createdAt: "2023-11-20",
    },
    {
        id: "T005",
        title: "Tiếng Anh Giao tiếp Cơ bản",
        subject: "Tiếng Anh",
        level: "Cơ bản",
        type: "Trắc nghiệm & Nghe",
        submissions: 210,
        status: "active",
        createdAt: "2024-01-05",
    }
]

export default function AdminTestsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const { toast } = useToast()

    const filteredTests = mockTests.filter(test => {
        const matchesSearch = test.title.toLowerCase().includes(searchTerm.toLowerCase()) || test.subject.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || test.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200">Đang hoạt động</Badge>
            case "draft":
                return <Badge variant="outline" className="text-yellow-600 border-yellow-300 bg-yellow-50">Bản nháp</Badge>
            case "archived":
                return <Badge variant="secondary" className="text-muted-foreground">Đã lưu trữ</Badge>
            default:
                return <Badge variant="outline">Không rõ</Badge>
        }
    }

    const handleDelete = (id: string) => {
        toast({
            title: "Confirm Delete",
            description: `Yêu cầu xóa bài test ${id} đã được gửi.`,
            variant: "destructive",
        })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Quản lý Bài test</h1>
                    <p className="text-muted-foreground mt-1">Quản lý kho đề thi, bài kiểm tra năng lực dùng cho toàn hệ thống.</p>
                </div>
                <Button onClick={() => toast({ title: "Đang mở trình tạo đề...", description: "Khởi tạo công cụ Builder." })}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo bài test mới
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex flex-1 gap-2">
                            <div className="relative flex-1 max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Tìm theo tên bài hoặc môn học..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="active">Đang hoạt động</SelectItem>
                                    <SelectItem value="draft">Bản nháp</SelectItem>
                                    <SelectItem value="archived">Đã lưu trữ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Mã DB</TableHead>
                                    <TableHead>Tên bài test</TableHead>
                                    <TableHead>Môn / Cấp độ</TableHead>
                                    <TableHead>Loại hình</TableHead>
                                    <TableHead className="text-center">Lượt thi</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredTests.length > 0 ? (
                                    filteredTests.map((test) => (
                                        <TableRow key={test.id}>
                                            <TableCell className="font-medium text-muted-foreground">{test.id}</TableCell>
                                            <TableCell>
                                                <span className="font-medium text-primary hover:underline cursor-pointer">{test.title}</span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span>{test.subject}</span>
                                                    <span className="text-xs text-muted-foreground">{test.level}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{test.type}</TableCell>
                                            <TableCell className="text-center font-mono">
                                                {test.submissions.toLocaleString()}
                                            </TableCell>
                                            <TableCell>{getStatusBadge(test.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" title="Xem chi tiết">
                                                        <Eye className="h-4 w-4 text-blue-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Chỉnh sửa">
                                                        <Edit className="h-4 w-4 text-amber-500" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" title="Xóa" onClick={() => handleDelete(test.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                            Không tìm thấy bài test nào phù hợp với bộ lọc.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <div className="text-xs text-muted-foreground mt-4 flex justify-between items-center">
                        <span>Hiển thị {filteredTests.length} bài test</span>
                        <div className="flex gap-1 items-center">
                            <Button variant="outline" size="sm" disabled>Trước</Button>
                            <Button variant="outline" size="sm" className="bg-primary text-primary-foreground">1</Button>
                            <Button variant="outline" size="sm" disabled>Sau</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
