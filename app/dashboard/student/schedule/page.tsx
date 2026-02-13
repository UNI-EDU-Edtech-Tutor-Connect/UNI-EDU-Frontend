"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Clock, Video, ChevronLeft, ChevronRight } from "lucide-react"

const shortDayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"]

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchStudentScheduleRequest } from "@/store/slices/student-slice"
import { useEffect } from "react"

export default function StudentSchedulePage() {
  const dispatch = useDispatch()
  const { schedule } = useSelector((state: RootState) => state.student)
  const [currentWeek, setCurrentWeek] = useState(0)

  useEffect(() => {
    dispatch(fetchStudentScheduleRequest())
  }, [dispatch])

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
    return (schedule || []).filter((s) => s.dayOfWeek === dayOfWeek)
  }

  const totalSessions = (schedule || []).length
  const totalHours = (schedule || []).reduce((sum, s) => {
    const start = Number.parseInt(s.startTime.split(":")[0])
    const end = Number.parseInt(s.endTime.split(":")[0])
    return sum + (end - start)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Lịch học</h1>
        <p className="text-muted-foreground">Quản lý lịch học hàng tuần của bạn</p>
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
                <p className="text-sm text-muted-foreground">Buổi học/tuần</p>
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
                <p className="text-sm text-muted-foreground">Giờ học/tuần</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Môn học</p>
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
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">{schedule.tutor.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{schedule.subject}</p>
                      <p className="text-sm text-muted-foreground">{schedule.tutor}</p>
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
                    <Button>Vào lớp</Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Hôm nay không có lịch học</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
