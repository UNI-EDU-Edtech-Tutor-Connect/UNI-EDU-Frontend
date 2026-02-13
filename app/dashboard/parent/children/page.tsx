"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchParentChildrenRequest } from "@/store/slices/users-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Star,
  CheckCircle,
  XCircle,
  Eye,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react"
import Link from "next/link"

export default function ParentChildrenPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { parentChildren, isLoading } = useAppSelector((state) => state.users)
  const [selectedChildId, setSelectedChildId] = useState<string>("")

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchParentChildrenRequest(user.id))
    }
  }, [dispatch, user?.id])

  useEffect(() => {
    if (parentChildren.length > 0 && !selectedChildId) {
      setSelectedChildId(parentChildren[0].id)
    }
  }, [parentChildren, selectedChildId])

  const totalClasses = parentChildren.reduce((sum, c) => sum + (c.classes?.length || 0), 0)

  const allClasess = parentChildren.flatMap((c) => c.classes || [])
  const avgAttendance = allClasess.length > 0
    ? allClasess.reduce((sum, cl) => sum + cl.attendance, 0) / allClasess.length
    : 0

  if (isLoading && parentChildren.length === 0) {
    return <div className="p-8 text-center">Đang tải dữ liệu...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Con em</h1>
          <p className="text-muted-foreground">Theo dõi tiến độ học tập của các con</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm con em
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm con em</DialogTitle>
              <DialogDescription>Liên kết tài khoản con em để theo dõi tiến độ học tập</DialogDescription>
            </DialogHeader>
            <div className="py-4 text-center text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tính năng đang phát triển</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{parentChildren.length}</p>
                <p className="text-sm text-muted-foreground">Số con em</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClasses}</p>
                <p className="text-sm text-muted-foreground">Tổng lớp học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{avgAttendance.toFixed(0)}%</p>
                <p className="text-sm text-muted-foreground">Chuyên cần TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">8.1</p>
                <p className="text-sm text-muted-foreground">Điểm TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Children Tabs */}
      {parentChildren.length > 0 && (
        <Tabs value={selectedChildId} onValueChange={setSelectedChildId}>
          <TabsList className="mb-4">
            {parentChildren.map((child) => (
              <TabsTrigger key={child.id} value={child.id} className="gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={child.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-xs">{child.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {child.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {parentChildren.map((child) => (
            <TabsContent key={child.id} value={child.id} className="space-y-6">
              {/* Child Info */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={child.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {child.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-2xl font-bold">{child.name}</h2>
                      <p className="text-muted-foreground">{child.grade}</p>
                      <p className="text-sm text-muted-foreground">{child.school}</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Nhắn tin
                      </Button>
                      <Button asChild>
                        <Link href={`/dashboard/parent/children/${child.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-3">
                {/* Classes */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-lg font-semibold">Lớp học đang tham gia</h3>
                  <div className="space-y-4">
                    {child.classes?.map((cls) => (
                      <Card key={cls.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="font-semibold">{cls.subject}</h4>
                              <p className="text-sm text-muted-foreground">
                                {cls.tutor} - {cls.schedule}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-1" />
                              Liên hệ
                            </Button>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                              <p className="text-lg font-bold text-primary">
                                {cls.sessionsCompleted}/{cls.totalSessions}
                              </p>
                              <p className="text-xs text-muted-foreground">Buổi học</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                              <p className="text-lg font-bold text-green-600">{cls.attendance}%</p>
                              <p className="text-xs text-muted-foreground">Chuyên cần</p>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-muted/50">
                              <p className="text-lg font-bold text-accent">{cls.avgScore}</p>
                              <p className="text-xs text-muted-foreground">Điểm TB</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Tiến độ</span>
                              <span>{((cls.sessionsCompleted / cls.totalSessions) * 100).toFixed(0)}%</span>
                            </div>
                            <Progress value={(cls.sessionsCompleted / cls.totalSessions) * 100} className="h-2" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Recent Results */}
                  <h3 className="text-lg font-semibold mt-6">Kết quả gần đây</h3>
                  <div className="space-y-3">
                    {child.recentResults?.map((result) => {
                      const percentage = (result.score / result.total) * 100
                      return (
                        <Card key={result.id}>
                          <CardContent className="py-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`h-10 w-10 rounded-lg flex items-center justify-center ${percentage >= 70 ? "bg-green-100" : "bg-red-100"
                                    }`}
                                >
                                  {percentage >= 70 ? (
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                  ) : (
                                    <XCircle className="h-5 w-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{result.test}</p>
                                  <p className="text-sm text-muted-foreground">{result.date}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p
                                  className={`text-xl font-bold ${percentage >= 70 ? "text-green-600" : "text-red-600"}`}
                                >
                                  {result.score}/{result.total}
                                </p>
                                <p className="text-sm text-muted-foreground">{percentage.toFixed(0)}%</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>

                {/* Upcoming Classes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Buổi học sắp tới</h3>
                  <Card>
                    <CardContent className="pt-6 space-y-4">
                      {child.upcomingClasses?.map((cls, idx) => (
                        <div key={idx} className="p-3 rounded-lg border">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={cls.date === "Hôm nay" ? "default" : "secondary"}>{cls.date}</Badge>
                            <span className="text-sm font-medium">{cls.time}</span>
                          </div>
                          <p className="font-medium">{cls.subject}</p>
                          <p className="text-sm text-muted-foreground">{cls.tutor}</p>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Hành động nhanh</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/dashboard/parent/find-tutor">
                          <Users className="h-4 w-4 mr-2" />
                          Tìm gia sư mới
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
                        <Link href="/dashboard/parent/payments">
                          <Calendar className="h-4 w-4 mr-2" />
                          Thanh toán học phí
                        </Link>
                      </Button>
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Star className="h-4 w-4 mr-2" />
                        Đánh giá gia sư
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}
