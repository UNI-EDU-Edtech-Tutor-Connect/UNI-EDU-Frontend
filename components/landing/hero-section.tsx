"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, CheckCircle2, Users, BookOpen, Award } from "lucide-react"
import { useAppDispatch } from "@/hooks/use-redux"
import { openRegisterModal } from "@/store/slices/auth-slice"

const stats = [
  { icon: Users, value: "1,200+", label: "Gia sư & Giáo viên" },
  { icon: BookOpen, value: "890+", label: "Học sinh" },
  { icon: Award, value: "98%", label: "Hài lòng" },
]

const benefits = ["Gia sư được kiểm tra năng lực", "AI hỗ trợ đánh giá học tập", "Thanh toán an toàn, minh bạch"]

export function HeroSection() {
  const dispatch = useAppDispatch()

  return (
    <section className="relative overflow-hidden bg-secondary py-20 lg:py-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0B3C5D08_1px,transparent_1px),linear-gradient(to_bottom,#0B3C5D08_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="container relative mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <Badge variant="outline" className="bg-background border-primary/20 text-primary">
              Nền tảng giáo dục hàng đầu Việt Nam
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Kết nối <span className="text-primary">Gia sư</span> chất lượng với{" "}
              <span className="text-accent">Học sinh</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              EduConnect giúp phụ huynh tìm gia sư phù hợp, đảm bảo chất lượng giảng dạy thông qua hệ thống kiểm tra
              năng lực và đánh giá AI.
            </p>

            {/* Benefits */}
            <ul className="space-y-3">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 text-foreground">
                  <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={() => dispatch(openRegisterModal("student"))}
              >
                Tìm gia sư ngay
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => dispatch(openRegisterModal("tutor"))}>
                Đăng ký làm gia sư
              </Button>
            </div>
          </div>

          {/* Right Content - Stats Card */}
          <div className="relative">
            <div className="bg-background rounded-2xl shadow-2xl p-8 border border-border">
              <div className="grid grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-3">
                      <stat.icon className="h-6 w-6" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Featured Tutors Preview */}
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="text-sm font-medium text-muted-foreground mb-4">Gia sư nổi bật</h3>
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden">
                      <img
                        src={`/tutor-avatar-.jpg?height=40&width=40&query=tutor avatar ${i}`}
                        alt={`Gia sư ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground border-2 border-background">
                    +180
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
