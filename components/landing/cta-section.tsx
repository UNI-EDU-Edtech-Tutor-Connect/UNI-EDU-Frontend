"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useAppDispatch } from "@/hooks/use-redux"
import { openRegisterModal } from "@/store/slices/auth-slice"

export function CTASection() {
  const dispatch = useAppDispatch()

  return (
    <section className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center bg-primary rounded-3xl p-12 lg:p-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 text-balance">
            Sẵn sàng bắt đầu hành trình học tập?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Đăng ký ngay hôm nay để tìm gia sư phù hợp hoặc bắt đầu sự nghiệp giảng dạy của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={() => dispatch(openRegisterModal("student"))}
            >
              Tìm gia sư ngay
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => dispatch(openRegisterModal("tutor"))}
            >
              Trở thành gia sư
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
