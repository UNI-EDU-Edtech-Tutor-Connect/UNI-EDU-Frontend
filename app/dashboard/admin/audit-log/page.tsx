"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import {
    Download,
    Search,
    Filter,
    Eye,
    ShieldAlert,
    UserCircle,
    FileEdit,
    Settings,
    LogIn,
    CalendarClock,
    ServerCrash,
    MoreHorizontal
} from "lucide-react"

// Types
type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "SETTINGS" | "ERROR" | "WARNING"
type LogEntry = {
    id: string
    timestamp: string
    user: {
        name: string
        role: string
        email: string
    }
    action: ActionType
    resource: string
    details: string
    ip: string
    status: "success" | "warning" | "error"
    metadata?: any
}

// Mock Data
const MOCK_LOGS: LogEntry[] = [
    {
        id: "AL-89912",
        timestamp: "2026-03-02 20:45:12",
        user: { name: "System Admin", role: "admin", email: "admin@educonnect.vn" },
        action: "UPDATE",
        resource: "System Settings",
        details: "Cập nhật cấu hình phí giữ chỗ Escrow (Solution B)",
        ip: "192.168.1.55",
        status: "success",
        metadata: { prevLimit: "300000", newLimit: "400000", module: "finance" }
    },
    {
        id: "AL-89911",
        timestamp: "2026-03-02 20:30:05",
        user: { name: "Trần Văn Nam", role: "student", email: "nam.tv@gmail.com" },
        action: "LOGIN",
        resource: "Authentication",
        details: "Đăng nhập thành công từ thiết bị mới",
        ip: "116.108.55.21",
        status: "success",
        metadata: { device: "iPhone 15 Pro", browser: "Safari 17.0", location: "Hanoi, VN" }
    },
    {
        id: "AL-89910",
        timestamp: "2026-03-02 20:15:42",
        user: { name: "Nguyễn Lê Phong", role: "teacher", email: "phong.nl@educonnect.vn" },
        action: "WARNING",
        resource: "Wallet",
        details: "Thất bại nỗ lực Rút tiền (Giao dịch vượt quá số dư)",
        ip: "14.241.22.110",
        status: "warning",
        metadata: { requested: 5000000, balance: 4850000 }
    },
    {
        id: "AL-89909",
        timestamp: "2026-03-02 19:40:02",
        user: { name: "Lê Thu Hà", role: "office", email: "ha.lt@educonnect.vn" },
        action: "CREATE",
        resource: "Auto-Schedule",
        details: "Kích hoạt mô-đun xếp lịch tự động cho 14 lớp mới",
        ip: "Inside Office VN",
        status: "success",
        metadata: { totalClasses: 14, algorithms: "AI Constraint Satisfaction", executionTime: "1.2s" }
    },
    {
        id: "AL-89908",
        timestamp: "2026-03-02 18:05:33",
        user: { name: "Unknown", role: "guest", email: "N/A" },
        action: "ERROR",
        resource: "API Endpoint",
        details: "SQL Injection thử nghiệm chặn bởi WAF (Tường lửa)",
        ip: "45.101.22.9",
        status: "error",
        metadata: { payload: "' OR 1=1 --", route: "/api/v1/users/login", blocked: true }
    },
    {
        id: "AL-89907",
        timestamp: "2026-03-02 16:30:00",
        user: { name: "System Admin", role: "admin", email: "admin@educonnect.vn" },
        action: "DELETE",
        resource: "User Management",
        details: "Xóa tài khoản Gia sư vi phạm (ID: TUTOR-912)",
        ip: "192.168.1.55",
        status: "success",
        metadata: { reason: "Spam platform", deletedAt: "2026-03-02T09:30:00Z" }
    },
    {
        id: "AL-89906",
        timestamp: "2026-03-02 15:20:10",
        user: { name: "Bùi Tuấn Anh", role: "tutor", email: "tuananh@gmail.com" },
        action: "UPDATE",
        resource: "Availability",
        details: "Cập nhật lịch rảnh các ngày trong tuần",
        ip: "123.16.20.5",
        status: "success",
        metadata: { totalHoursChange: "+4 hours", syncToOffice: true }
    }
]

