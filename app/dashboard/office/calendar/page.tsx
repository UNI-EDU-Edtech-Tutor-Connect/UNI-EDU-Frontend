"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchOfficeDataRequest } from "@/store/slices/office-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ChevronLeft, ChevronRight, Plus, Calendar, Clock, Phone, Video, MapPin, BookOpen } from "lucide-react"
import { format, parseISO, addMinutes, isSameDay, isValid } from "date-fns"
import { vi } from "date-fns/locale"

const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]
const currentMonth = format(new Date(), "Tháng MM, yyyy", { locale: vi })

export default function CalendarPage() {
  const dispatch = useAppDispatch()
  const { sessions } = useAppSelector((state) => state.classes)
  const { appointments: officeAppointments } = useAppSelector((state) => state.office)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [viewMode, setViewMode] = useState("week")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchOfficeDataRequest())
  }, [dispatch])

  // Map class sessions to appointments
  const sessionAppointments = sessions.map(session => {
    const scheduledDate = session.scheduledAt ? parseISO(session.scheduledAt) : null;
    const isValidDate = scheduledDate && isValid(scheduledDate);
    const endTime = isValidDate ? addMinutes(scheduledDate, session.duration || 60) : null;
    return {
      id: session.id,
      title: `Lớp học: ${session.classId}`,
      client: { name: "Học viên", phone: "" },
      type: "class_session",
      time: isValidDate ? `${format(scheduledDate, "HH:mm")} - ${format(endTime!, "HH:mm")}` : "Không rõ",
      date: session.scheduledAt || new Date().toISOString(),
      location: "Online",
      notes: session.notes || "Buổi học định kỳ",
      status: session.status === 'scheduled' ? 'confirmed' : session.status
    }
  })

  const allAppointments = [...sessionAppointments, ...officeAppointments]

  // Filter for selected date
  const todayAppointments = allAppointments.filter((apt) => {
    const parsed = apt.date ? parseISO(apt.date) : null;
    return parsed && isValid(parsed) && isSameDay(parsed, selectedDate);
  })

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "consultation":
        return <Badge className="bg-blue-100 text-blue-700">Tư vấn</Badge>
      case "interview":
        return <Badge className="bg-green-100 text-green-700">Phỏng vấn</Badge>
      case "complaint":
        return <Badge className="bg-red-100 text-red-700">Khiếu nại</Badge>
      case "meeting":
        return <Badge className="bg-purple-100 text-purple-700">Họp</Badge>
      case "class_session":
        return <Badge className="bg-indigo-100 text-indigo-700">Lớp học</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
      case "scheduled":
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            {status === 'completed' ? 'Hoàn thành' : 'Đã xác nhận'}
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            Chờ xác nhận
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            Đã hủy
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = []
    const startDay = 1
    const endDay = 31 // Simplified for demo
    // Add empty cells would depend on actual month start
    for (let i = startDay; i <= endDay; i++) {
      days.push(i)
    }
    return days
  }

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lịch hẹn</h1>
          <p className="text-muted-foreground">Quản lý lịch tư vấn, phỏng vấn và các cuộc họp</p>
        </div>
        <div className="flex gap-2">
          <Select value={viewMode} onValueChange={setViewMode}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Ngày</SelectItem>
              <SelectItem value="week">Tuần</SelectItem>
              <SelectItem value="month">Tháng</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Thêm lịch hẹn
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Thêm lịch hẹn mới</DialogTitle>
                <DialogDescription>Tạo cuộc hẹn với khách hàng hoặc ứng viên</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" placeholder="VD: Tư vấn phụ huynh" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Loại</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Tư vấn</SelectItem>
                        <SelectItem value="interview">Phỏng vấn</SelectItem>
                        <SelectItem value="complaint">Khiếu nại</SelectItem>
                        <SelectItem value="meeting">Họp</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="client">Khách hàng</Label>
                    <Input id="client" placeholder="Tên khách hàng" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Ngày</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Giờ</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input id="location" placeholder="Văn phòng / Online" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Ghi chú</Label>
                  <Textarea id="notes" placeholder="Thông tin bổ sung..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)}>Tạo lịch hẹn</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{currentMonth}</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-sm font-medium text-muted-foreground py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <Button
                  key={index}
                  variant={day === selectedDate.getDate() ? "default" : "ghost"}
                  className={`h-10 w-full ${!day ? "invisible" : ""} ${day === new Date().getDate() && day !== selectedDate.getDate() ? "bg-blue-50 text-blue-600" : ""
                    }`}
                  onClick={() => {
                    const newDate = new Date()
                    newDate.setDate(day)
                    setSelectedDate(newDate)
                  }}
                  disabled={!day}
                >
                  {day}
                </Button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium mb-2">Chú thích</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Tư vấn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Phỏng vấn</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Khiếu nại</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Lớp học</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Day Schedule */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch ngày {format(selectedDate, "dd/MM/yyyy")}
            </CardTitle>
            <CardDescription>{todayAppointments.length} cuộc hẹn trong ngày</CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Không có lịch hẹn trong ngày này</p>
                <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm lịch hẹn
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className={`p-4 rounded-lg border-l-4 ${apt.type === "consultation"
                      ? "border-l-blue-500 bg-blue-50/50"
                      : apt.type === "interview"
                        ? "border-l-green-500 bg-green-50/50"
                        : apt.type === "complaint"
                          ? "border-l-red-500 bg-red-50/50"
                          : apt.type === "class_session"
                            ? "border-l-indigo-500 bg-indigo-50/50"
                            : "border-l-purple-500 bg-purple-50/50"
                      }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{apt.title}</h3>
                          {getTypeBadge(apt.type)}
                          {getStatusBadge(apt.status)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {apt.time}
                          </span>
                          <span className="flex items-center gap-1">
                            {apt.location.includes("Online") ? (
                              <Video className="h-4 w-4" />
                            ) : (
                              <MapPin className="h-4 w-4" />
                            )}
                            {apt.location}
                          </span>
                        </div>
                        {apt.client.name !== "Team" && (
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" />
                              <AvatarFallback>{apt.client.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{apt.client.name}</p>
                              <p className="text-xs text-muted-foreground">{apt.client.phone}</p>
                            </div>
                          </div>
                        )}
                        {apt.notes && (
                          <p className="text-sm text-muted-foreground bg-background p-2 rounded">{apt.notes}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {apt.client.phone && (
                          <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                          </Button>
                        )}
                        {apt.location.includes("Online") && (
                          <Button variant="outline" size="sm">
                            <Video className="mr-2 h-4 w-4" />
                            Tham gia
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
