"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { logout } from "@/store/slices/auth-slice"
import { toggleSidebar } from "@/store/slices/ui-slice"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  FileCheck,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  ClipboardList,
  BarChart3,
  Calendar,
  Wallet,
  FileText,
  AlertTriangle,
  TestTube,
} from "lucide-react"
import type { UserRole } from "@/types"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  badge?: number
}

const navItemsByRole: Record<UserRole, NavItem[]> = {
  admin: [
    { title: "Tổng quan", href: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Phê duyệt", href: "/dashboard/admin/approvals", icon: UserCheck, badge: 12 },
    { title: "Người dùng", href: "/dashboard/admin/users", icon: Users },
    { title: "Lớp học", href: "/dashboard/admin/classes", icon: BookOpen },
    { title: "Bài test", href: "/dashboard/admin/tests", icon: FileCheck },
    { title: "Giao dịch", href: "/dashboard/admin/transactions", icon: CreditCard },
    { title: "Báo cáo", href: "/dashboard/admin/reports", icon: BarChart3 },
    { title: "Cài đặt", href: "/dashboard/admin/settings", icon: Settings },
  ],
  test_user: [
    { title: "Tổng quan", href: "/dashboard/test_user", icon: LayoutDashboard },
    { title: "Tạo đề thi", href: "/dashboard/test_user/create", icon: FileText },
    { title: "Ngân hàng đề", href: "/dashboard/test_user/bank", icon: ClipboardList },
  ],
  test_manager: [
    { title: "Tổng quan", href: "/dashboard/test_manager", icon: LayoutDashboard },
    { title: "Quản lý đề", href: "/dashboard/test_manager/tests", icon: FileCheck },
    { title: "Kết quả thi", href: "/dashboard/test_manager/results", icon: BarChart3 },
    { title: "AI Generate", href: "/dashboard/test_manager/ai", icon: TestTube },
  ],
  tutor: [
    { title: "Tổng quan", href: "/dashboard/tutor", icon: LayoutDashboard },
    { title: "Lớp học", href: "/dashboard/tutor/classes", icon: BookOpen },
    { title: "Lịch dạy", href: "/dashboard/tutor/schedule", icon: Calendar },
    { title: "Học sinh", href: "/dashboard/tutor/students", icon: Users },
    { title: "Thu nhập", href: "/dashboard/tutor/earnings", icon: Wallet },
    { title: "Bài test", href: "/dashboard/tutor/tests", icon: FileCheck },
  ],
  teacher: [
    { title: "Tổng quan", href: "/dashboard/teacher", icon: LayoutDashboard },
    { title: "Lớp học", href: "/dashboard/teacher/classes", icon: BookOpen },
    { title: "Lịch dạy", href: "/dashboard/teacher/schedule", icon: Calendar },
    { title: "Học sinh", href: "/dashboard/teacher/students", icon: Users },
    { title: "Thu nhập", href: "/dashboard/teacher/earnings", icon: Wallet },
    { title: "Bài test", href: "/dashboard/teacher/tests", icon: FileCheck },
  ],
  student: [
    { title: "Tổng quan", href: "/dashboard/student", icon: LayoutDashboard },
    { title: "Lớp học", href: "/dashboard/student/classes", icon: BookOpen },
    { title: "Lịch học", href: "/dashboard/student/schedule", icon: Calendar },
    { title: "Bài test", href: "/dashboard/student/tests", icon: FileCheck },
    { title: "Thi thử", href: "/dashboard/student/practice", icon: TestTube },
    { title: "Kết quả", href: "/dashboard/student/results", icon: BarChart3 },
  ],
  parent: [
    { title: "Tổng quan", href: "/dashboard/parent", icon: LayoutDashboard },
    { title: "Con em", href: "/dashboard/parent/children", icon: Users },
    { title: "Báo cáo", href: "/dashboard/parent/reports", icon: BarChart3 },
    { title: "Thanh toán", href: "/dashboard/parent/payments", icon: CreditCard },
  ],
  accountant: [
    { title: "Tổng quan", href: "/dashboard/accountant", icon: LayoutDashboard },
    { title: "Giao dịch", href: "/dashboard/accountant/transactions", icon: CreditCard },
    { title: "Chi trả", href: "/dashboard/accountant/payouts", icon: Wallet },
    { title: "Báo cáo", href: "/dashboard/accountant/reports", icon: BarChart3 },
    { title: "Audit Log", href: "/dashboard/accountant/audit", icon: FileText },
  ],
  office: [
    { title: "Tổng quan", href: "/dashboard/office", icon: LayoutDashboard },
    { title: "Điểm danh", href: "/dashboard/office/attendance", icon: ClipboardList },
    { title: "Cảnh báo", href: "/dashboard/office/alerts", icon: AlertTriangle, badge: 28 },
    { title: "Lớp học", href: "/dashboard/office/classes", icon: BookOpen },
    { title: "Báo cáo", href: "/dashboard/office/reports", icon: BarChart3 },
  ],
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  if (!user) return null

  const navItems = navItemsByRole[user.role] || []

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300",
        sidebarOpen ? "w-64" : "w-20",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <GraduationCap className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            {sidebarOpen && <span className="text-lg font-bold">EduConnect</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={() => dispatch(toggleSidebar())}
          >
            {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* User Info */}
        <div className={cn("p-4 border-b border-sidebar-border", !sidebarOpen && "px-2")}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium">{user.fullName.charAt(0)}</span>
              )}
            </div>
            {sidebarOpen && (
              <div className="overflow-hidden">
                <p className="font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-sidebar-foreground/70 capitalize">{user.role.replace("_", " ")}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-2 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "hover:bg-sidebar-accent text-sidebar-foreground/80 hover:text-sidebar-foreground",
                    !sidebarOpen && "justify-center px-2",
                  )}
                  title={!sidebarOpen ? item.title : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.title}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs px-1.5">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </nav>
        </ScrollArea>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-sidebar-border">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-3 text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              !sidebarOpen && "justify-center px-2",
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && <span>Đăng xuất</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}
