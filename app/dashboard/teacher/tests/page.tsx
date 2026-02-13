"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCheck, Clock, CheckCircle, XCircle, BookOpen, Award, TrendingUp, Calendar, Target } from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

const mockAvailableTests = [
  {
    id: "t1",
    classId: "class-1",
    className: "Toán Nâng cao - Lớp 12",
    subject: "Toán",
    duration: 45,
    questions: 15,
    passingScore: 75,
    deadline: "2025-12-20",
    reward: 800000,
  },
  {
    id: "t2",
    classId: "class-2",
    className: "Vật Lý Chuyên - Lớp 11",
    subject: "Vật lý",
    duration: 60,
    questions: 20,
    passingScore: 80,
    deadline: "2025-12-25",
    reward: 1000000,
  },
]

const mockCompletedTests = [
  {
    id: "ct1",
    className: "Toán Đại số",
    subject: "Toán",
    score: 92,
    passingScore: 75,
    passed: true,
    completedAt: "2025-12-01",
  },
  {
    id: "ct2",
    className: "Vật lý Cơ học",
    subject: "Vật lý",
    score: 88,
    passingScore: 75,
    passed: true,
    completedAt: "2025-11-20",
  },
]

export default function TeacherTestsPage() {
  const [selectedTab, setSelectedTab] = useState("available")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bài kiểm tra năng lực</h1>
        <p className="text-muted-foreground">Hoàn thành bài test chuyên môn để nhận lớp giảng dạy</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockAvailableTests.length}</p>
                <p className="text-sm text-muted-foreground">Bài test chờ làm</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{mockCompletedTests.filter((t) => t.passed).length}</p>
                <p className="text-sm text-muted-foreground">Bài test đã đậu</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">90%</p>
                <p className="text-sm text-muted-foreground">Điểm trung bình</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">100%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">Bài test có sẵn</TabsTrigger>
          <TabsTrigger value="completed">Đã hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAvailableTests.map((test) => (
              <Card key={test.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="outline">{test.subject}</Badge>
                    <Badge className="bg-accent text-accent-foreground">{formatCurrency(test.reward)}</Badge>
                  </div>
                  <CardTitle className="text-lg mt-2">{test.className}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{test.duration} phút</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <FileCheck className="h-4 w-4" />
                      <span>{test.questions} câu hỏi</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Target className="h-4 w-4" />
                      <span>Đậu: {test.passingScore}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(test.deadline).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>

                  <Button className="w-full" asChild>
                    <Link href={`/dashboard/teacher/tests/${test.id}`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Làm bài test
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {mockCompletedTests.map((test) => (
            <Card key={test.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                        test.passed ? "bg-green-100" : "bg-red-100"
                      }`}
                    >
                      {test.passed ? (
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold">{test.className}</h4>
                      <p className="text-sm text-muted-foreground">
                        {test.subject} - Hoàn thành: {test.completedAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <span className={`text-2xl font-bold ${test.passed ? "text-green-600" : "text-red-600"}`}>
                        {test.score}%
                      </span>
                    </div>
                    <Badge variant={test.passed ? "default" : "destructive"}>{test.passed ? "Đậu" : "Không đậu"}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
