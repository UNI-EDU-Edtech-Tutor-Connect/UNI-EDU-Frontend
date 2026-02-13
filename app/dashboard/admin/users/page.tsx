"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchUsersRequest } from "@/store/slices/users-slice"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MoreHorizontal, Mail, Phone } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { TutorProfile, StudentProfile, ParentProfile } from "@/types"

export default function UsersPage() {
  const dispatch = useAppDispatch()
  const { tutors, teachers, students, parents, isLoading } = useAppSelector((state) => state.users)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    dispatch(fetchUsersRequest())
  }, [dispatch])

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
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Tạm khóa</DropdownMenuItem>
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
      render: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
            <DropdownMenuItem>Liên hệ phụ huynh</DropdownMenuItem>
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
        <Button>Thêm người dùng</Button>
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
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          Lọc
        </Button>
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
          <DataTable columns={tutorColumns} data={tutors} emptyMessage="Chưa có gia sư nào" />
        </TabsContent>

        <TabsContent value="teachers">
          <DataTable
            columns={tutorColumns}
            data={teachers as unknown as TutorProfile[]}
            emptyMessage="Chưa có giáo viên nào"
          />
        </TabsContent>

        <TabsContent value="students">
          <DataTable columns={studentColumns} data={students} emptyMessage="Chưa có học sinh nào" />
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
            ]}
            data={parents}
            emptyMessage="Chưa có phụ huynh nào"
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
