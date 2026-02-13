"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Nguyễn Thị Mai",
    role: "Phụ huynh",
    avatar: "/vietnamese-mother-avatar.jpg",
    content:
      "Con tôi tiến bộ rõ rệt sau 3 tháng học với gia sư trên EduConnect. Báo cáo AI giúp tôi theo dõi tiến độ rất tốt.",
    rating: 5,
  },
  {
    name: "Trần Văn Hùng",
    role: "Gia sư Toán",
    avatar: "/vietnamese-male-tutor-avatar.jpg",
    content:
      "Hệ thống thanh toán minh bạch, nhận lương đúng hạn. Quy trình xét duyệt nghiêm túc giúp tôi tự tin hơn về chất lượng.",
    rating: 5,
  },
  {
    name: "Lê Hoàng Anh",
    role: "Học sinh lớp 12",
    avatar: "/vietnamese-female-student-avatar.jpg",
    content: "Thi thử online rất giống đề thật, giúp em làm quen với áp lực thi cử. AI chấm điểm nhanh và chính xác.",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Đánh giá từ người dùng</h2>
          <p className="text-lg text-muted-foreground">Hơn 2,000 người dùng đã tin tưởng EduConnect</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <Card key={item.name} className="bg-background border-border">
              <CardContent className="p-6">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed">{item.content}</p>
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar || "/placeholder.svg"}
                    alt={item.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">{item.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
