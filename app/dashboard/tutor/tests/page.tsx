"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchAvailableTestsRequest, fetchCompletedTestsRequest } from "@/store/slices/tests-slice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  BookOpen,
  Award,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react"
import Link from "next/link"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

export default function TutorTestsPage() {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { availableTests, completedTests, isLoading } = useAppSelector((state) => state.tests)
  const [selectedTab, setSelectedTab] = useState("available")

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchAvailableTestsRequest(user.id))
      dispatch(fetchCompletedTestsRequest(user.id))
    }
  }, [dispatch, user?.id])

  const passedTests = completedTests.filter((t) => t.passed).length
  const totalTests = completedTests.length
  const averageScore = totalTests > 0
    ? completedTests.reduce((sum, t) => sum + t.score, 0) / totalTests
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Bài kiểm tra năng lực</h1>
        <p className="text-muted-foreground">Hoàn thành bài test để đăng ký nhận lớp. Điểm đậu tối thiểu là 70%.</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileCheck className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{availableTests.length}</p>
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
                <p className="text-2xl font-bold">
                  {passedTests}/{totalTests}
                </p>
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
                <p className="text-2xl font-bold">{averageScore.toFixed(0)}%</p>
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
                <p className="text-2xl font-bold">{totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(0) : 0}%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="available">
            Bài test có sẵn
            <Badge variant="secondary" className="ml-2">
              {availableTests.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="completed">
            Đã hoàn thành
            <Badge variant="secondary" className="ml-2">
              {completedTests.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : availableTests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không có bài test nào</div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {availableTests.map((test) => (
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
                        <span>Hạn: {new Date(test.deadline).toLocaleDateString("vi-VN")}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                        <p className="text-xs text-amber-700">Đậu bài test để được thanh toán và nhận lớp</p>
                      </div>
                    </div>

                    <Button className="w-full" asChild>
                      <Link href={`/dashboard/tutor/tests/${test.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Làm bài test
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Đang tải...</div>
          ) : completedTests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Chưa có bài test nào hoàn thành</div>
          ) : (
            completedTests.map((test) => (
              <Card key={test.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`h-12 w-12 rounded-lg flex items-center justify-center ${test.passed ? "bg-green-100" : "bg-red-100"
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
                          {test.subject} - Hoàn thành: {new Date(test.completedAt).toLocaleDateString("vi-VN")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className={`text-2xl font-bold ${test.passed ? "text-green-600" : "text-red-600"}`}>
                            {test.score}%
                          </span>
                          <span className="text-sm text-muted-foreground">/ {test.passingScore}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Thời gian: {test.duration} phút</p>
                      </div>
                      <Badge variant={test.passed ? "default" : "destructive"}>{test.passed ? "Đậu" : "Không đậu"}</Badge>
                    </div>
                  </div>
                  {test.passed && (
                    <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-sm text-green-700 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Bạn đã đủ điều kiện nhận lớp này. Vui lòng thanh toán để hoàn tất.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
