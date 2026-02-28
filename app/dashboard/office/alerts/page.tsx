"use client"

import { useState } from "react"

import { useAppSelector } from "@/hooks/use-redux"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, MessageSquare } from "lucide-react"
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

export default function OfficeAlertsPage() {
    const { classRequests, sessions } = useAppSelector((state) => state.classes)
    const { toast } = useToast()
    const [selectedSession, setSelectedSession] = useState<any | null>(null)

    const reportedSessions = sessions
        .filter(s => s.status === "reported")
        .map(s => {
            const cls = classRequests.find(c => c.id === s.classId);
            return {
                id: s.id,
                classId: s.classId,
                className: cls ? `${cls.subjectName} - Lớp ${cls.grade}` : s.classId,
                studentName: cls?.studentName || "Học sinh",
                tutorName: cls?.assignedTutorName || "Gia sư",
                time: s.scheduledAt ? new Date(s.scheduledAt) : new Date(),
                reason: "Xung đột kết quả điểm danh",
            }
        })
        .sort((a, b) => b.time.getTime() - a.time.getTime())

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Cảnh báo & Xử lý sự cố</h1>
                <p className="text-muted-foreground mt-1">Quản lý các sự cố, báo cáo sai lệch từ hệ thống và người dùng</p>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            Cảnh báo điểm danh (Báo cáo sai lệch)
                        </CardTitle>
                        <CardDescription>Danh sách chi tiết các buổi học bị báo cáo sai lệch</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {reportedSessions.length === 0 ? (
                            <p className="text-center text-muted-foreground py-8">Không có báo cáo sai lệch điểm danh</p>
                        ) : (
                            reportedSessions.map((session) => (
                                <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg bg-red-50/50">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full flex items-center justify-center bg-red-100">
                                            <AlertCircle className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-red-800">{session.className}</p>
                                                <Badge variant="destructive">Khẩn cấp</Badge>
                                            </div>
                                            <p className="text-sm text-red-600/80">
                                                {session.studentName} (Học sinh) - {session.tutorName} (Gia sư)
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Buổi học: {isValid(session.time) ? format(session.time, "HH:mm dd/MM/yyyy", { locale: vi }) : "Chưa cập nhật"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedSession(session)}>
                                            Xem chi tiết
                                        </Button>
                                        <Button variant="outline" size="sm" onClick={() => toast({ title: "Đang liên hệ", description: "Đang mở cửa sổ chat..." })}>
                                            <MessageSquare className="h-4 w-4 mr-2" />
                                            Liên hệ
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => toast({ title: "Thông báo", description: "Đã tiếp nhận xử lý." })}>
                                            Nhận xử lý
                                        </Button>
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
                            <DialogTitle>Chi tiết báo cáo sai lệch</DialogTitle>
                            <DialogDescription>
                                Thông tin sự cố điểm danh khẩn cấp
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Lớp học</span>
                                <span className="col-span-3 text-sm font-medium text-red-800">{selectedSession.className}</span>
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
                                <span className="col-span-3 text-sm">
                                    <Badge variant="destructive">Đã báo lỗi</Badge>
                                </span>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <span className="text-right text-sm font-medium text-muted-foreground">Lý do</span>
                                <span className="col-span-3 text-sm">{selectedSession.reason}</span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelectedSession(null)}>Đóng</Button>
                            <Button variant="destructive" onClick={() => toast({ title: "Đang liên hệ", description: "Đang mở cửa sổ chat..." })}>Liên hệ ngay</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}
