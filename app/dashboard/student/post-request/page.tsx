"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, Send, Sparkles, BookOpen, MapPin, Clock, Info, ShieldCheck } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PostTutorRequestPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [hasParent, setHasParent] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false)
            if (hasParent) {
                toast({
                    title: "Đã gửi yêu cầu cho Phụ huynh!",
                    description: "Yêu cầu tìm gia sư của bạn đã được gửi đến Phụ huynh để xác nhận trước khi đăng lên hệ thống.",
                    variant: "default",
                })
            } else {
                toast({
                    title: "Đăng yêu cầu thành công!",
                    description: "Yêu cầu học của bạn đã được ghi nhận. Hệ thống sẽ kết nối bạn với những ứng viên phù hợp nhất.",
                    variant: "default",
                })
            }
            router.push("/dashboard/student/find-tutor")
        }, 1500)
    }

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="hover:bg-primary/5">
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-primary">Đăng thông tin tìm Gia sư / Giáo viên</h1>
                    <p className="text-muted-foreground mt-1">Hệ thống sẽ tự động đối chiếu và gửi hồ sơ phù hợp nhất cho bạn</p>
                </div>
            </div>

            <Alert className="bg-blue-50/50 border-blue-200">
                <Info className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 font-medium">Bảo mật thông tin</AlertTitle>
                <AlertDescription className="text-blue-700/80 text-sm mt-1">
                    Số điện thoại và địa chỉ cụ thể của bạn sẽ được bảo mật. Chỉ những Gia sư/Giáo viên đã được xác thực (KYC) và được bạn cho phép mới có thể xem thông tin liên hệ.
                </AlertDescription>
            </Alert>

            <Card className="border-t-4 border-t-primary shadow-sm">
                <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">Chi tiết yêu cầu học tập</CardTitle>
                    </div>
                    <CardDescription>
                        Cung cấp thông tin chi tiết giúp việc tìm kiếm (matching) diễn ra nhanh và chính xác nhất.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="pt-6 space-y-8">

                        {/* Core Info */}
                        <div className="space-y-6">
                            <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-primary" /> 1. Thông tin môn học
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject">Môn học <span className="text-red-500">*</span></Label>
                                    <Select required>
                                        <SelectTrigger id="subject" className="bg-background">
                                            <SelectValue placeholder="Chọn môn học..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="toan">Toán học</SelectItem>
                                            <SelectItem value="ly">Vật lý</SelectItem>
                                            <SelectItem value="hoa">Hóa học</SelectItem>
                                            <SelectItem value="van">Ngữ văn</SelectItem>
                                            <SelectItem value="anh">Tiếng Anh</SelectItem>
                                            <SelectItem value="tin">Tin học</SelectItem>
                                            <SelectItem value="nangkhieu">Năng khiếu (Đàn, Vẽ...)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="grade">Lớp / Cấp độ <span className="text-red-500">*</span></Label>
                                    <Select required>
                                        <SelectTrigger id="grade" className="bg-background">
                                            <SelectValue placeholder="Chọn cấp độ..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tieu-hoc">Tiểu học (Lớp 1-5)</SelectItem>
                                            <SelectItem value="thcs">THCS (Lớp 6-9)</SelectItem>
                                            <SelectItem value="thpt">THPT (Lớp 10-12)</SelectItem>
                                            <SelectItem value="luyen-thi">Luyện thi Đại học</SelectItem>
                                            <SelectItem value="ielts">Luyện thi IELTS/TOEIC</SelectItem>
                                            <SelectItem value="nguoi-lon">Giao tiếp cho người đi làm</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="format">Hình thức giảng dạy <span className="text-red-500">*</span></Label>
                                    <Select required>
                                        <SelectTrigger id="format" className="bg-background">
                                            <SelectValue placeholder="Chọn hình thức..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="online">Học Trực tuyến (Online qua Zoom/Meet)</SelectItem>
                                            <SelectItem value="offline">Học Trực tiếp (Tại nhà Học sinh)</SelectItem>
                                            <SelectItem value="hybrid">Linh hoạt (Kết hợp Online & Offline)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="budget">Học phí dự kiến (VNĐ/tháng) <span className="text-red-500">*</span></Label>
                                    <div className="relative">
                                        <Input type="number" id="budget" placeholder="VD: 1500000" required min="500000" step="50000" className="pl-4 pr-12 bg-background" />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">VNĐ</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1"> EduConnect cam kết minh bạch học phí, không thu phí ẩn.</p>
                                </div>
                            </div>
                        </div>

                        {/* Schedule */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" /> 2. Lịch học dự kiến
                            </h3>
                            <div className="pl-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="sessions">Số buổi / tuần <span className="text-red-500">*</span></Label>
                                        <Select required defaultValue="2">
                                            <SelectTrigger id="sessions" className="bg-background">
                                                <SelectValue placeholder="Số buổi..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1">1 buổi / tuần</SelectItem>
                                                <SelectItem value="2">2 buổi / tuần</SelectItem>
                                                <SelectItem value="3">3 buổi / tuần</SelectItem>
                                                <SelectItem value="4">4 buổi / tuần</SelectItem>
                                                <SelectItem value="5">5+ buổi / tuần</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Thời lượng / buổi <span className="text-red-500">*</span></Label>
                                        <Select required defaultValue="90">
                                            <SelectTrigger id="duration" className="bg-background">
                                                <SelectValue placeholder="Thời lượng..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="60">60 phút (1 tiếng)</SelectItem>
                                                <SelectItem value="90">90 phút (1.5 tiếng)</SelectItem>
                                                <SelectItem value="120">120 phút (2 tiếng)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <Label>Khung giờ có thể học (Chọn nhiều)</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map((day) => (
                                            <div key={day} className="flex items-center space-x-2 border p-3 rounded-lg hover:border-primary/50 transition-colors bg-background">
                                                <Checkbox id={`day-${day}`} className="border-primary/50 text-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground" />
                                                <label htmlFor={`day-${day}`} className="text-sm font-medium cursor-pointer flex-1">{day}</label>
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Lịch trình cụ thể sẽ được thỏa thuận trực tiếp sau khi chọn được Gia sư.</p>
                                </div>
                            </div>
                        </div>

                        {/* Tutor Preferences */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-foreground/90 flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" /> 3. Yêu cầu về Người dạy
                            </h3>
                            <div className="pl-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Label>Trình độ chuyên môn</Label>
                                    <RadioGroup defaultValue="any" className="space-y-2">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background">
                                            <RadioGroupItem value="any" id="level-any" />
                                            <Label htmlFor="level-any" className="flex-1 cursor-pointer">Tất cả (Sinh viên giỏi, Cử nhân, Giáo viên)</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background">
                                            <RadioGroupItem value="student" id="level-student" />
                                            <div>
                                                <Label htmlFor="level-student" className="cursor-pointer">Sinh viên / Cử nhân</Label>
                                                <p className="text-xs text-muted-foreground mt-0.5">Tiết kiệm chi phí, gần gũi với học sinh.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-amber-50/50 border-amber-200">
                                            <RadioGroupItem value="teacher" id="level-teacher" className="text-amber-600 border-amber-600 focus-visible:ring-amber-600" />
                                            <div>
                                                <Label htmlFor="level-teacher" className="text-amber-900 cursor-pointer font-medium">Giáo viên (Đã kiểm định)</Label>
                                                <p className="text-xs text-amber-700/80 mt-0.5">Chuyên môn cao, nhiều năm kinh nghiệm sư phạm.</p>
                                            </div>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-3">
                                    <Label>Giới tính</Label>
                                    <RadioGroup defaultValue="any" className="space-y-2">
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background">
                                            <RadioGroupItem value="any" id="gender-any" />
                                            <Label htmlFor="gender-any" className="flex-1 cursor-pointer">Không yêu cầu</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background">
                                            <RadioGroupItem value="female" id="gender-female" />
                                            <Label htmlFor="gender-female" className="flex-1 cursor-pointer">Nữ</Label>
                                        </div>
                                        <div className="flex items-center space-x-2 border p-3 rounded-lg bg-background">
                                            <RadioGroupItem value="male" id="gender-male" />
                                            <Label htmlFor="gender-male" className="flex-1 cursor-pointer">Nam</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-4 pt-2">
                            <div className="space-y-2">
                                <Label htmlFor="description" className="font-semibold text-foreground/90">Mô tả thêm / Mục tiêu học tập</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Ví dụ: Học sinh hiện đang học lớp 10, học lực khá nhưng mất căn bản phần hình học. Cần tìm gia sư kiên nhẫn, có phương pháp dạy sinh động để chuẩn bị cho kỳ thi giữa học kì sắp tới..."
                                    className="min-h-[120px] bg-background resize-y"
                                />
                            </div>

                            <div className="flex items-center space-x-2 border p-4 rounded-lg bg-blue-50/50 border-blue-200 mt-6">
                                <Checkbox
                                    id="has-parent"
                                    checked={hasParent}
                                    onCheckedChange={(checked) => setHasParent(checked as boolean)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white border-blue-300"
                                />
                                <div className="space-y-1 leading-none cursor-pointer" onClick={() => setHasParent(!hasParent)}>
                                    <Label htmlFor="has-parent" className="text-blue-900 font-medium cursor-pointer">
                                        Tôi có Phụ huynh đang quản lý tài khoản này
                                    </Label>
                                    <p className="text-sm text-blue-700">
                                        Nếu chọn, yêu cầu này cần được Phụ huynh phê duyệt trước khi gửi tới Gia sư/Giáo viên.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    <CardFooter className="bg-muted/30 border-t p-6 flex-col gap-4 items-stretch sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-sm text-muted-foreground w-full sm:w-auto text-center sm:text-left">
                            Bằng việc đăng yêu cầu, bạn đồng ý với <a href="#" className="underline text-primary hover:text-primary/80">Điều khoản dịch vụ</a>.
                        </p>
                        <Button type="submit" size="lg" className="w-full sm:w-auto text-base shadow-sm group" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex items-center gap-2"><span className="animate-spin">⏳</span> Đang xử lý...</span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Send className="h-4 w-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                    Đăng Yêu Cầu Tìm Gia Sư
                                </span>
                            )}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
