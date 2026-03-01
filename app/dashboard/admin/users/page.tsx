"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchUsersRequest } from "@/store/slices/users-slice"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Search, Mail, Phone, MoreHorizontal, User as UserIcon, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { TutorProfile, StudentProfile, ParentProfile, TeacherProfile } from "@/types"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { tutors, teachers, students, parents, isLoading } = useAppSelector((state) => state.users)
  const [searchQuery, setSearchQuery] = useState("")
  const [detailModal, setDetailModal] = useState<{ open: boolean, user: TutorProfile | TeacherProfile | StudentProfile | ParentProfile | null }>({ open: false, user: null })
  const [editModal, setEditModal] = useState<{ open: boolean, user: TutorProfile | TeacherProfile | StudentProfile | ParentProfile | null }>({ open: false, user: null })
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, user: TutorProfile | TeacherProfile | StudentProfile | ParentProfile | null }>({ open: false, user: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const [resultModal, setResultModal] = useState<{ open: boolean, success: boolean, userName: string }>({ open: false, success: false, userName: "" })
  const { toast } = useToast()

  const handleDeleteConfirm = async () => {
    if (!deleteModal.user) return
    const userName = deleteModal.user.fullName
    setIsDeleting(true)
    try {
      // Giả lập API call xóa người dùng (thay bằng API thật khi có backend)
      await new Promise<void>((resolve, reject) =>
        setTimeout(() => {
          // Giả lập 90% thành công, 10% thất bại để test
          Math.random() > 0.1 ? resolve() : reject(new Error("Server error"))
        }, 1200)
      )
      setDeleteModal({ open: false, user: null })
      setResultModal({ open: true, success: true, userName })
    } catch {
      setDeleteModal({ open: false, user: null })
      setResultModal({ open: true, success: false, userName })
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    dispatch(fetchUsersRequest())
  }, [dispatch])

  const filteredTutors = tutors.filter(t =>
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredTeachers = teachers.filter(t =>
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredStudents = students.filter(t =>
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredParents = parents.filter(t =>
    t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tutorColumns = [
    {
      key: "fullName",
      header: "Gia sư",
      render: (item: TutorProfile) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-medium text-primary">{item.fullName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{item.fullName}</p>
            <p className="text-xs text-muted-foreground">{item.university}</p>
          </div>
        </div>
      ),
    },
    {
      key: "contact",
      header: "Liên hệ",
      render: (item: TutorProfile) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Mail className="h-3 w-3" />
            {item.email}
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="h-3 w-3" />
            {item.phone}
          </div>
        </div>
      ),
    },
    {
      key: "subjects",
      header: "Môn dạy",
      render: (item: TutorProfile) => (
        <div className="flex flex-wrap gap-1">
          {item.subjects.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "rating",
      header: "Đánh giá",
      render: (item: TutorProfile) => (
        <span className="font-medium">{item.rating > 0 ? `${item.rating}/5` : "Chưa có"}</span>
      ),
    },
    {
      key: "approvalStatus",
      header: "Trạng thái",
      render: (item: TutorProfile) => <StatusBadge status={item.approvalStatus} />,
    },
    {
      key: "actions",
      header: "",
      render: (item: TutorProfile) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDetailModal({ open: true, user: item })}>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditModal({ open: true, user: item })}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteModal({ open: true, user: item })}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const studentColumns = [
    {
      key: "fullName",
      header: "Học sinh",
      render: (item: StudentProfile) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
            <span className="text-xs font-medium text-accent">{item.fullName.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{item.fullName}</p>
            <p className="text-xs text-muted-foreground">{item.school}</p>
          </div>
        </div>
      ),
    },
    { key: "grade", header: "Lớp", render: (item: StudentProfile) => <span>Lớp {item.grade}</span> },
    {
      key: "subjects",
      header: "Môn học",
      render: (item: StudentProfile) => (
        <div className="flex flex-wrap gap-1">
          {item.subjects.map((s) => (
            <Badge key={s} variant="secondary" className="text-xs">
              {s}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "attendanceRate",
      header: "Điểm danh",
      render: (item: StudentProfile) => (
        <span className={item.attendanceRate < 80 ? "text-destructive font-medium" : ""}>{item.attendanceRate}%</span>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: StudentProfile) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "",
      render: (item: StudentProfile) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setDetailModal({ open: true, user: item })}>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setEditModal({ open: true, user: item })}>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setDeleteModal({ open: true, user: item })}>Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý người dùng</h1>
          <p className="text-muted-foreground">Xem và quản lý tất cả người dùng trong hệ thống</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="tutors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tutors">
            Gia sư
            <Badge variant="secondary" className="ml-2">
              {tutors.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="teachers">
            Giáo viên
            <Badge variant="secondary" className="ml-2">
              {teachers.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="students">
            Học sinh
            <Badge variant="secondary" className="ml-2">
              {students.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="parents">
            Phụ huynh
            <Badge variant="secondary" className="ml-2">
              {parents.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutors">
          <DataTable columns={tutorColumns} data={filteredTutors} emptyMessage="Chưa có gia sư nào" />
        </TabsContent>

        <TabsContent value="teachers">
          <DataTable
            columns={tutorColumns}
            data={filteredTeachers as unknown as TutorProfile[]}
            emptyMessage="Chưa có giáo viên nào"
          />
        </TabsContent>

        <TabsContent value="students">
          <DataTable columns={studentColumns} data={filteredStudents} emptyMessage="Chưa có học sinh nào" />
        </TabsContent>

        <TabsContent value="parents">
          <DataTable
            columns={[
              {
                key: "fullName",
                header: "Phụ huynh",
                render: (item: ParentProfile) => (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-medium text-primary">{item.fullName.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="font-medium">{item.fullName}</p>
                      <p className="text-xs text-muted-foreground">{item.email}</p>
                    </div>
                  </div>
                ),
              },
              { key: "phone", header: "Số điện thoại" },
              {
                key: "childrenIds",
                header: "Số con",
                render: (item: ParentProfile) => <span>{item.childrenIds.length} học sinh</span>,
              },
              {
                key: "totalMonthlyExpenses",
                header: "Chi phí/tháng",
                render: (item: ParentProfile) => (
                  <span className="font-medium">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      item.totalMonthlyExpenses,
                    )}
                  </span>
                ),
              },
              {
                key: "actions",
                header: "",
                render: (item: ParentProfile) => (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Mở menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setDetailModal({ open: true, user: item })}>Xem chi tiết</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditModal({ open: true, user: item })}>Chỉnh sửa</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => setDeleteModal({ open: true, user: item })}>Xóa</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ),
              },
            ]}
            data={filteredParents}
            emptyMessage="Chưa có phụ huynh nào"
          />
        </TabsContent>
      </Tabs>

      {/* User Detail Dialog */}
      <Dialog open={detailModal.open} onOpenChange={(open) => setDetailModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chi tiết người dùng</DialogTitle>
          </DialogHeader>
          {detailModal.user && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{detailModal.user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{detailModal.user.email}</p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4 text-sm mt-4 p-4 border rounded-md bg-muted/50">
                <div>
                  <p className="text-muted-foreground">Vai trò</p>
                  <p className="font-medium capitalize">
                    {detailModal.user.role === 'tutor' ? 'Gia sư' :
                      detailModal.user.role === 'teacher' ? 'Giáo viên' :
                        detailModal.user.role === 'student' ? 'Học sinh' : 'Phụ huynh'}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Số điện thoại</p>
                  <p className="font-medium">{detailModal.user.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Trạng thái tài khoản</p>
                  <p className="font-medium"><StatusBadge status={detailModal.user.status} /></p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ngày đăng ký</p>
                  <p className="font-medium">{new Date(detailModal.user.createdAt).toLocaleDateString("vi-VN")}</p>
                </div>
              </div>

              {/* Role-specific Info */}
              {detailModal.user.role === 'tutor' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h4 className="font-semibold text-sm">Thông tin gia sư</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Đại học/Trường</p>
                      <p className="font-medium">{(detailModal.user as TutorProfile).university || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">MSSV</p>
                      <p className="font-medium">{(detailModal.user as TutorProfile).studentId || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Đánh giá chung</p>
                      <p className="font-medium">{(detailModal.user as TutorProfile).rating > 0 ? `${(detailModal.user as TutorProfile).rating}/5` : "Chưa có"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số lớp hoàn thành</p>
                      <p className="font-medium">{(detailModal.user as TutorProfile).totalClasses}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Môn dạy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(detailModal.user as TutorProfile).subjects.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái duyệt</p>
                      <p className="font-medium mt-1"><StatusBadge status={(detailModal.user as TutorProfile).approvalStatus} /></p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Background check</p>
                      <p className="font-medium mt-1"><StatusBadge status={(detailModal.user as TutorProfile).backgroundCheckStatus} /></p>
                    </div>
                  </div>
                </div>
              )}

              {detailModal.user.role === 'teacher' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h4 className="font-semibold text-sm">Thông tin giáo viên</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Cơ quan/Trường</p>
                      <p className="font-medium">{(detailModal.user as TeacherProfile).institution}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kinh nghiệm</p>
                      <p className="font-medium">{(detailModal.user as TeacherProfile).yearsOfExperience} năm</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Đánh giá chung</p>
                      <p className="font-medium">{(detailModal.user as TeacherProfile).rating > 0 ? `${(detailModal.user as TeacherProfile).rating}/5` : "Chưa có"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số lớp hoàn thành</p>
                      <p className="font-medium">{(detailModal.user as TeacherProfile).totalClasses}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Môn dạy</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(detailModal.user as TeacherProfile).subjects.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trạng thái duyệt</p>
                      <p className="font-medium mt-1"><StatusBadge status={(detailModal.user as TeacherProfile).approvalStatus} /></p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Background check</p>
                      <p className="font-medium mt-1"><StatusBadge status={(detailModal.user as TeacherProfile).backgroundCheckStatus} /></p>
                    </div>
                  </div>
                </div>
              )}

              {detailModal.user.role === 'student' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h4 className="font-semibold text-sm">Thông tin học sinh</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Khối lớp</p>
                      <p className="font-medium">Lớp {(detailModal.user as StudentProfile).grade}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Trường học</p>
                      <p className="font-medium">{(detailModal.user as StudentProfile).school || "Chưa cập nhật"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Số lớp đang học</p>
                      <p className="font-medium">{(detailModal.user as StudentProfile).totalClasses}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tỷ lệ chuyên cần</p>
                      <p className="font-medium">{(detailModal.user as StudentProfile).attendanceRate}%</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Môn học</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {(detailModal.user as StudentProfile).subjects?.map(s => <Badge key={s} variant="secondary">{s}</Badge>)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {detailModal.user.role === 'parent' && (
                <div className="space-y-4 p-4 border rounded-md">
                  <h4 className="font-semibold text-sm">Thông tin phụ huynh</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Số con theo học</p>
                      <p className="font-medium">{(detailModal.user as ParentProfile).childrenIds.length}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Chi tiêu ước tính/tháng</p>
                      <p className="font-medium">{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format((detailModal.user as ParentProfile).totalMonthlyExpenses)}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setDetailModal({ open: false, user: null })}>Đóng</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={editModal.open} onOpenChange={(open) => setEditModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          {editModal.user && (
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Họ và tên</Label>
                <Input defaultValue={editModal.user.fullName} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={editModal.user.email} />
              </div>
              <div className="space-y-2">
                <Label>Số điện thoại</Label>
                <Input defaultValue={editModal.user.phone} />
              </div>
              <div className="space-y-2">
                <Label>Trạng thái hoạt động</Label>
                <Select defaultValue={editModal.user.status}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="suspended">Tạm khóa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                <Button variant="outline" onClick={() => setEditModal({ open: false, user: null })}>Hủy</Button>
                <Button onClick={() => {
                  toast({ title: "Thành công", description: "Đã cập nhật thông tin người dùng" })
                  setEditModal({ open: false, user: null })
                }}>Lưu thay đổi</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User AlertDialog */}
      <AlertDialog open={deleteModal.open} onOpenChange={(open) => !isDeleting && setDeleteModal(prev => ({ ...prev, open }))}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                <XCircle className="h-5 w-5 text-destructive" />
              </div>
              <AlertDialogTitle>Xóa người dùng</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-2">
              <span className="block">Bạn có chắc chắn muốn xóa người dùng <span className="font-semibold text-foreground">{deleteModal.user?.fullName}</span>?</span>
              <span className="block text-destructive font-medium">⚠ Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 min-w-[120px]"
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault()
                handleDeleteConfirm()
              }}
            >
              {isDeleting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xóa...
                </span>
              ) : (
                "Xác nhận xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Result Dialog - Thành công / Thất bại */}
      <Dialog open={resultModal.open} onOpenChange={(open) => setResultModal(prev => ({ ...prev, open }))}>
        <DialogContent className="sm:max-w-sm text-center">
          <div className="flex flex-col items-center gap-4 py-4">
            {resultModal.success ? (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-9 w-9 text-green-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Xóa thành công!</h3>
                  <p className="text-sm text-muted-foreground">
                    Người dùng <span className="font-semibold text-foreground">{resultModal.userName}</span> đã được xóa khỏi hệ thống.
                  </p>
                </div>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => setResultModal(prev => ({ ...prev, open: false }))}
                >
                  Đóng
                </Button>
              </>
            ) : (
              <>
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-9 w-9 text-red-600" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">Xóa thất bại!</h3>
                  <p className="text-sm text-muted-foreground">
                    Không thể xóa người dùng <span className="font-semibold text-foreground">{resultModal.userName}</span>. Vui lòng thử lại hoặc liên hệ quản trị viên.
                  </p>
                </div>
                <div className="flex w-full gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setResultModal(prev => ({ ...prev, open: false }))}
                  >
                    Đóng
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      setResultModal(prev => ({ ...prev, open: false }))
                      setDeleteModal({ open: true, user: deleteModal.user })
                    }}
                  >
                    Thử lại
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
