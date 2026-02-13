"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchTutorStudentsRequest } from "@/store/slices/users-slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Users,
  Search,
  Phone,
  Mail,
  BookOpen,
  TrendingUp,
  Calendar,
  Star,
  MessageCircle,
  Eye,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import type { TutorStudent } from "@/lib/api/types"

export default function TutorStudentsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { tutorStudents, isLoading } = useAppSelector((state) => state.users)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<TutorStudent | null>(null)

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchTutorStudentsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const filteredStudents = tutorStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.subject.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeStudents = tutorStudents.filter((s) => s.status === "active").length
  const totalSessions = tutorStudents.reduce((sum, s) => sum + s.sessionsCompleted, 0)
  const avgAttendance = tutorStudents.length > 0
    ? tutorStudents.reduce((sum, s) => sum + s.attendance, 0) / tutorStudents.length
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Học sinh của tôi</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tiến độ học sinh</p>
        </div>
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
                <p className="text-2xl font-bold">{isLoading ? "..." : activeStudents}</p>
                <p className="text-sm text-muted-foreground">Học sinh đang dạy</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{isLoading ? "..." : totalSessions}</p>
                <p className="text-sm text-muted-foreground">Buổi đã dạy</p>
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
                <p className="text-2xl font-bold">{isLoading ? "..." : `${avgAttendance.toFixed(0)}%`}</p>
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
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-sm text-muted-foreground">Đánh giá TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm học sinh..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Students List */}
      {isLoading ? (
        <div className="text-center py-10">Đang tải dữ liệu...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">Chưa có học sinh nào</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {student.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.grade}</p>
                      </div>
                      <Badge
                        variant={
                          student.status === "active"
                            ? "default"
                            : student.status === "completed"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {student.status === "active"
                          ? "Đang học"
                          : student.status === "completed"
                            ? "Hoàn thành"
                            : "Tạm dừng"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{student.subject}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tiến độ</span>
                      <span className="font-medium">
                        {student.sessionsCompleted}/{student.totalSessions} buổi
                      </span>
                    </div>
                    <Progress value={(student.sessionsCompleted / student.totalSessions) * 100} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Chuyên cần</p>
                      <p className="font-semibold text-green-600">{student.attendance}%</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Điểm TB</p>
                      <p className="font-semibold text-primary">{student.averageScore}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedStudent(student)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Student Detail Dialog */}
      <Dialog open={!!selectedStudent} onOpenChange={() => setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          {selectedStudent && (
            <>
              <DialogHeader>
                <DialogTitle>Thông tin học sinh</DialogTitle>
                <DialogDescription>Chi tiết về học sinh và tiến độ học tập</DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedStudent.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                      {selectedStudent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedStudent.grade} - {selectedStudent.subject}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <a
                        href={`tel:${selectedStudent.phone}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        {selectedStudent.phone}
                      </a>
                      <a
                        href={`mailto:${selectedStudent.email}`}
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        <Mail className="h-3 w-3" />
                        {selectedStudent.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-primary">{selectedStudent.sessionsCompleted}</p>
                    <p className="text-xs text-muted-foreground">Buổi đã học</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-green-600">{selectedStudent.attendance}%</p>
                    <p className="text-xs text-muted-foreground">Chuyên cần</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold text-accent">{selectedStudent.averageScore}</p>
                    <p className="text-xs text-muted-foreground">Điểm TB</p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 text-center">
                    <p className="text-2xl font-bold">
                      {selectedStudent.totalSessions - selectedStudent.sessionsCompleted}
                    </p>
                    <p className="text-xs text-muted-foreground">Buổi còn lại</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Thông tin học sinh
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Ngày bắt đầu</span>
                        <span>{new Date(selectedStudent.startDate).toLocaleDateString("vi-VN")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Môn học</span>
                        <span>{selectedStudent.subject}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Trạng thái</span>
                        <Badge variant="outline">
                          {selectedStudent.status === "active" ? "Đang học" : "Hoàn thành"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Thông tin phụ huynh
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Họ tên</span>
                        <span>{selectedStudent.parentName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Điện thoại</span>
                        <a href={`tel:${selectedStudent.parentPhone}`} className="text-primary hover:underline">
                          {selectedStudent.parentPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedStudent.notes && (
                  <div className="p-4 rounded-lg bg-muted/50">
                    <h4 className="font-medium mb-2">Ghi chú</h4>
                    <p className="text-sm text-muted-foreground">{selectedStudent.notes}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button className="flex-1" asChild>
                    <Link href={`/dashboard/tutor/classes/${selectedStudent.classId}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Xem lớp học
                    </Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Nhắn tin
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
