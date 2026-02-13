"use client"

import { Badge } from "@/components/ui/badge"

const tutorSteps = [
  {
    step: "01",
    title: "Đăng ký & Xác thực",
    description: "Upload bảng điểm, chứng chỉ. AI kiểm tra tự động + Admin phê duyệt trong 48h",
  },
  {
    step: "02",
    title: "Làm bài test",
    description: "Hoàn thành bài kiểm tra năng lực môn học để đảm bảo chất lượng",
  },
  {
    step: "03",
    title: "Nhận lớp & Dạy",
    description: "Xem lớp phù hợp, đăng ký, thanh toán 10% phí và bắt đầu giảng dạy",
  },
  {
    step: "04",
    title: "Nhận lương",
    description: "Nhận 80% lương hàng tháng, 20% escrow giải ngân sau khi hoàn thành",
  },
]

const studentSteps = [
  {
    step: "01",
    title: "Đăng ký lớp học",
    description: "Chọn môn, lịch học, hình thức và mức giá phù hợp với nhu cầu",
  },
  {
    step: "02",
    title: "Ghép gia sư",
    description: "Hệ thống gợi ý gia sư phù hợp, xác nhận và bắt đầu học",
  },
  {
    step: "03",
    title: "Học & Đánh giá",
    description: "Tham gia lớp học, làm test cuối tháng để đo lường tiến độ",
  },
  {
    step: "04",
    title: "Báo cáo cho phụ huynh",
    description: "Phụ huynh nhận báo cáo AI về tiến độ và kết quả học tập",
  },
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 lg:py-32 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Cách hoạt động</h2>
          <p className="text-lg text-muted-foreground">Quy trình đơn giản, minh bạch cho cả gia sư và học sinh</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Tutor Flow */}
          <div>
            <Badge className="mb-6 bg-primary text-primary-foreground">Dành cho Gia sư</Badge>
            <div className="space-y-6">
              {tutorSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    {index < tutorSteps.length - 1 && <div className="w-0.5 h-12 bg-primary/30 mx-auto mt-2" />}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student Flow */}
          <div>
            <Badge className="mb-6 bg-accent text-accent-foreground">Dành cho Học sinh</Badge>
            <div className="space-y-6">
              {studentSteps.map((item, index) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
                      {item.step}
                    </div>
                    {index < studentSteps.length - 1 && <div className="w-0.5 h-12 bg-accent/30 mx-auto mt-2" />}
                  </div>
                  <div className="pb-6">
                    <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
