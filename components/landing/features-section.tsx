"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Brain, CreditCard, FileCheck, Video, Bell, Globe, Smartphone } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Xác thực gia sư",
    description: "Kiểm tra lý lịch, bằng cấp và năng lực qua AI + Admin trong 48 giờ",
  },
  {
    icon: Brain,
    title: "AI đánh giá",
    description: "Tự động tạo đề và chấm điểm, báo cáo tiến độ học tập hàng tháng",
  },
  {
    icon: CreditCard,
    title: "Thanh toán an toàn",
    description: "Escrow 20%, thanh toán qua MoMo/VNPay, audit log realtime",
  },
  {
    icon: FileCheck,
    title: "Test online",
    description: "Thi thử THPT QG 12 môn, AI proctoring chống gian lận",
  },
  {
    icon: Video,
    title: "Học trực tuyến",
    description: "Tích hợp Zoom/Google Meet, lịch tự động đồng bộ",
  },
  {
    icon: Bell,
    title: "Thông báo thông minh",
    description: "Push notification, email nhắc nhở vắng học tự động",
  },
  {
    icon: Globe,
    title: "Đa ngôn ngữ",
    description: "Hỗ trợ Tiếng Việt và Tiếng Anh đầy đủ",
  },
  {
    icon: Smartphone,
    title: "Mobile App",
    description: "Quản lý lớp học mọi lúc mọi nơi trên điện thoại",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Tính năng nổi bật</h2>
          <p className="text-lg text-muted-foreground">Hệ thống quản lý học tập toàn diện với công nghệ AI tiên tiến</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <Card key={feature.title} className="group hover:shadow-lg transition-shadow duration-300 border-border">
              <CardContent className="p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
