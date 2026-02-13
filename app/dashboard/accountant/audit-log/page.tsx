"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { RootState } from "@/store"
import { fetchAuditLogsRequest } from "@/store/slices/audit-log-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Search,
  Download,
  Eye,
  Calendar,
  FileText,
  DollarSign,
  Settings,
  Shield,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react"

export default function AuditLogPage() {
  const dispatch = useDispatch()
  const { logs: auditLogs, isLoading, total } = useSelector((state: RootState) => state.auditLog)

  const [searchTerm, setSearchTerm] = useState("")
  const [actionFilter, setActionFilter] = useState("all")
  const [moduleFilter, setModuleFilter] = useState("all")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [selectedLog, setSelectedLog] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAuditLogsRequest({
      search: searchTerm,
      action: actionFilter !== "all" ? actionFilter : undefined,
      module: moduleFilter !== "all" ? moduleFilter : undefined,
      severity: severityFilter !== "all" ? severityFilter : undefined
    }))
  }, [dispatch, searchTerm, actionFilter, moduleFilter, severityFilter])

  // Helper functions for badges and icons
  const getActionBadge = (action: string) => {
    const actionColors: Record<string, string> = {
      CREATE: "bg-green-100 text-green-700",
      UPDATE: "bg-blue-100 text-blue-700",
      DELETE: "bg-red-100 text-red-700",
      VIEW: "bg-gray-100 text-gray-700",
      EXPORT: "bg-purple-100 text-purple-700",
      APPROVE: "bg-emerald-100 text-emerald-700",
      PROCESS: "bg-amber-100 text-amber-700",
      ALERT: "bg-orange-100 text-orange-700",
    }
    return (
      <Badge className={`${actionColors[action] || "bg-gray-100 text-gray-700"} hover:${actionColors[action]}`}>
        {action}
      </Badge>
    )
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getModuleIcon = (module: string) => {
    switch (module) {
      case "Giao dịch":
        return <DollarSign className="h-4 w-4" />
      case "Báo cáo":
        return <FileText className="h-4 w-4" />
      case "Cài đặt":
        return <Settings className="h-4 w-4" />
      case "Bảo mật":
        return <Shield className="h-4 w-4" />
      case "Thanh toán":
        return <DollarSign className="h-4 w-4" />
      case "Hoàn tiền":
        return <DollarSign className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhật ký hoạt động</h1>
          <p className="text-muted-foreground">Theo dõi tất cả hoạt động trong hệ thống tài chính</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => dispatch(fetchAuditLogsRequest({}))}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Làm mới
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Xuất nhật ký
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-50">
                <Clock className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hôm nay</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-50">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thành công</p>
                <p className="text-2xl font-bold">142</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-amber-50">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Cảnh báo</p>
                <p className="text-2xl font-bold">11</p>
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
                <p className="text-sm text-muted-foreground">Lỗi</p>
                <p className="text-2xl font-bold">3</p>
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
                placeholder="Tìm kiếm nhật ký..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Hành động" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="CREATE">Tạo mới</SelectItem>
                  <SelectItem value="UPDATE">Cập nhật</SelectItem>
                  <SelectItem value="DELETE">Xóa</SelectItem>
                  <SelectItem value="VIEW">Xem</SelectItem>
                  <SelectItem value="EXPORT">Xuất</SelectItem>
                  <SelectItem value="APPROVE">Phê duyệt</SelectItem>
                </SelectContent>
              </Select>
              <Select value={moduleFilter} onValueChange={setModuleFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Module" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Giao dịch">Giao dịch</SelectItem>
                  <SelectItem value="Báo cáo">Báo cáo</SelectItem>
                  <SelectItem value="Thanh toán">Thanh toán</SelectItem>
                  <SelectItem value="Cài đặt">Cài đặt</SelectItem>
                  <SelectItem value="Bảo mật">Bảo mật</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Mức độ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="info">Thông tin</SelectItem>
                  <SelectItem value="success">Thành công</SelectItem>
                  <SelectItem value="warning">Cảnh báo</SelectItem>
                  <SelectItem value="error">Lỗi</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Calendar className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhật ký</CardTitle>
          <CardDescription>Hiển thị {auditLogs.length} bản ghi</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải dữ liệu...</div>
          ) : auditLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không có dữ liệu</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    <TableHead>Thời gian</TableHead>
                    <TableHead>Người dùng</TableHead>
                    <TableHead>Hành động</TableHead>
                    <TableHead>Module</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead className="text-right">Chi tiết</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>{getSeverityIcon(log.severity)}</TableCell>
                      <TableCell className="text-muted-foreground whitespace-nowrap">{new Date(log.timestamp).toLocaleString('vi-VN')}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={log.user.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="text-xs">{log.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{log.user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getModuleIcon(log.module)}
                          <span>{log.module}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[250px] truncate">{log.description}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{log.ipAddress}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedLog(log)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">Trang {currentPage} / {Math.ceil(total / 10) || 1}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" disabled={currentPage >= Math.ceil(total / 10)} onClick={() => setCurrentPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedLog && getSeverityIcon(selectedLog.severity)}
              Chi tiết nhật ký
            </DialogTitle>
            <DialogDescription>Mã: {selectedLog?.id}</DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Thời gian</p>
                  <p className="font-medium">{new Date(selectedLog.timestamp).toLocaleString('vi-VN')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Địa chỉ IP</p>
                  <p className="font-medium">{selectedLog.ipAddress}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Người thực hiện</p>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar>
                    <AvatarImage src={selectedLog.user.avatar || "/placeholder.svg"} />
                    <AvatarFallback>{selectedLog.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedLog.user.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedLog.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Hành động</p>
                  {getActionBadge(selectedLog.action)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Module</p>
                  <div className="flex items-center gap-1">
                    {getModuleIcon(selectedLog.module)}
                    <span className="font-medium">{selectedLog.module}</span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Mô tả</p>
                <p className="font-medium">{selectedLog.description}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Chi tiết kỹ thuật</p>
                <ScrollArea className="h-[150px] rounded-lg border p-3">
                  <pre className="text-sm">{JSON.stringify(selectedLog.details, null, 2)}</pre>
                </ScrollArea>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
