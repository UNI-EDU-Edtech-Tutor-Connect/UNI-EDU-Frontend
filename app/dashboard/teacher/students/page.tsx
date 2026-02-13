"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, Search, BookOpen, TrendingUp, Calendar, Star, MessageCircle, Eye } from "lucide-react"
import Link from "next/link"

const mockStudents = [
  {
    id: "s1",
    name: "Nguyễn Văn Minh",
    grade: "Lớp 12",
    subject: "Toán Cao Cấp",
    sessionsCompleted: 24,
    totalSessions: 36,
    attendance: 95,
    averageScore: 8.5,
    status: "active",
  },
  {
    id: "s2",
    name: "Trần Thị Lan",
    grade: "Lớp 11",
    subject: "Vật lý",
    sessionsCompleted: 12,
    totalSessions: 24,
    attendance: 100,
    averageScore: 9.0,
    status: "active",
  },
  {
    id: "s3",
    name: "Lê Hoàng Nam",
    grade: "Lớp 10",
    subject: "Hóa học",
    sessionsCompleted: 32,
    totalSessions: 32,
    attendance: 88,
    averageScore: 7.2,
    status: "completed",
  },
]

export default function TeacherStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredStudents = mockStudents.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Học sinh của tôi</h1>
        <p className="text-muted-foreground">Quản lý và theo dõi tiến độ học sinh</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockStudents.filter((s) => s.status === "active").length}</p>
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
                <p className="text-2xl font-bold">{mockStudents.reduce((sum, s) => sum + s.sessionsCompleted, 0)}</p>
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
                <p className="text-2xl font-bold">94%</p>
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
                <p className="text-2xl font-bold">4.9</p>
                <p className="text-sm text-muted-foreground">Đánh giá TB</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm học sinh..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-14 w-14">
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
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status === "active" ? "Đang học" : "Hoàn thành"}
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
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/dashboard/teacher/classes/${student.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    Chi tiết
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="bg-transparent">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
