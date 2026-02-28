"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Star, MapPin, GraduationCap, Clock, DollarSign, Heart, MessageCircle, BadgeCheck, PlayCircle, Eye, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Tutor {
  id: string
  name: string
  avatar: string
  subjects: string[]
  rating: number
  reviews: number
  hourlyRate: number
  experience: number
  location: string
  bio: string
  education: string
  availability: string[]
  totalStudents: number
  completedLessons: number
  isVerified: boolean
  hasVideo: boolean
  successRate: number
}

const mockTutors: Tutor[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    avatar: "/male-tutor-professional.jpg",
    subjects: ["Toán", "Vật lý"],
    rating: 4.9,
    reviews: 128,
    hourlyRate: 300000,
    experience: 5,
    location: "Quận 1, TP.HCM",
    bio: "Giáo viên toán với 5 năm kinh nghiệm, chuyên luyện thi đại học và THPT Quốc gia.",
    education: "Thạc sĩ Toán học - ĐH Sư phạm TP.HCM",
    availability: ["Thứ 2", "Thứ 4", "Thứ 6", "Chủ nhật"],
    totalStudents: 45,
    completedLessons: 520,
    isVerified: true,
    hasVideo: true,
    successRate: 98,
  },
  {
    id: "2",
    name: "Trần Thị B",
    avatar: "/female-tutor-professional.jpg",
    subjects: ["Tiếng Anh", "IELTS"],
    rating: 4.8,
    reviews: 95,
    hourlyRate: 400000,
    experience: 7,
    location: "Quận 3, TP.HCM",
    bio: "IELTS 8.5, từng du học Úc. Chuyên luyện IELTS và tiếng Anh giao tiếp cho mọi lứa tuổi.",
    education: "Cử nhân Ngôn ngữ Anh - University of Melbourne",
    availability: ["Thứ 3", "Thứ 5", "Thứ 7"],
    totalStudents: 62,
    completedLessons: 890,
    isVerified: true,
    hasVideo: true,
    successRate: 95,
  },
  {
    id: "3",
    name: "Lê Văn C",
    avatar: "/male-tutor-young.jpg",
    subjects: ["Hóa học", "Sinh học"],
    rating: 4.7,
    reviews: 67,
    hourlyRate: 250000,
    experience: 3,
    location: "Quận Bình Thạnh, TP.HCM",
    bio: "Sinh viên Y khoa năm cuối, đam mê giảng dạy các môn khoa học tự nhiên.",
    education: "Sinh viên Y khoa - ĐH Y Dược TP.HCM",
    availability: ["Thứ 2", "Thứ 3", "Thứ 5", "Chủ nhật"],
    totalStudents: 28,
    completedLessons: 210,
    isVerified: false,
    hasVideo: false,
    successRate: 88,
  },
  {
    id: "4",
    name: "Phạm Thị D",
    avatar: "/female-tutor-middle-age.jpg",
    subjects: ["Văn học", "Lịch sử"],
    rating: 4.9,
    reviews: 156,
    hourlyRate: 280000,
    experience: 10,
    location: "Quận Tân Bình, TP.HCM",
    bio: "Giáo viên THPT với 10 năm kinh nghiệm, nhiều học sinh đạt điểm cao môn Văn trong kỳ thi quốc gia.",
    education: "Thạc sĩ Văn học - ĐH KHXH&NV TP.HCM",
    availability: ["Thứ 2", "Thứ 4", "Thứ 6", "Thứ 7"],
    totalStudents: 85,
    completedLessons: 1240,
    isVerified: true,
    hasVideo: true,
    successRate: 99,
  },
]

