"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchUsersRequest } from "@/store/slices/users-slice"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, Plus, Phone, Mail, Eye, Calendar, UserPlus, Users, CheckCircle, Clock } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function RegistrationsPage() {
  const dispatch = useAppDispatch()
  const { tutors, teachers, students, parents, isLoading } = useAppSelector((state) => state.users)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  // Using an explicit type for selectedReg can be complex due to mixed user types, so we use 'any' or a minimal interface for now for simplicity in this view
  const [selectedReg, setSelectedReg] = useState<any | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchUsersRequest())
  }, [dispatch])

  // Combine and normalize user data
  const registrations = [
    ...tutors.map(u => ({ ...u, type: 'tutor' as const, subjects: u.subjects?.join(", "), userStatus: u.approvalStatus })),
    ...teachers.map(u => ({ ...u, type: 'teacher' as const, subjects: u.subjects?.join(", "), userStatus: u.approvalStatus })),
    ...students.map(u => ({ ...u, type: 'student' as const, subjects: u.subjects?.join(", "), userStatus: u.status })),
    ...parents.map(u => ({ ...u, type: 'parent' as const, subjects: 'N/A', userStatus: u.status })),
  ].map(u => ({
    id: u.id,
    name: u.fullName,
    email: u.email,
    phone: u.phone,
    type: u.type,
    subject: u.subjects || "Chưa cập nhật",
    date: u.createdAt ? format(new Date(u.createdAt), "dd/MM/yyyy", { locale: vi }) : "N/A",
    status: u.userStatus === 'pending' ? 'new'
      : u.userStatus === 'approved' ? 'approved'
        : u.userStatus === 'active' ? 'approved'
          : u.userStatus === 'rejected' ? 'rejected'
            : u.userStatus === 'suspended' ? 'rejected'
              : u.userStatus === 'inactive' ? 'rejected'
                : 'new', // Default fallback includes 'requires_test'
    notes: "Ghi chú...", // Placeholder as API doesn't have general notes field on User yet
    location: "Vietnam", // Placeholder
    avatar: u.avatar
  })).sort((a, b) => {
    // Basic date sort if possible, string comparison otherwise
    return b.date.localeCompare(a.date)
  })

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesSearch =
      reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.phone.includes(searchTerm) ||
      reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || reg.type === typeFilter
    const matchesStatus = statusFilter === "all" || reg.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "parent":
        return <Badge className="bg-blue-100 text-blue-700">Phụ huynh</Badge>
      case "tutor":
        return <Badge className="bg-green-100 text-green-700">Gia sư</Badge>
      case "teacher":
        return <Badge className="bg-orange-100 text-orange-700">Giáo viên</Badge>
      case "student":
        return <Badge className="bg-purple-100 text-purple-700">Học sinh</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">Mới</Badge>
      case "contacted":
        return <Badge className="bg-amber-100 text-amber-700">Đã liên hệ</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-700">Đã hẹn</Badge>
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Đã duyệt</Badge>
      case "rejected":
        return <Badge variant="destructive">Từ chối</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: registrations.length,
    new: registrations.filter((r) => r.status === "new").length,
    contacted: registrations.filter((r) => r.status === "contacted").length, // Will be 0 initially with simplified mapping
    approved: registrations.filter((r) => r.status === "approved").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý đăng ký</h1>
          <p className="text-muted-foreground">Theo dõi và xử lý đăng ký từ khách hàng</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm đăng ký
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            {/* UI Demo Form */}
            <DialogHeader>
              <DialogTitle>Thêm đăng ký mới</DialogTitle>
              <DialogDescription>Nhập thông tin khách hàng đăng ký</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" placeholder="Nhập họ tên" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Loại khách hàng</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Phụ huynh</SelectItem>
                      <SelectItem value="student">Học sinh</SelectItem>
                      <SelectItem value="tutor">Gia sư</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" placeholder="0901234567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Môn học / Nhu cầu</Label>
                <Input id="subject" placeholder="VD: Toán 12, IELTS..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Địa chỉ</Label>
                <Input id="location" placeholder="Quận, Thành phố" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú</Label>
                <Textarea id="notes" placeholder="Thông tin bổ sung..." />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>Lưu đăng ký</Button>
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
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng đăng ký</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <UserPlus className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                <p className="text-2xl font-bold">{stats.new}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-50">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã liên hệ</p>
                <p className="text-2xl font-bold">{stats.contacted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đã duyệt</p>
                <p className="text-2xl font-bold">{stats.approved}</p>
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
                placeholder="Tìm theo tên, SĐT, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="parent">Phụ huynh</SelectItem>
                  <SelectItem value="student">Học sinh</SelectItem>
                  <SelectItem value="tutor">Gia sư</SelectItem>
                  <SelectItem value="teacher">Giáo viên</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="new">Mới</SelectItem>
                  <SelectItem value="contacted">Đã liên hệ</SelectItem>
                  <SelectItem value="scheduled">Đã hẹn</SelectItem>
                  <SelectItem value="approved">Đã duyệt</SelectItem>
                  <SelectItem value="rejected">Từ chối</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách đăng ký</CardTitle>
          <CardDescription>Hiển thị {filteredRegistrations.length} đăng ký</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Môn / Nhu cầu</TableHead>
                <TableHead>Khu vực</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    Không tìm thấy đăng ký nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reg.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{reg.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{reg.name}</p>
                          <p className="text-sm text-muted-foreground">{reg.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getTypeBadge(reg.type)}</TableCell>
                    <TableCell>{reg.subject}</TableCell>
                    <TableCell className="text-muted-foreground">{reg.location}</TableCell>
                    <TableCell>{reg.date}</TableCell>
                    <TableCell>{getStatusBadge(reg.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setSelectedReg(reg)}>
                          <Eye className="h-4 w-4" />
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

      {/* Detail Dialog */}
      <Dialog open={!!selectedReg} onOpenChange={() => setSelectedReg(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chi tiết đăng ký</DialogTitle>
            <DialogDescription>Mã: {selectedReg?.id}</DialogDescription>
          </DialogHeader>
          {selectedReg && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedReg.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xl">{selectedReg.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{selectedReg.name}</h3>
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedReg.type)}
                    {getStatusBadge(selectedReg.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Điện thoại</p>
                  <p className="font-medium">{selectedReg.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedReg.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Môn / Nhu cầu</p>
                  <p className="font-medium">{selectedReg.subject}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Khu vực</p>
                  <p className="font-medium">{selectedReg.location}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Ghi chú</p>
                <p className="p-3 bg-muted rounded-lg">{selectedReg.notes}</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">
                  <Phone className="mr-2 h-4 w-4" />
                  Gọi điện
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt lịch hẹn
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
