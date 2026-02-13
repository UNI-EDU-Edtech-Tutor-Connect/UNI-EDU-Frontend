"use client"

import { useState, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchClassesRequest } from "@/store/slices/classes-slice"
import { fetchOfficeDataRequest } from "@/store/slices/office-slice"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  MessageSquare,
  BookOpen,
  AlertTriangle,
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  Send,
  Phone,
  User,
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export default function RequestsPage() {
  const dispatch = useAppDispatch()
  const { classRequests, isLoading } = useAppSelector((state) => state.classes)
  const { supportRequests } = useAppSelector((state) => state.office)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<any | null>(null)
  const [responseText, setResponseText] = useState("")

  useEffect(() => {
    dispatch(fetchClassesRequest())
    dispatch(fetchOfficeDataRequest())
  }, [dispatch])

  const dynamicRequests = classRequests.map(r => ({
    id: r.id,
    type: "class_request",
    title: `Yêu cầu lớp: ${r.subjectName}`,
    description: r.requirements || `Tìm gia sư môn ${r.subjectName} lớp ${r.grade}. ${r.location ? `Khu vực: ${r.location}` : ''}`,
    from: { name: r.studentName || "Học sinh", role: "student", phone: "N/A", email: "N/A" },
    time: r.createdAt ? format(new Date(r.createdAt), "dd/MM/yyyy HH:mm", { locale: vi }) : "N/A",
    date: r.createdAt,
    priority: "high", // Mock priority for class requests as high
    status: r.status === 'open' ? 'pending' : r.status === 'in_progress' ? 'resolved' : 'pending',
    responses: []
  }))

  const mappedSupportRequests = supportRequests.map(r => ({
    id: r.id,
    type: r.type,
    title: r.title,
    description: r.type === "support" ? "Hỏi về lịch học..." : "Chi tiết...", // Placeholder
    from: { name: r.from, role: "user", phone: "...", email: "..." },
    time: r.time,
    date: r.time,
    priority: r.priority,
    status: r.status,
    responses: []
  }))

  const allRequests = [...dynamicRequests, ...mappedSupportRequests]

  const filteredRequests = allRequests.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.from.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || req.type === typeFilter
    const matchesStatus = statusFilter === "all" || req.status === statusFilter
    return matchesSearch && matchesType && matchesStatus
  })

  // ... rest of helper functions remain mostly same, ensure status types line up
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "class_request":
        return <BookOpen className="h-5 w-5 text-blue-600" />
      case "support":
        return <HelpCircle className="h-5 w-5 text-green-600" />
      case "complaint":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case "refund":
        return <MessageSquare className="h-5 w-5 text-amber-600" />
      default:
        return <MessageSquare className="h-5 w-5" />
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "class_request":
        return <Badge className="bg-blue-100 text-blue-700">Yêu cầu lớp</Badge>
      case "support":
        return <Badge className="bg-green-100 text-green-700">Hỗ trợ</Badge>
      case "complaint":
        return <Badge className="bg-red-100 text-red-700">Khiếu nại</Badge>
      case "refund":
        return <Badge className="bg-amber-100 text-amber-700">Hoàn tiền</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">Cao</Badge>
      case "medium":
        return <Badge className="bg-amber-100 text-amber-700">Trung bình</Badge>
      case "low":
        return <Badge variant="secondary">Thấp</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-amber-500 text-amber-600">
            <Clock className="mr-1 h-3 w-3" />
            Chờ xử lý
          </Badge>
        )
      case "in_progress":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-600">
            <MessageSquare className="mr-1 h-3 w-3" />
            Đang xử lý
          </Badge>
        )
      case "resolved":
      case "completed": // Map completed to resolved visually
        return (
          <Badge variant="outline" className="border-green-500 text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Đã giải quyết
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-600">
            <XCircle className="mr-1 h-3 w-3" />
            Từ chối
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const stats = {
    total: allRequests.length,
    pending: allRequests.filter((r) => r.status === "pending").length,
    inProgress: allRequests.filter((r) => r.status === "in_progress").length,
    highPriority: allRequests.filter((r) => r.priority === "high" && r.status !== "resolved").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý yêu cầu</h1>
          <p className="text-muted-foreground">Xử lý các yêu cầu và hỗ trợ từ khách hàng</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng yêu cầu</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Chờ xử lý</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang xử lý</p>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-red-50">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Ưu tiên cao</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm yêu cầu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Loại yêu cầu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="class_request">Yêu cầu lớp</SelectItem>
                  <SelectItem value="support">Hỗ trợ</SelectItem>
                  <SelectItem value="complaint">Khiếu nại</SelectItem>
                  <SelectItem value="refund">Hoàn tiền</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="pending">Chờ xử lý</SelectItem>
                  <SelectItem value="in_progress">Đang xử lý</SelectItem>
                  <SelectItem value="resolved">Đã giải quyết</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <Card key={request.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-full ${request.type === "class_request"
                      ? "bg-blue-50"
                      : request.type === "support"
                        ? "bg-green-50"
                        : request.type === "complaint"
                          ? "bg-red-50"
                          : "bg-amber-50"
                      }`}
                  >
                    {getTypeIcon(request.type)}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{request.title}</h3>
                      {getTypeBadge(request.type)}
                      {getPriorityBadge(request.priority)}
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {request.from.name}
                      </span>
                      <span>{request.time}</span>
                      {request.responses.length > 0 && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {request.responses.length} phản hồi
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedRequest(request)}>
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRequest && getTypeIcon(selectedRequest.type)}
              {selectedRequest?.title}
            </DialogTitle>
            <DialogDescription>
              Mã: {selectedRequest?.id} - {selectedRequest?.time}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                {getTypeBadge(selectedRequest.type)}
                {getPriorityBadge(selectedRequest.priority)}
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{selectedRequest.from.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedRequest.from.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.from.phone}
                    </p>
                  </div>
                </div>
                <p>{selectedRequest.description}</p>
              </div>

              {selectedRequest.responses.length > 0 && (
                <div>
                  <Label className="mb-2 block">Lịch sử phản hồi</Label>
                  <ScrollArea className="h-[150px] rounded-lg border p-3">
                    <div className="space-y-3">
                      {selectedRequest.responses.map((response: any, index: number) => (
                        <div key={index} className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{response.from}</span>
                            <span className="text-xs text-muted-foreground">{response.time}</span>
                          </div>
                          <p className="text-sm">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div>
                <Label htmlFor="response">Phản hồi</Label>
                <div className="flex gap-2 mt-2">
                  <Textarea
                    id="response"
                    placeholder="Nhập phản hồi..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1">
                  <Send className="mr-2 h-4 w-4" />
                  Gửi phản hồi
                </Button>
                {selectedRequest.status !== "resolved" && (
                  <Button variant="outline">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Đánh dấu hoàn thành
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
