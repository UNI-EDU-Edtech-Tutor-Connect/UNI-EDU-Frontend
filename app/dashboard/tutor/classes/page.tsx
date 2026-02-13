"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchSubjectsRequest } from "@/store/slices/subjects-slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { BookOpen, MapPin, Calendar, Search, Filter, Eye, FileText } from "lucide-react"
import type { ClassRequest } from "@/types"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

export default function TutorClassesPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { classRequests, isLoading } = useAppSelector((state) => state.classes)
  const { subjects } = useAppSelector((state) => state.subjects)
  const [searchQuery, setSearchQuery] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchSubjectsRequest())
  }, [dispatch])

  const myClasses = (classRequests || []).filter(
    (c) => c.assignedTutorId === user?.id && (c.status === "in_progress" || c.status === "pending_payment"),
  )
  const availableClasses = (classRequests || []).filter((c) => c.status === "open")

  const filteredAvailable = availableClasses.filter((c) => {
    const matchesSearch =
      c.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.studentName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = subjectFilter === "all" || c.subjectId === subjectFilter
    return matchesSearch && matchesSubject
  })

  const ClassCard = ({ classItem, isMyClass = false }: { classItem: ClassRequest; isMyClass?: boolean }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{classItem.subjectName}</h3>
              <p className="text-sm text-muted-foreground">Lớp {classItem.grade}</p>
            </div>
          </div>
          <StatusBadge status={classItem.status} />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-20">Học sinh:</span>
            <span className="font-medium">{classItem.studentName}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-20">Hình thức:</span>
            <Badge variant="outline" className="capitalize">
              {classItem.learningFormat}
            </Badge>
          </div>

          {classItem.location && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
              <span>{classItem.location}</span>
            </div>
          )}

          <div className="flex items-start gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {classItem.preferredSchedule.map((s, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {dayNames[s.dayOfWeek]} {s.startTime}-{s.endTime}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground w-20">Học phí:</span>
            <span className="font-semibold text-accent">{formatCurrency(classItem.monthlyBudget)}/tháng</span>
          </div>
        </div>

        {classItem.requirements && (
          <div className="p-3 rounded-lg bg-muted/50 text-sm mb-4">
            <p className="text-muted-foreground">{classItem.requirements}</p>
          </div>
        )}

        {isMyClass ? (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href={`/dashboard/tutor/classes/${classItem.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Chi tiết
              </Link>
            </Button>
            <Button className="flex-1">Vào lớp học</Button>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <Link href={`/dashboard/tutor/classes/${classItem.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                Xem chi tiết
              </Link>
            </Button>
            <Button className="flex-1 bg-accent hover:bg-accent/90" asChild>
              <Link href={`/dashboard/tutor/classes/${classItem.id}/test`}>
                <FileText className="h-4 w-4 mr-2" />
                Làm test nhận lớp
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lớp học</h1>
        <p className="text-muted-foreground">Quản lý lớp học và tìm lớp mới</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="my-classes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-classes">
            Lớp của tôi
            <Badge variant="secondary" className="ml-2">
              {myClasses.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="available">
            Đang tìm gia sư
            <Badge variant="secondary" className="ml-2 bg-accent text-accent-foreground">
              {availableClasses.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        {/* My Classes */}
        <TabsContent value="my-classes" className="space-y-4">
          {myClasses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Bạn chưa có lớp nào</p>
                <p className="text-muted-foreground">Hãy tìm và đăng ký lớp mới</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myClasses.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} isMyClass={true} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Available Classes */}
        <TabsContent value="available" className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm theo môn học, học sinh..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={subjectFilter} onValueChange={setSubjectFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Lọc theo môn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả môn</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Classes Grid */}
          {filteredAvailable.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">Không tìm thấy lớp phù hợp</p>
                <p className="text-muted-foreground">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAvailable.map((classItem) => (
                <ClassCard key={classItem.id} classItem={classItem} isMyClass={false} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
