"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Video, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

const dayNames = ["Chủ nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"]
const shortDayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

const mockSchedule = [
  {
    id: "1",
    subject: "Toán Cao Cấp",
    student: "Nguyễn Văn Minh",
    dayOfWeek: 1,
    startTime: "14:00",
    endTime: "16:00",
    type: "online",
    status: "scheduled",
  },
  {
    id: "2",
    subject: "Toán Cao Cấp",
    student: "Nguyễn Văn Minh",
    dayOfWeek: 3,
    startTime: "14:00",
    endTime: "16:00",
    type: "online",
    status: "scheduled",
  },
  {
    id: "3",
    subject: "Vật lý 11",
    student: "Trần Thị Lan",
    dayOfWeek: 2,
    startTime: "09:00",
    endTime: "11:00",
    type: "offline",
    status: "scheduled",
  },
  {
    id: "4",
    subject: "Vật lý 11",
    student: "Trần Thị Lan",
    dayOfWeek: 5,
    startTime: "09:00",
    endTime: "11:00",
    type: "offline",
    status: "scheduled",
  },
  {
    id: "5",
    subject: "Hóa học 12",
    student: "Lê Hoàng Nam",
    dayOfWeek: 4,
    startTime: "19:00",
    endTime: "21:00",
    type: "online",
    status: "scheduled",
  },
]

export default function TeacherSchedulePage() {
  const [currentWeek, setCurrentWeek] = useState(0)
  const { toast } = useToast()

  const getWeekDates = (weekOffset: number) => {
    const today = new Date()
    const startOfWeek = new Date(today)
    startOfWeek.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startOfWeek)
      date.setDate(startOfWeek.getDate() + i)
      return date
    })
  }

  const weekDates = getWeekDates(currentWeek)
  const today = new Date()

  const getScheduleForDay = (dayOfWeek: number) => {
    return mockSchedule.filter((s) => s.dayOfWeek === dayOfWeek)
  }

  const totalSessions = mockSchedule.length
  const totalHours = mockSchedule.reduce((sum, s) => {
    const start = Number.parseInt(s.startTime.split(":")[0])
    const end = Number.parseInt(s.endTime.split(":")[0])
    return sum + (end - start)
  }, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lịch dạy</h1>
          <p className="text-muted-foreground">Quản lý lịch giảng dạy hàng tuần</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSessions}</p>
                <p className="text-sm text-muted-foreground">Buổi/tuần</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalHours}</p>
                <p className="text-sm text-muted-foreground">Giờ/tuần</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Học sinh</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Lịch tuần</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek((prev) => prev - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={() => setCurrentWeek(0)}>
                Tuần này
              </Button>
              <Button variant="outline" size="icon" onClick={() => setCurrentWeek((prev) => prev + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-4">
            {weekDates.map((date, index) => {
              const daySchedule = getScheduleForDay(index === 6 ? 0 : index + 1)
              const isToday = date.toDateString() === today.toDateString()

              return (
                <div
                  key={index}
                  className={`min-h-[200px] rounded-lg border p-3 ${isToday ? "border-primary bg-primary/5" : ""}`}
                >
                  <div className="text-center mb-3">
                    <p className={`text-sm font-medium ${isToday ? "text-primary" : "text-muted-foreground"}`}>
                      {shortDayNames[index === 6 ? 0 : index + 1]}
                    </p>
                    <p className={`text-lg font-bold ${isToday ? "text-primary" : ""}`}>{date.getDate()}</p>
                  </div>

                  <div className="space-y-2">
                    {daySchedule.map((schedule) => (
                      <div
                        key={schedule.id}
                        className={`p-2 rounded-lg text-xs ${schedule.type === "online"
                            ? "bg-blue-100 border border-blue-200"
                            : "bg-green-100 border border-green-200"
                          }`}
                      >
                        <p className="font-medium truncate">{schedule.subject}</p>
                        <p className="text-muted-foreground">{schedule.startTime}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {schedule.type === "online" ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch hôm nay</CardTitle>
        </CardHeader>
        <CardContent>
          {getScheduleForDay(today.getDay() === 0 ? 0 : today.getDay()).length > 0 ? (
            <div className="space-y-4">
              {getScheduleForDay(today.getDay() === 0 ? 0 : today.getDay()).map((schedule) => (
                <div key={schedule.id} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${schedule.type === "online" ? "bg-blue-100" : "bg-green-100"
                        }`}
                    >
                      {schedule.type === "online" ? (
                        <Video className="h-6 w-6 text-blue-600" />
                      ) : (
                        <MapPin className="h-6 w-6 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{schedule.subject}</p>
                      <p className="text-sm text-muted-foreground">{schedule.student}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-medium">
                        {schedule.startTime} - {schedule.endTime}
                      </p>
                      <Badge variant={schedule.type === "online" ? "default" : "secondary"}>
                        {schedule.type === "online" ? "Online" : "Tại nhà"}
                      </Badge>
                    </div>
                    <Button onClick={() => toast({ title: "Đang vào lớp...", description: "Hệ thống đang kết nối đến phòng học ảo." })}>Vào lớp</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Hôm nay không có lịch dạy</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