export default function FindTutorPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null)
  const [showRequestDialog, setShowRequestDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { toast } = useToast()
  const router = useRouter()

  const filteredTutors = mockTutors.filter((tutor) => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesSubject =
      subjectFilter === "all" || tutor.subjects.some((s) => s.toLowerCase().includes(subjectFilter.toLowerCase()))
    const matchesPrice = tutor.hourlyRate >= priceRange[0] && tutor.hourlyRate <= priceRange[1]
    return matchesSearch && matchesSubject && matchesPrice
  })

  const toggleFavorite = (tutorId: string) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(tutorId)) {
      newFavorites.delete(tutorId)
    } else {
      newFavorites.add(tutorId)
    }
    setFavorites(newFavorites)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "đ"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Tìm gia sư</h1>
          <p className="text-muted-foreground mt-1">Tìm kiếm và kết nối với gia sư phù hợp nhất cho lộ trình học tập của bạn</p>
        </div>
        <Button size="lg" className="shadow-sm w-full md:w-auto" onClick={() => router.push('/dashboard/student/post-request')}>
          <MessageCircle className="h-4 w-4 mr-2" />
          Đăng Yêu Cầu Tìm Gia Sư
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-t-4 border-t-primary shadow-sm bg-card/50">
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-4">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-foreground/80">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoặc môn học..."
                  className="pl-9 bg-background"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">Môn học</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Môn học" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả môn</SelectItem>
                  <SelectItem value="toán">Toán học</SelectItem>
                  <SelectItem value="tiếng anh">Tiếng Anh</SelectItem>
                  <SelectItem value="vật lý">Vật lý</SelectItem>
                  <SelectItem value="hóa học">Hóa học</SelectItem>
                  <SelectItem value="văn học">Ngữ văn</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-foreground/80">Học phí/giờ</span>
                <span className="text-primary font-semibold">
                  {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </span>
              </div>
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                max={500000}
                min={0}
                step={50000}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredTutors.map((tutor) => (
          <Card key={tutor.id} className="hover:border-primary/50 transition-colors shadow-sm group">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Avatar className="h-24 w-24 flex-shrink-0 border-2 border-muted group-hover:border-primary/20 transition-colors">
                  <AvatarImage src={tutor.avatar || "/placeholder.svg"} alt={tutor.name} />
                  <AvatarFallback className="text-lg bg-primary/5 text-primary">{tutor.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-primary hover:underline cursor-pointer" onClick={() => { setSelectedTutor(tutor); setShowProfileDialog(true); }}>{tutor.name}</h3>
                        {tutor.isVerified && (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Đã xác minh KYC
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 bg-accent/10 px-2.5 py-1 rounded-full border border-accent/20 transition-colors group-hover:bg-accent/15">
                          <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                          <span className="font-bold text-accent-foreground/90 dark:text-accent text-sm">{tutor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">({tutor.reviews} đánh giá)</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => toggleFavorite(tutor.id)} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
                      <Heart className={`h-5 w-5 ${favorites.has(tutor.id) ? "fill-destructive text-destructive" : ""}`} />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject} variant="outline" className="border-primary/20 text-primary bg-primary/5">
                        {subject}
                      </Badge>
                    ))}
                  </div>

                  <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-muted pl-4 italic">
                    {tutor.bio}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span>{tutor.experience} năm kinh nghiệm</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span>{tutor.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>{tutor.completedLessons} buổi học</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="font-bold text-lg text-primary">{formatPrice(tutor.hourlyRate)}<span className="text-xs font-normal text-muted-foreground">/giờ</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 justify-center md:w-48 md:border-l md:pl-6 border-dashed">
                  <Button
                    className="w-full shadow-sm"
                    size="lg"
                    onClick={() => {
                      setSelectedTutor(tutor)
                      setShowRequestDialog(true)
                    }}
                  >
                    Đăng ký học
                  </Button>
                  <Button variant="outline" className="w-full text-accent border-accent hover:bg-accent/10" onClick={() => {
                    toast({
                      title: "Đăng ký học thử",
                      description: "Yêu cầu đăng ký buổi học thử miễn phí đã được gửI!"
                    })
                  }}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Học thử (Trial)
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground hover:text-primary" onClick={() => { setSelectedTutor(tutor); setShowProfileDialog(true); }}>
                    <Eye className="h-4 w-4 mr-2" />
                    Xem hồ sơ
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTutors.length === 0 && (
          <Card className="bg-muted/30 border-dashed">
            <CardContent className="py-12 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy gia sư phù hợp</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Hãy thử điều chỉnh bộ lọc tìm kiếm hoặc liên hệ với bộ phận hỗ trợ để được tư vấn.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Đăng ký học với {selectedTutor?.name}</DialogTitle>
            <DialogDescription>Gửi yêu cầu học để gia sư xem xét và liên hệ với bạn</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium">Môn học mong muốn</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Lịch học mong muốn</label>
              <Select>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Chọn ngày" />
                </SelectTrigger>
                <SelectContent>
                  {selectedTutor?.availability.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Ghi chú thêm</label>
              <Input className="mt-1" placeholder="Mục tiêu học tập, yêu cầu đặc biệt..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={() => {
                toast({
                  title: "Đăng ký thành công",
                  description: `Yêu cầu học với gia sư ${selectedTutor?.name} đã được gửi thành công!`
                })
                setShowRequestDialog(false)
              }}
            >
              Gửi yêu cầu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Hồ sơ gia sư</DialogTitle>
          </DialogHeader>
          {selectedTutor && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24 border-2 border-primary/20">
                  <AvatarImage src={selectedTutor.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{selectedTutor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{selectedTutor.name}</h2>
                    {selectedTutor.isVerified && (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100 flex items-center gap-1 cursor-help" title="Thông tin bằng cấp, CMND/CCCD của gia sư này đã được đội kiểm duyệt xác thực.">
                        <BadgeCheck className="w-3 h-3" /> Xác thực nền tảng (KYC)
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold">{selectedTutor.rating}</span>
                    <span className="text-muted-foreground text-sm">({selectedTutor.reviews} đánh giá)</span>
                  </div>
                  <p className="text-muted-foreground mt-2">{selectedTutor.bio}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/30 border">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                  <p className="font-bold">{selectedTutor.experience} năm</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Tỉ lệ thành công</p>
                  <p className="font-bold text-green-600">{selectedTutor.successRate}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Học sinh</p>
                  <p className="font-bold">{selectedTutor.totalStudents}+</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Buổi học</p>
                  <p className="font-bold">{selectedTutor.completedLessons}+</p>
                </div>
              </div>

              {selectedTutor.hasVideo && (
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                    <PlayCircle className="h-5 w-5 text-primary" /> Video giới thiệu / Dạy thử
                  </h3>
                  <div className="aspect-video bg-black/90 rounded-lg flex items-center justify-center relative cursor-pointer group shadow-sm overflow-hidden">
                    <p className="text-white/50 absolute bottom-4 left-4 z-10 text-sm">Demo Video Intro</p>
                    <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                    <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:bg-primary transition-colors hover:scale-105 duration-200">
                      <PlayCircle className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-2">Bằng cấp & Chứng chỉ</h3>
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-blue-50/50">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-base">{selectedTutor.education}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Chứng chỉ và bằng cấp đã được đối chiếu với bản gốc thông qua hệ thống định danh nâng cao của chúng tôi.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t pt-4">
                <Button variant="outline" onClick={() => setShowProfileDialog(false)}>Đóng</Button>
                <Button onClick={() => {
                  setShowProfileDialog(false)
                  setShowRequestDialog(true)
                }}>Đăng ký học ngay</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
