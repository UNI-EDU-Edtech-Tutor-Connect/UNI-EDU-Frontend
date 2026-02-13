"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchUsersRequest } from "@/store/slices/users-slice"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchTransactionsRequest } from "@/store/slices/transactions-slice"
import { fetchAdminStatsRequest } from "@/store/slices/stats-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { DataTable } from "@/components/dashboard/data-table"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, GraduationCap, BookOpen, CreditCard, TrendingUp, UserCheck, Clock } from "lucide-react"
import type { TutorProfile, TeacherProfile } from "@/types"
import Link from "next/link"

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { pendingApprovals } = useAppSelector((state) => state.users)
  const { classRequests } = useAppSelector((state) => state.classes)
  const { transactions } = useAppSelector((state) => state.transactions)
  const { adminStats, isLoading: statsLoading } = useAppSelector((state) => state.stats)

  useEffect(() => {
    dispatch(fetchUsersRequest())
    dispatch(fetchClassesRequest())
    dispatch(fetchTransactionsRequest())
    dispatch(fetchAdminStatsRequest())
  }, [dispatch])

  // Default stats while loading
  const stats = adminStats || {
    totalUsers: 0,
    totalTutors: 0,
    totalTeachers: 0,
    totalStudents: 0,
    pendingApprovals: 0,
    activeClasses: 0,
    monthlyRevenue: 0,
    monthlyTests: 0,
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
  }

  const pendingApprovalsColumns = [
    {
      key: "fullName",
      header: "Họ tên",
      render: (item: TutorProfile | TeacherProfile) => (
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
    {
      key: "role",
      header: "Vai trò",
      render: (item: TutorProfile | TeacherProfile) => (
        <span className="capitalize">{item.role === "tutor" ? "Gia sư" : "Giáo viên"}</span>
      ),
    },
    {
      key: "subjects",
      header: "Môn dạy",
      render: (item: TutorProfile | TeacherProfile) => <span>{item.subjects.join(", ")}</span>,
    },
    {
      key: "approvalStatus",
      header: "Trạng thái",
      render: (item: TutorProfile | TeacherProfile) => <StatusBadge status={item.approvalStatus} />,
    },
    {
      key: "actions",
      header: "",
      render: () => (
        <Button variant="outline" size="sm">
          Xem chi tiết
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground">Xem và quản lý toàn bộ hoạt động của EduConnect</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng người dùng"
          value={statsLoading ? "..." : stats.totalUsers.toLocaleString()}
          icon={<Users className="h-6 w-6" />}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Gia sư & Giáo viên"
          value={statsLoading ? "..." : (stats.totalTutors + stats.totalTeachers).toLocaleString()}
          description={`${stats.totalTutors} gia sư, ${stats.totalTeachers} giáo viên`}
          icon={<GraduationCap className="h-6 w-6" />}
        />
        <StatsCard
          title="Lớp học đang hoạt động"
          value={statsLoading ? "..." : stats.activeClasses.toLocaleString()}
          icon={<BookOpen className="h-6 w-6" />}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Doanh thu tháng"
          value={statsLoading ? "..." : formatCurrency(stats.monthlyRevenue)}
          icon={<CreditCard className="h-6 w-6" />}
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-warning/50 bg-warning/5">
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/20 text-warning">
              <UserCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.pendingApprovals}</p>
              <p className="text-sm text-muted-foreground">Chờ phê duyệt</p>
            </div>
            <Link href="/dashboard/admin/approvals" className="ml-auto">
              <Button variant="outline" size="sm">
                Xem ngay
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stats.monthlyTests.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Bài test tháng này</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">48h</p>
              <p className="text-sm text-muted-foreground">Thời gian phê duyệt TB</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Table */}
      <DataTable
        title="Đang chờ phê duyệt"
        columns={pendingApprovalsColumns}
        data={pendingApprovals}
        actions={
          <Link href="/dashboard/admin/approvals">
            <Button variant="outline" size="sm">
              Xem tất cả
            </Button>
          </Link>
        }
        emptyMessage="Không có yêu cầu chờ phê duyệt"
      />

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Lớp học mới</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classRequests.slice(0, 5).map((classItem) => (
              <div key={classItem.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{classItem.subjectName}</p>
                    <p className="text-xs text-muted-foreground">
                      {classItem.studentName} - Lớp {classItem.grade}
                    </p>
                  </div>
                </div>
                <StatusBadge status={classItem.status} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Giao dịch gần đây</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transactions.slice(0, 5).map((txn) => (
              <div key={txn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">{txn.userName}</p>
                    <p className="text-xs text-muted-foreground">{txn.description}</p>
                  </div>
                </div>
                <span className="font-semibold text-success">{formatCurrency(txn.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
