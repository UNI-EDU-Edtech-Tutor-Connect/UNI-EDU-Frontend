"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Clock, TrendingUp } from "lucide-react"
import type { ClassRequest } from "@/types"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const formatLearningFormat = (format: string) => {
  const formats: Record<string, string> = {
    online: "Online",
    offline: "Offline",
    hybrid: "Hybrid",
  }
  return formats[format] || format
}

export default function ClassesPage() {
  const dispatch = useAppDispatch()
  const { classRequests, sessions } = useAppSelector((state) => state.classes)

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const activeClasses = classRequests.filter((c) => c.status === "in_progress").length
  const openClasses = classRequests.filter((c) => c.status === "open").length

  const columns = [
    {
      key: "subjectName",
      header: "Lớp học",
      render: (item: ClassRequest) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{item.subjectName}</p>
            <p className="text-xs text-muted-foreground">Lớp {item.grade}</p>
          </div>
        </div>
      ),
    },
    {
      key: "studentName",
      header: "Học sinh",
      render: (item: ClassRequest) => (
        <div>
          <p className="font-medium">{item.studentName}</p>
          {item.assignedTutorName && <p className="text-xs text-muted-foreground">GS: {item.assignedTutorName}</p>}
        </div>
      ),
    },
    {
      key: "learningFormat",
      header: "Hình thức",
      render: (item: ClassRequest) => <Badge variant="outline">{formatLearningFormat(item.learningFormat)}</Badge>,
    },
    {
      key: "monthlyBudget",
      header: "Học phí",
      render: (item: ClassRequest) => <span className="font-medium">{formatCurrency(item.monthlyBudget)}/tháng</span>,
    },
    {
      key: "status",
      header: "Trạng thái",
      render: (item: ClassRequest) => <StatusBadge status={item.status} />,
    },
    {
      key: "createdAt",
      header: "Ngày tạo",
      render: (item: ClassRequest) => <span>{new Date(item.createdAt).toLocaleDateString("vi-VN")}</span>,
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <Button variant="outline" size="sm">
          Chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Quản lý lớp học</h1>
          <p className="text-muted-foreground">Theo dõi và quản lý tất cả lớp học trong hệ thống</p>
        </div>
        <Button>Tạo lớp mới</Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard title="Tổng lớp học" value={classRequests.length} icon={<BookOpen className="h-6 w-6" />} />
        <StatsCard title="Đang hoạt động" value={activeClasses} icon={<Users className="h-6 w-6" />} />
        <StatsCard title="Đang tìm gia sư" value={openClasses} icon={<Clock className="h-6 w-6" />} />
        <StatsCard title="Buổi học tháng này" value={sessions.length} icon={<TrendingUp className="h-6 w-6" />} />
      </div>

      {/* Classes Table */}
      <DataTable title="Danh sách lớp học" columns={columns} data={classRequests} emptyMessage="Chưa có lớp học nào" />
    </div>
  )
}
