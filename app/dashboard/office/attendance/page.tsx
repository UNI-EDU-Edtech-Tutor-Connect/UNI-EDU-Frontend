"use client"

import { useState } from "react"

import { useAppSelector } from "@/hooks/use-redux"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ClipboardList, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { format, isValid } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"

export default function OfficeAttendancePage() {
    const { classRequests, sessions } = useAppSelector((state) => state.classes)
    const { toast } = useToast()
    const [selectedSession, setSelectedSession] = useState<any | null>(null)

    const allSessions = sessions
        .map(s => {
            const cls = classRequests.find(c => c.id === s.classId);
            return {
                ...s,
                className: cls ? `${cls.subjectName} - Lớp ${cls.grade}` : s.classId,
                studentName: cls?.studentName || "Học sinh",
                tutorName: cls?.assignedTutorName || "Gia sư",
                time: s.scheduledAt ? new Date(s.scheduledAt) : new Date(),
            }
        })
        .sort((a, b) => b.time.getTime() - a.time.getTime())

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "pending_confirmation":
            case "reported":
                return <AlertCircle className="h-5 w-5 text-red-600" />
            default:
                return <Clock className="h-5 w-5 text-blue-600" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "completed":
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Đã học</Badge>
            case "pending_confirmation":
                return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Chờ xác nhận</Badge>
            case "reported":
                return <Badge variant="destructive">Đã báo lỗi</Badge>
            case "absent_student":
            case "absent_tutor":
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Vắng</Badge>
            default:
                return <Badge variant="outline">Sắp tới</Badge>
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Quản lý điểm danh</h1>
                <p className="text-muted-foreground mt-1">Quản lý toàn bộ lịch trình và trạng thái các buổi học</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-blue-500" />
                            Lịch sử các buổi học gần đây
                        </CardTitle>
                        <CardDescription>Trạng thái điểm danh toàn hệ thống</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {allSessions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">Chưa có dữ liệu buổi học</p>
                        ) : (
                            allSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${session.status === 'completed' ? 'bg-green-100' :
                                            (session.status === 'pending_confirmation' || session.status === 'reported') ? 'bg-red-100' :
                                                'bg-blue-100'
                                            }`}>
                                            {getStatusIcon(session.status)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium">{session.className}</p>
                                                {getStatusBadge(session.status)}
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {session.studentName} (Học sinh) - {session.tutorName} (Gia sư)
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Buổi lúc: {isValid(session.time) ? format(session.time, "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                                            Chi tiết
                                        </Button>
                                        {(session.status === "pending_confirmation" || session.status === "reported") && (
                                            <Button size="sm" variant="destructive" onClick={() => toast({ title: "Thông báo", description: "Đã đánh dấu lưu ý xử lý buổi học này." })}>
                                                Xử lý
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>

            {selectedSession && (
                <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Chi tiết buổi học</DialogTitle>
                            <DialogDescription>
                                Thông tin chi tiết buổi học trên hệ thống
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Lớp học</span>
                                <span className="col-span-3 text-sm font-medium">{selectedSession.className}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Thời gian</span>
                                <span className="col-span-3 text-sm">
                                    {isValid(selectedSession.time) ? format(selectedSession.time, "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Học sinh</span>
                                <span className="col-span-3 text-sm">{selectedSession.studentName}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Gia sư</span>
                                <span className="col-span-3 text-sm">{selectedSession.tutorName}</span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Trạng thái</span>
                                <span className="col-span-3 text-sm">{getStatusBadge(selectedSession.status)}</span>
                            </div>
                            {selectedSession.notes && (
                                <div className="grid grid-cols-4 gap-4 mt-2 border-t pt-4">
                                    <span className="text-right text-sm font-medium text-muted-foreground">Ghi chú</span>
                                    <span className="col-span-3 text-sm">{selectedSession.notes}</span>
                                </div>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedSession(null)}>Đóng</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