export default function AuditLogPage() {
    const [logs, setLogs] = useState<LogEntry[]>(MOCK_LOGS)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterAction, setFilterAction] = useState<string>("all")
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)

    // Filter Logic
    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.ip.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesAction = filterAction === "all" || log.action === filterAction

        return matchesSearch && matchesAction
    })

    const getActionIcon = (action: ActionType) => {
        switch (action) {
            case "LOGIN": return <LogIn className="w-4 h-4 text-blue-500" />
            case "CREATE": return <FileEdit className="w-4 h-4 text-green-500" />
            case "UPDATE": return <Settings className="w-4 h-4 text-amber-500" />
            case "DELETE": return <ShieldAlert className="w-4 h-4 text-red-500" />
            case "SETTINGS": return <Settings className="w-4 h-4 text-slate-500" />
            case "ERROR": return <ServerCrash className="w-4 h-4 text-red-600" />
            case "WARNING": return <ShieldAlert className="w-4 h-4 text-amber-600" />
            default: return <UserCircle className="w-4 h-4" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success": return <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">Thành công</Badge>
            case "warning": return <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Cảnh báo</Badge>
            case "error": return <Badge variant="outline" className="border-red-200 text-red-700 bg-red-50">Lỗi</Badge>
            default: return null
        }
    }

    const handleViewDetail = (log: LogEntry) => {
        setSelectedLog(log)
        setIsDetailOpen(true)
    }

    return (
        <div className="space-y-6 max-w-7xl mx-auto pb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Audit Log</h1>
                    <p className="text-muted-foreground mt-1">
                        Theo dõi mọi hoạt động, thay đổi hệ thống và phát hiện các luồng đăng nhập bất thường. Được lưu chuẩn bảo mật độc lập.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" /> Xuất Nhật ký chuẩn CSV
                    </Button>
                </div>
            </div>

            {/* Filter Controls */}
            <Card>
                <CardContent className="p-4 grid md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm Email, Nội dung thao tác, IP, ID..."
                            className="pl-9"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div>
                        <Select value={filterAction} onValueChange={setFilterAction}>
                            <SelectTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4" />
                                    <SelectValue placeholder="Hành động" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tất cả hành động</SelectItem>
                                <SelectItem value="LOGIN">Đăng nhập (LOGIN)</SelectItem>
                                <SelectItem value="CREATE">Tạo mới (CREATE)</SelectItem>
                                <SelectItem value="UPDATE">Cập nhật (UPDATE)</SelectItem>
                                <SelectItem value="DELETE">Xóa (DELETE)</SelectItem>
                                <SelectItem value="WARNING">Cảnh báo (WARNING)</SelectItem>
                                <SelectItem value="ERROR">Lỗi hệ thống (ERROR)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Button variant="secondary" className="w-full gap-2">
                            <CalendarClock className="w-4 h-4" /> Hôm nay (02/03)
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Logs Table */}
            <Card>
                <CardHeader className="px-6 py-4 border-b">
                    <CardTitle className="text-lg font-medium flex items-center justify-between">
                        <span>Danh sách Giao thức ({filteredLogs.length} bản ghi)</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[180px]">Thời gian</TableHead>
                                    <TableHead>Tài khoản</TableHead>
                                    <TableHead>Hành động</TableHead>
                                    <TableHead className="hidden md:table-cell w-[30%]">Chi tiết</TableHead>
                                    <TableHead className="hidden lg:table-cell">Địa chỉ IP</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                    <TableHead className="text-right">Tùy chọn</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            Không tìm thấy log nào khớp với bộ lọc
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredLogs.map((log) => (
                                        <TableRow key={log.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetail(log)}>
                                            <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                                                {log.timestamp}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{log.user.name}</span>
                                                    <span className="text-xs text-muted-foreground uppercase">{log.user.role}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getActionIcon(log.action)}
                                                    <span className="text-sm font-medium">{log.action}</span>
                                                </div>
                                                <span className="text-[10px] text-muted-foreground">{log.resource}</span>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                <span className="text-sm line-clamp-2" title={log.details}>{log.details}</span>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell font-mono text-xs">
                                                {log.ip}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(log.status)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent hover:text-accent-foreground" onClick={(e) => { e.stopPropagation(); handleViewDetail(log); }}>
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Log Detail Dialog */}
            <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileEdit className="h-5 w-5 text-primary" /> Chi tiết Truy vết Audit
                        </DialogTitle>
                        <DialogDescription>
                            ID Giao thức: <span className="font-mono font-medium">{selectedLog?.id}</span>
                        </DialogDescription>
                    </DialogHeader>

                    {selectedLog && (
                        <div className="space-y-6 mt-4">
                            {/* Summary Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/30 rounded-lg border">
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Thời gian hệ thống</p>
                                    <p className="font-mono text-sm">{selectedLog.timestamp}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Phân loại</p>
                                    <div className="flex items-center gap-1.5 h-5">
                                        {getActionIcon(selectedLog.action)} <span className="text-sm font-medium">{selectedLog.action}</span>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Địa chỉ Access IP</p>
                                    <p className="font-mono text-sm">{selectedLog.ip}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Trạng thái cuối</p>
                                    <div>{getStatusBadge(selectedLog.status)}</div>
                                </div>
                            </div>

                            {/* User & Content Info */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><UserCircle className="w-4 h-4" /> Nguồn thực thi (Executor)</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm p-3 rounded-md bg-white border dark:bg-slate-950">
                                        <div className="flex flex-col"><span className="text-muted-foreground text-xs">Tên/ID:</span> <span className="font-medium">{selectedLog.user.name}</span></div>
                                        <div className="flex flex-col"><span className="text-muted-foreground text-xs">Vai trò:</span> <span className="uppercase text-primary">{selectedLog.user.role}</span></div>
                                        <div className="flex flex-col col-span-2"><span className="text-muted-foreground text-xs">Email / Contact:</span> <span>{selectedLog.user.email}</span></div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Settings className="w-4 h-4" /> Diễn biến thao tác</h4>
                                    <div className="p-3 rounded-md bg-white border dark:bg-slate-950 text-sm">
                                        <p className="mb-2"><span className="text-muted-foreground text-xs">Module tác động:</span> <strong className="text-blue-600 dark:text-blue-400">{selectedLog.resource}</strong></p>
                                        <p>{selectedLog.details}</p>
                                    </div>
                                </div>

                                {selectedLog.metadata && (
                                    <div>
                                        <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><ServerCrash className="w-4 h-4" /> Metadata (JSON Payload)</h4>
                                        <div className="relative">
                                            <pre className="p-4 rounded-md bg-slate-950 text-slate-50 overflow-x-auto text-xs font-mono leading-relaxed border shadow-inner">
                                                <code>{JSON.stringify(selectedLog.metadata, null, 2)}</code>
                                            </pre>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
