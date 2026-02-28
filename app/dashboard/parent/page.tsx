"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchParentChildrenRequest } from "@/store/slices/users-slice"
import { fetchUserTransactionsRequest } from "@/store/slices/transactions-slice"
import { fetchNotificationsRequest } from "@/store/slices/notifications-slice"
import { StatsCard } from "@/components/dashboard/stats-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, CreditCard, Star, MessageCircle, ArrowRight, Bell } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function ParentDashboard() {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { parentChildren, isLoading: loadingChildren } = useAppSelector((state) => state.users)
  const { transactions, isLoading: loadingTransactions } = useAppSelector((state) => state.transactions)
  const { notifications: rawNotifications } = useAppSelector((state) => state.notifications)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchParentChildrenRequest(user.id))
      dispatch(fetchUserTransactionsRequest(user.id))
      dispatch(fetchNotificationsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const notifications = rawNotifications.slice(0, 5).map(n => ({
    id: n.id,
    type: n.type,
    message: n.message,
    time: new Date(n.createdAt).toLocaleDateString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
    }),
  }))

  const totalSpent = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const activeChildren = parentChildren.length

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">Chào mừng trở lại, {user?.fullName}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Tổng quan chi tiêu"
          value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalSpent)}
          description="Đã thanh toán"
          icon={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Số con đang học"
          value={activeChildren.toString()}
          description="Học sinh"
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Thông báo mới"
          value={notifications.length.toString()}
          description="Chưa đọc"
          icon={<Bell className="h-4 w-4 text-muted-foreground" />}
        />
        <StatsCard
          title="Đánh giá trung bình"
          value="8.5" // Placeholder or average from children
          description="Điểm hài lòng"
          icon={<Star className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Thông báo gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <div key={notif.id} className="flex gap-4 p-3 bg-muted/40 rounded-lg items-start">
                    <div
                      className={`h-2.5 w-2.5 rounded-full mt-2 flex-shrink-0 ${notif.type === "class_update" || notif.type === "approval_update"
                        ? "bg-green-500"
                        : notif.type === "attendance_warning"
                          ? "bg-orange-500"
                          : "bg-blue-500"
                        }`}
                    />
                    <div>
                      <p className="text-sm font-medium leading-none">{notif.message}</p>
                      <p className="text-xs text-muted-foreground mt-1.5">{notif.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">Không có thông báo mới</div>
              )}
            </div>
            <Button variant="ghost" className="w-full mt-4" onClick={() => toast({ title: "Thông báo", description: "Tính năng này đang được phát triển" })}>
              Xem tất cả <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Hành động nhanh</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" variant="outline" onClick={() => toast({ title: "Thông báo", description: "Tính năng này đang được phát triển" })}>
              <Users className="h-4 w-4 mr-2" />
              Tìm gia sư mới
            </Button>
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link href="/dashboard/parent/payments">
                <CreditCard className="h-4 w-4 mr-2" />
                Thanh toán học phí
              </Link>
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => toast({ title: "Thông báo", description: "Tính năng này đang được phát triển" })}>
              <Star className="h-4 w-4 mr-2" />
              Đánh giá gia sư
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => toast({ title: "Thông báo", description: "Tính năng này đang được phát triển" })}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Hỗ trợ
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
