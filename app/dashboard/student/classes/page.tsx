"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Clock, Video, MapPin, Star, ArrowRight, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { useEffect } from "react"

export default function StudentClassesPage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)
  const { classRequests: classes, sessions } = useSelector((state: RootState) => state.classes) // Alias classRequests as classes for now, but really should be specific
  const { toast } = useToast()

  const [isSubmittingReview, setIsSubmittingReview] = useState(false)
  const [rating, setRating] = useState(5)
  const [reviewText, setReviewText] = useState("")

  const handleSubmitReview = (classId: string) => {
    setIsSubmittingReview(true)
    setTimeout(() => {
      setIsSubmittingReview(false)
      toast({
        title: "Đánh giá thành công!",
        description: "Cảm ơn bạn đã đóng góp ý kiến về Gia sư/Giáo viên.",
        variant: "default",
      })
      setReviewText("")
      setRating(5)
    }, 1000)
  }

  useEffect(() => {
    dispatch(fetchClassesRequest())
  }, [dispatch])

  const myClasses = (classes || []).filter((c) => c.studentId === (user?.id || ""))
  const activeClasses = myClasses.filter((c) => c.status === "in_progress")
  const completedClasses = myClasses.filter((c) => c.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lớp học của tôi</h1>
          <p className="text-muted-foreground">Quản lý và theo dõi tiến độ các lớp đang học</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/student/find-tutor">
            <Users className="h-4 w-4 mr-2" />
            Tìm gia sư mới
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp đang học</p>
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
                <p className="text-2xl font-bold">{
                  activeClasses.reduce((sum, c) => {
                    const classSessions = sessions.filter(s => s.classId === c.id && s.status === 'completed')
                    return sum + classSessions.length
                  }, 0)
                }</p>
                <p className="text-sm text-muted-foreground">Buổi đã học</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedClasses.length}</p>
                <p className="text-sm text-muted-foreground">Lớp hoàn thành</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Classes */}
      {activeClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lớp đang học</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {activeClasses.map((cls) => {
              const classSessions = sessions.filter(s => s.classId === cls.id)
              const sessionsCompleted = classSessions.filter(s => s.status === 'completed').length
              const totalSessions = 24 // Mock total
              return (
                <Card key={cls.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="outline">Lớp {cls.grade}</Badge>
                      <Badge className="bg-green-100 text-green-800">Đang học</Badge>
                    </div>
                    <CardTitle className="text-lg mt-2">{cls.subjectName}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tutor Info */}
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10 text-primary">{(cls.assignedTutorName || 'G').charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{cls.assignedTutorName}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>4.9</span>
                        </div>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {cls.learningFormat === "online" ? <Video className="h-4 w-4" /> : <MapPin className="h-4 w-4" />}
                      <span>{cls.learningFormat === "online" ? "Học online" : "Học tại nhà"}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {cls.preferredSchedule.map((s: any, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {s.dayOfWeek === 1 ? "CN" : "Thứ " + s.dayOfWeek} {s.startTime}-{s.endTime}
                        </Badge>
                      ))}
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ</span>
                        <span className="font-medium">
                          {sessionsCompleted}/{totalSessions} buổi
                        </span>
                      </div>
                      <Progress value={(sessionsCompleted / totalSessions) * 100} className="h-2" />
                    </div>

                    {/* Next Session */}
                    {/* Mock next session logic */}
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <p className="text-xs text-muted-foreground mb-1">Buổi tiếp theo</p>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>Chưa lên lịch</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline" asChild>
                        <Link href={`/dashboard/student/classes/${cls.id}`}>
                          Chi tiết
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                      {cls.learningFormat === "online" && (
                        <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white" asChild>
                          <a href="https://zoom.us/test" target="_blank" rel="noopener noreferrer">
                            <Video className="h-4 w-4 mr-2" />
                            Vào lớp
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Completed Classes */}
      {completedClasses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Lớp đã hoàn thành</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {completedClasses.map((cls) => {
              const classSessions = sessions.filter(s => s.classId === cls.id)
              return (
                <Card key={cls.id} className="opacity-80">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                          <BookOpen className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="font-semibold">{cls.subjectName}</p>
                          <p className="text-sm text-muted-foreground">
                            {cls.assignedTutorName} - {classSessions.length} buổi
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge variant="secondary">Hoàn thành</Badge>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8">
                              <MessageSquare className="w-3 h-3 mr-1" />
                              Đánh giá
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Đánh giá Gia sư</DialogTitle>
                              <DialogDescription>
                                Chia sẻ trải nghiệm học tập của bạn để giúp Gia sư vươn lên và hỗ trợ hàng ngàn học sinh khác.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="flex flex-col items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">Chất lượng giảng dạy</span>
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-8 h-8 cursor-pointer transition-colors ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground hover:text-yellow-200'}`}
                                      onClick={() => setRating(star)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Nhận xét chi tiết</span>
                                <Textarea
                                  placeholder="Gia sư dạy dễ hiểu, nhiệt tình..."
                                  className="min-h-[100px]"
                                  value={reviewText}
                                  onChange={(e) => setReviewText(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                onClick={() => handleSubmitReview(cls.id)}
                                disabled={isSubmittingReview || !reviewText.trim()}
                              >
                                {isSubmittingReview ? "Đang gửi..." : "Gửi Đánh Giá"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
