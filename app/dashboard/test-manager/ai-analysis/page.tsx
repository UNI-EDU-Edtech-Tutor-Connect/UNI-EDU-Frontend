"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Target,
  BarChart3,
  Lightbulb,
  BookOpen,
  RefreshCw,
  Download,
} from "lucide-react"

const analysisData = {
  overallScore: 78,
  passRate: 85,
  avgTime: 45,
  totalAttempts: 156,
  insights: [
    {
      type: "warning",
      title: "Câu hỏi quá khó",
      description: "3 câu hỏi có tỷ lệ đúng dưới 30%, cần xem xét điều chỉnh độ khó.",
      action: "Xem chi tiết",
    },
    {
      type: "success",
      title: "Độ khó cân bằng",
      description: "70% câu hỏi có tỷ lệ đúng trong khoảng 50-80%, phù hợp với mục tiêu đánh giá.",
      action: "Xem phân bố",
    },
    {
      type: "info",
      title: "Thời gian làm bài",
      description: "Thời gian trung bình 45 phút, phù hợp với độ dài bài kiểm tra 60 phút.",
      action: "Xem thống kê",
    },
    {
      type: "warning",
      title: "Câu hỏi trùng lặp",
      description: "Phát hiện 2 câu hỏi có nội dung tương tự, cần kiểm tra lại.",
      action: "Xem câu hỏi",
    },
  ],
  weakTopics: [
    { topic: "Đạo hàm", correctRate: 45, suggestion: "Bổ sung thêm câu hỏi cơ bản về quy tắc đạo hàm" },
    { topic: "Tích phân", correctRate: 52, suggestion: "Thêm bài tập ứng dụng thực tế" },
    { topic: "Giới hạn", correctRate: 58, suggestion: "Cần giải thích rõ hơn về khái niệm" },
  ],
  strongTopics: [
    { topic: "Phương trình", correctRate: 88, suggestion: "Có thể tăng độ khó" },
    { topic: "Bất phương trình", correctRate: 82, suggestion: "Thêm dạng bài nâng cao" },
    { topic: "Hàm số", correctRate: 78, suggestion: "Phù hợp, giữ nguyên" },
  ],
  recommendations: [
    "Cân nhắc thêm câu hỏi về ứng dụng thực tế của tích phân",
    "Giảm độ khó của câu hỏi về đạo hàm hàm hợp",
    "Bổ sung giải thích chi tiết cho các câu hỏi khó",
    "Tạo ngân hàng câu hỏi phụ cho các chủ đề yếu",
  ],
}

export default function AIAnalysisPage() {
  const [selectedTest, setSelectedTest] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(true)

  const handleAnalyze = () => {
    setIsAnalyzing(true)
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "info":
        return <Lightbulb className="h-5 w-5 text-blue-500" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Phân tích kết quả thông minh</h1>
          <p className="text-muted-foreground">AI phân tích chi tiết kết quả bài kiểm tra và đề xuất cải thiện</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedTest} onValueChange={setSelectedTest}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Chọn bài kiểm tra" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="test1">Toán học - Đại số tuyến tính</SelectItem>
              <SelectItem value="test2">Tiếng Anh - Reading</SelectItem>
              <SelectItem value="test3">Vật lý - Điện từ học</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAnalyze} disabled={isAnalyzing}>
            {isAnalyzing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Đang phân tích...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Phân tích
              </>
            )}
          </Button>
        </div>
      </div>

      {showResults && (
        <>
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-50">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Điểm trung bình</p>
                    <p className="text-2xl font-bold">{analysisData.overallScore}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-50">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tỷ lệ đậu</p>
                    <p className="text-2xl font-bold">{analysisData.passRate}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-amber-50">
                    <Users className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Lượt làm</p>
                    <p className="text-2xl font-bold">{analysisData.totalAttempts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-50">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian TB</p>
                    <p className="text-2xl font-bold">{analysisData.avgTime} phút</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Phân tích AI
              </CardTitle>
              <CardDescription>Những phát hiện và đề xuất từ AI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {analysisData.insights.map((insight, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-l-4 ${
                      insight.type === "warning"
                        ? "border-l-amber-500 bg-amber-50/50"
                        : insight.type === "success"
                          ? "border-l-green-500 bg-green-50/50"
                          : "border-l-blue-500 bg-blue-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1">
                        <h4 className="font-semibold">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                        <Button variant="link" size="sm" className="mt-2 p-0 h-auto">
                          {insight.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="topics" className="space-y-4">
            <TabsList>
              <TabsTrigger value="topics">Phân tích chủ đề</TabsTrigger>
              <TabsTrigger value="recommendations">Đề xuất cải thiện</TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-4">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <XCircle className="h-5 w-5 text-red-500" />
                      Chủ đề yếu
                    </CardTitle>
                    <CardDescription>Các chủ đề cần cải thiện</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisData.weakTopics.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{topic.topic}</span>
                            <Badge variant="destructive">{topic.correctRate}%</Badge>
                          </div>
                          <Progress value={topic.correctRate} className="h-2" />
                          <p className="text-sm text-muted-foreground">{topic.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      Chủ đề mạnh
                    </CardTitle>
                    <CardDescription>Các chủ đề đạt kết quả tốt</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysisData.strongTopics.map((topic, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{topic.topic}</span>
                            <Badge className="bg-green-100 text-green-700">{topic.correctRate}%</Badge>
                          </div>
                          <Progress value={topic.correctRate} className="h-2" />
                          <p className="text-sm text-muted-foreground">{topic.suggestion}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-500" />
                      Đề xuất cải thiện
                    </CardTitle>
                    <CardDescription>AI đề xuất các hành động để cải thiện bài kiểm tra</CardDescription>
                  </div>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Xuất báo cáo
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analysisData.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start gap-3 p-4 bg-muted rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{rec}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Áp dụng
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Tài liệu gợi ý
                  </CardTitle>
                  <CardDescription>Tài liệu hỗ trợ cho các chủ đề yếu</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button variant="outline" className="h-auto p-4 flex-col items-start bg-transparent">
                      <span className="font-medium">Đạo hàm cơ bản</span>
                      <span className="text-sm text-muted-foreground">15 bài tập + Lý thuyết</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col items-start bg-transparent">
                      <span className="font-medium">Tích phân ứng dụng</span>
                      <span className="text-sm text-muted-foreground">20 bài tập + Video</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col items-start bg-transparent">
                      <span className="font-medium">Giới hạn hàm số</span>
                      <span className="text-sm text-muted-foreground">12 bài tập + Ví dụ</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}
