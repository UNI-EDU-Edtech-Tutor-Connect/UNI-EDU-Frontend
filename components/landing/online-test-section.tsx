"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Shield, Brain, CreditCard } from "lucide-react"

const testFeatures = [
  { icon: Clock, title: "Mô phỏng thi thật", description: "Đúng format và thời gian THPT QG" },
  { icon: Shield, title: "AI Proctoring", description: "Giám sát chống gian lận" },
  { icon: Brain, title: "Đề AI generate", description: "Đề mới mỗi lần thi" },
  { icon: CreditCard, title: "Chỉ 10.000đ/lần", description: "Thanh toán MoMo/VNPay" },
]

export function OnlineTestSection() {
  return (
    <section id="tests" className="py-20 lg:py-32 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-4 bg-accent text-accent-foreground">Thi thử Online</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Luyện thi THPT Quốc gia với đề AI</h2>
            <p className="text-primary-foreground/80 text-lg mb-8 leading-relaxed">
              Hệ thống thi thử online với đề được AI generate theo chuẩn Bộ GD&ĐT, giám sát bằng AI proctoring để đảm
              bảo công bằng.
            </p>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {testFeatures.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary-foreground/10 flex items-center justify-center">
                    <feature.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-primary-foreground/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              Bắt đầu thi thử
            </Button>
          </div>

          <div className="relative">
            <Card className="bg-background text-foreground">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Đề thi thử Toán THPT QG 2025</span>
                  <Badge>Mới</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Thời gian:</span>
                    <span className="font-medium">90 phút</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Số câu:</span>
                    <span className="font-medium">50 câu trắc nghiệm</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Phí thi:</span>
                    <span className="font-medium text-accent">10.000đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lượt thi:</span>
                    <span className="font-medium">1,234 lượt</span>
                  </div>
                  <Button className="w-full mt-4">Thi ngay</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
