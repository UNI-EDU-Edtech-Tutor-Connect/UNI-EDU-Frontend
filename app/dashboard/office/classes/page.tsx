"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, BookOpen, Users, GraduationCap, Eye, Edit, Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function ClassesPage() {
  const dispatch = useAppDispatch()
  const { classRequests, isLoading } = useAppSelector((state) => state.classes)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  // Derive display classes from Redux state
  const allClasses = classRequests.map(c => ({
    id: c.id,
    name: `${c.subjectName} - Lớp ${c.grade}`,
    subject: c.subjectName,
    grade: c.grade.toString(),
    tutor: c.assignedTutorName ? { name: c.assignedTutorName, avatar: "/placeholder.svg" } : null,
    student: { name: c.studentName || "Chưa cập nhật", avatar: "/placeholder.svg" },
    schedule: c.preferredSchedule.map(s => `T${s.dayOfWeek + 1}`).join(", "),
    location: c.location || "Online",
    fee: c.monthlyBudget ? c.monthlyBudget / 4 : 0, // Approx fee per session
    status: c.status,
    startDate: c.startDate ? format(new Date(c.startDate), "dd/MM/yyyy", { locale: vi }) : "Chưa xác định",
    sessions: 0, // Mock data
  }))

  const filteredClasses = allClasses.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.tutor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || cls.status === statusFilter
    const matchesSubject = subjectFilter === "all" || cls.subject === subjectFilter
    return matchesSearch && matchesStatus && matchesSubject
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in_progress":
        return <Badge className="bg-green-100 text-green-700">Đang học</Badge>
      case "pending_payment":
        return <Badge className="bg-amber-100 text-amber-700">Chờ thanh toán</Badge>
      case "open":
        return <Badge className="bg-purple-100 text-purple-700">Đang tìm gia sư</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-700">Hoàn thành</Badge>
      case "cancelled":
        return <Badge variant="destructive">Đã hủy</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const stats = {
    total: allClasses.length,
    active: allClasses.filter((c) => c.status === "in_progress").length,
    pending: allClasses.filter((c) => c.status === "pending_payment").length,
    matching: allClasses.filter((c) => c.status === "open").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lớp học</h1>
          <p className="text-muted-foreground">Tạo và quản lý các lớp học trong hệ thống</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tạo lớp mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            {/* Note: This form is UI-only for now, connected to nothing */}
            <DialogHeader>
              <DialogTitle>Tạo lớp học mới</DialogTitle>
              <DialogDescription>Nhập thông tin để tạo lớp học</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="className">Tên lớp</Label>
                <Input id="className" placeholder="VD: Toán 12 - Ôn thi THPT" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Môn học</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn môn" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="math">Toán</SelectItem>
                      <SelectItem value="physics">Vật Lý</SelectItem>
                      <SelectItem value="chemistry">Hóa Học</SelectItem>
                      <SelectItem value="english">Tiếng Anh</SelectItem>
                      <SelectItem value="literature">Ngữ Văn</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="grade">Khối lớp</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn khối" />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(12)].map((_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          Lớp {i + 1}
                        </SelectItem>
                      ))}
                      <SelectItem value="ielts">IELTS</SelectItem>
                      <SelectItem value="toeic">TOEIC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Học sinh</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn học sinh" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student1">Trần Văn B</SelectItem>
                      <SelectItem value="student2">Phạm Văn D</SelectItem>
                      <SelectItem value="student3">Vũ Văn I</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tutor">Gia sư</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn gia sư" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tutor1">Nguyễn Văn A</SelectItem>
                      <SelectItem value="tutor2">Lê Thị C</SelectItem>
                      <SelectItem value="tutor3">Hoàng Văn E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Lịch học</Label>
                <Input id="schedule" placeholder="VD: T3, T5, T7 - 19:00-21:00" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" placeholder="Quận, TP hoặc Online" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Học phí / buổi</Label>
                  <Input id="fee" type="number" placeholder="300000" />
                </div>
              </div>
            </div>
            {/* Simplified form for UI demo */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Tạo lớp</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng lớp</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang học</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chờ bắt đầu</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <GraduationCap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang ghép</p>
                <p className="text-2xl font-bold">{stats.matching}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên lớp, gia sư, học sinh..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Toán học">Toán</SelectItem>
                  <SelectItem value="Vật lý">Vật Lý</SelectItem>
                  <SelectItem value="Hóa học">Hóa Học</SelectItem>
                  <SelectItem value="Tiếng Anh">Tiếng Anh</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="in_progress">Đang học</SelectItem>
                  <SelectItem value="pending_payment">Chờ thanh toán</SelectItem>
                  <SelectItem value="open">Đang tìm gia sư</SelectItem>
                  <SelectItem value="completed">Hoàn thành</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lớp học</CardTitle>
          <CardDescription>Hiển thị {filteredClasses.length} lớp học</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lớp học</TableHead>
                <TableHead>Gia sư</TableHead>
                <TableHead>Học sinh</TableHead>
                <TableHead>Lịch học</TableHead>
                <TableHead>Học phí/buổi (tạm tính)</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClasses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy lớp học nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredClasses.map((cls) => (
                  <TableRow key={cls.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{cls.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cls.subject} - Lớp {cls.grade}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cls.tutor ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={cls.tutor.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{cls.tutor.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span>{cls.tutor.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">Chưa có</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={cls.student.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{cls.student.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{cls.student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {cls.schedule}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {cls.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{formatCurrency(cls.fee)}</TableCell>
                    <TableCell>{getStatusBadge(cls.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/dashboard/office/classes/${cls.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
