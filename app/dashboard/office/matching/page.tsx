"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchUsersRequest } from "@/store/slices/users-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Star, MapPin, Users, ArrowRight, CheckCircle } from "lucide-react"

interface ClassRequestDisplay {
  id: string
  student: string
  parent: string | null
  subject: string
  grade: string
  location: string
  schedule: string
  budget: string
  requirements: string
  createdAt: string
}

interface TutorDisplay {
  id: string
  name: string
  avatar: string
  subjects: string[]
  rating: number
  location: string
  hourlyRate: number
  availability: string[]
  experience: number
  matchScore: number
  bio: string
}

export default function MatchingPage() {
  const dispatch = useAppDispatch()
  const { classRequests } = useAppSelector((state) => state.classes)
  const { tutors } = useAppSelector((state) => state.users)
  const [selectedClass, setSelectedClass] = useState<ClassRequestDisplay | null>(null)
  const [selectedTutor, setSelectedTutor] = useState<TutorDisplay | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchUsersRequest())
  }, [dispatch])

  const pendingClasses: ClassRequestDisplay[] = classRequests
    .filter(c => c.status === 'open')
    .map(c => ({
      id: c.id,
      student: c.studentName || "Học sinh",
      parent: c.parentId || null,
      subject: c.subjectName,
      grade: `Lớp ${c.grade}`,
      location: c.location || "Online",
      schedule: c.preferredSchedule.map(s => `T${s.dayOfWeek + 1}`).join(", "),
      budget: new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(c.monthlyBudget / (4 * c.preferredSchedule.length || 8)), // Approx per session
      requirements: c.requirements || "Không có yêu cầu đặc biệt",
      createdAt: c.createdAt ? new Date(c.createdAt).toLocaleDateString('vi-VN') : "N/A"
    }))

  const calculateMatchScore = (tutor: any, classReq: ClassRequestDisplay) => {
    let score = 0
    // Subject match
    if (tutor.subjects?.some((s: string) => s.toLowerCase().includes(classReq.subject.toLowerCase()))) {
      score += 50
    }
    // Experience match (mock based on totalClasses)
    if (tutor.totalClasses > 50) score += 20

    // Location match (mock string check - assuming all in similar area for now as User has no address)
    // if (tutor.address && classReq.location && tutor.address.includes(classReq.location)) {
    //    score += 20
    // }
    score += 10 // Base location score

    // Random jitter for demo variation if scores match
    score += Math.floor(Math.random() * 10)

    return Math.min(score, 100)
  }

  const getMatchingTutors = (classRequest: ClassRequestDisplay): TutorDisplay[] => {
    return tutors
      .map(t => ({
        id: t.id,
        name: t.fullName,
        avatar: t.avatar || "",
        subjects: t.subjects || [],
        rating: t.rating || 0,
        location: "TP.HCM", // Mock, as User doesn't have address
        hourlyRate: t.monthlyEarnings ? t.monthlyEarnings / 40 : 200000, // Mock hourly from monthly earnings / 40 hours
        availability: ["T2", "T4", "T6"], // Mock availability
        experience: Math.floor((t.totalClasses || 0) / 20), // Proxy for experience
        matchScore: calculateMatchScore(t, classRequest),
        bio: t.university || "Gia sư"
      }))
      .filter((t) => t.subjects.some((s) => s.toLowerCase().includes(classRequest.subject.toLowerCase())))
      .sort((a, b) => b.matchScore - a.matchScore)
  }

  const filteredClasses = pendingClasses.filter((c) => {
    const matchesSearch =
      c.student.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSubject = subjectFilter === "all" || c.subject.toLowerCase().includes(subjectFilter.toLowerCase())
    return matchesSearch && matchesSubject
  })

  // Only compute tutors if a class is selected to avoid heavy calculation on every render
  const currentMatchingTutors = selectedClass ? getMatchingTutors(selectedClass) : []

  const handleMatch = () => {
    // TODO: Call API to create class matching
    // POST /api/classes/match with classId, tutorId
    console.log("Matching", selectedClass?.id, selectedTutor?.id)
    setShowConfirmDialog(false)
    setSelectedClass(null)
    setSelectedTutor(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Ghép gia sư - Học sinh</h1>
        <p className="text-muted-foreground mt-1">Tìm và ghép gia sư phù hợp cho các yêu cầu lớp học</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên học sinh, môn học..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={subjectFilter} onValueChange={setSubjectFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Môn học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả môn</SelectItem>
            <SelectItem value="toán">Toán</SelectItem>
            <SelectItem value="tiếng anh">Tiếng Anh</SelectItem>
            <SelectItem value="vật lý">Vật lý</SelectItem>
            <SelectItem value="hóa học">Hóa học</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Class Requests */}
        <Card>
          <CardHeader>
            <CardTitle>Yêu cầu lớp học ({filteredClasses.length})</CardTitle>
            <CardDescription>Chọn một yêu cầu để tìm gia sư phù hợp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {filteredClasses.map((classReq) => (
                <div
                  key={classReq.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedClass?.id === classReq.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                    }`}
                  onClick={() => {
                    setSelectedClass(classReq)
                    setSelectedTutor(null)
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{classReq.student}</h4>
                        <Badge>{classReq.subject}</Badge>
                        <Badge variant="outline">{classReq.grade}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Phụ huynh ID: {classReq.parent || "N/A"}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{classReq.createdAt}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {classReq.location}
                    </div>
                    <div>Lịch: {classReq.schedule}</div>
                    <div>Ngân sách: {classReq.budget}/buổi</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">Yêu cầu: {classReq.requirements}</p>
                </div>
              ))}

              {filteredClasses.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Không có yêu cầu lớp học phù hợp</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Matching Tutors */}
        <Card>
          <CardHeader>
            <CardTitle>Gia sư phù hợp</CardTitle>
            <CardDescription>
              {selectedClass
                ? `Đề xuất cho lớp ${selectedClass.subject} - ${selectedClass.student}`
                : "Chọn một yêu cầu lớp học để xem đề xuất"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedClass ? (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {currentMatchingTutors.map((tutor) => (
                  <div
                    key={tutor.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedTutor?.id === tutor.id ? "border-primary bg-primary/5" : "hover:bg-accent/50"
                      }`}
                    onClick={() => setSelectedTutor(tutor)}
                  >
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={tutor.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{tutor.name}</h4>
                          <Badge className="bg-green-100 text-green-800">{tutor.matchScore}% phù hợp</Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {tutor.rating} - {tutor.experience} năm kinh nghiệm
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{new Intl.NumberFormat("vi-VN").format(tutor.hourlyRate)}đ/giờ</p>
                        <p className="text-sm text-muted-foreground">{tutor.location}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {tutor.subjects.map((subject) => (
                        <Badge key={subject} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Lịch trống: {tutor.availability.join(", ")}</p>
                  </div>
                ))}

                {currentMatchingTutors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Không tìm thấy gia sư phù hợp</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <ArrowRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Vui lòng chọn một yêu cầu lớp học bên trái để xem danh sách gia sư phù hợp</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {selectedClass && selectedTutor && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Học sinh</p>
                  <p className="font-semibold">{selectedClass.student}</p>
                  <Badge variant="outline">{selectedClass.subject}</Badge>
                </div>
                <ArrowRight className="h-6 w-6 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Gia sư</p>
                  <p className="font-semibold">{selectedTutor.name}</p>
                  <Badge className="bg-green-100 text-green-800">{selectedTutor.matchScore}% phù hợp</Badge>
                </div>
              </div>
              <Button onClick={() => setShowConfirmDialog(true)}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Xác nhận ghép
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận ghép gia sư</DialogTitle>
            <DialogDescription>Bạn sắp ghép gia sư cho lớp học này</DialogDescription>
          </DialogHeader>
          {selectedClass && selectedTutor && (
            <div className="space-y-4 py-4">
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Lớp học</p>
                <p className="font-semibold">
                  {selectedClass.subject} - {selectedClass.grade}
                </p>
                <p className="text-sm">Học sinh: {selectedClass.student}</p>
              </div>
              <div className="p-4 bg-accent rounded-lg">
                <p className="text-sm text-muted-foreground">Gia sư</p>
                <p className="font-semibold">{selectedTutor.name}</p>
                <p className="text-sm">
                  {new Intl.NumberFormat("vi-VN").format(selectedTutor.hourlyRate)}đ/giờ - {selectedTutor.matchScore}%
                  phù hợp
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleMatch}>Xác nhận ghép</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
