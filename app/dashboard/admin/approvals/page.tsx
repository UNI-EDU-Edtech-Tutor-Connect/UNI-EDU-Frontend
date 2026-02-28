"use client"

import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { fetchUsersRequest, approveUserRequest } from "@/store/slices/users-slice"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { User, FileText, GraduationCap, CheckCircle2, XCircle, Clock, ExternalLink, Shield } from "lucide-react"
import type { TutorProfile, TeacherProfile } from "@/types"
import { useToast } from "@/components/ui/use-toast"

export default function ApprovalsPage() {
  const dispatch = useAppDispatch()
  const { pendingApprovals, tutors, teachers, isLoading } = useAppSelector((state) => state.users)
  const [selectedUser, setSelectedUser] = useState<TutorProfile | TeacherProfile | null>(null)
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [approvalAction, setApprovalAction] = useState<"approve" | "reject">("approve")
  const [docDialog, setDocDialog] = useState<{ open: boolean, title: string, src: string }>({ open: false, title: "", src: "" })
  const { toast } = useToast()

  useEffect(() => {
    dispatch(fetchUsersRequest())
  }, [dispatch])

  const handleApproval = (user: TutorProfile | TeacherProfile, action: "approve" | "reject") => {
    setSelectedUser(user)
    setApprovalAction(action)
    setShowApproveDialog(true)
  }

  const confirmApproval = () => {
    if (selectedUser) {
      dispatch(approveUserRequest({ userId: selectedUser.id, approved: approvalAction === "approve" }))
      setShowApproveDialog(false)
      setSelectedUser(null)
    }
  }

  const allApproved = [
    ...tutors.filter((t) => t.approvalStatus === "approved"),
    ...teachers.filter((t) => t.approvalStatus === "approved"),
  ]
  const allRejected = [
    ...tutors.filter((t) => t.approvalStatus === "rejected"),
    ...teachers.filter((t) => t.approvalStatus === "rejected"),
  ]

  const UserCard = ({ user }: { user: TutorProfile | TeacherProfile }) => (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{user.fullName}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="capitalize">
            {user.role === "tutor" ? "Gia sư" : "Giáo viên"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">{user.phone}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Môn dạy</p>
            <p className="font-medium">{user.subjects.join(", ")}</p>
          </div>
          {user.role === "tutor" && (
            <>
              <div>
                <p className="text-muted-foreground">Trường</p>
                <p className="font-medium">{(user as TutorProfile).university || "Chưa cập nhật"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">MSSV</p>
                <p className="font-medium">{(user as TutorProfile).studentId || "Chưa cập nhật"}</p>
              </div>
            </>
          )}
          {user.role === "teacher" && (
            <>
              <div>
                <p className="text-muted-foreground">Cơ quan</p>
                <p className="font-medium">{(user as TeacherProfile).institution}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Kinh nghiệm</p>
                <p className="font-medium">{(user as TeacherProfile).yearsOfExperience} năm</p>
              </div>
            </>
          )}
        </div>

        {/* Documents */}
        <div className="flex flex-wrap gap-2 pt-2 border-t mt-2">
          {user.role === "tutor" ? (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs font-normal" onClick={() => setDocDialog({ open: true, title: "Bảng điểm sinh viên", src: "" })}>
                <FileText className="h-3 w-3 mr-1" />
                Bảng điểm
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-normal" onClick={() => setDocDialog({ open: true, title: "Thẻ sinh viên / Văn bằng", src: "" })}>
                <GraduationCap className="h-3 w-3 mr-1" />
                Văn bằng
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs font-normal" onClick={() => setDocDialog({ open: true, title: "Bản sao Văn bằng", src: "" })}>
                <GraduationCap className="h-3 w-3 mr-1" />
                Văn bằng
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs font-normal" onClick={() => setDocDialog({ open: true, title: "Chứng chỉ sư phạm", src: "" })}>
                <FileText className="h-3 w-3 mr-1" />
                Chứng chỉ SP
              </Button>
            </>
          )}
        </div>

        {/* Verification Status */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">Background check:</span>
            <StatusBadge status={user.backgroundCheckStatus} />
          </div>
          {user.approvalDeadline && (
            <div className="flex items-center gap-1 text-xs text-warning">
              <Clock className="h-3 w-3" />
              <span>Deadline: {new Date(user.approvalDeadline).toLocaleDateString("vi-VN")}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {user.approvalStatus === "pending" && (
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 gap-2 bg-success hover:bg-success/90"
              onClick={() => handleApproval(user, "approve")}
            >
              <CheckCircle2 className="h-4 w-4" />
              Duyệt
            </Button>
            <Button variant="destructive" className="flex-1 gap-2" onClick={() => handleApproval(user, "reject")}>
              <XCircle className="h-4 w-4" />
              Từ chối
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Phê duyệt tài khoản</h1>
        <p className="text-muted-foreground">Xét duyệt đăng ký của gia sư và giáo viên</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            Chờ duyệt
            {pendingApprovals.length > 0 && (
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                {pendingApprovals.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved">Đã duyệt</TabsTrigger>
          <TabsTrigger value="rejected">Từ chối</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-success mb-4" />
                <p className="text-lg font-medium">Không có yêu cầu chờ duyệt</p>
                <p className="text-muted-foreground">Tất cả đã được xử lý</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingApprovals.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {allApproved.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          {allRejected.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground">Chưa có tài khoản bị từ chối</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allRejected.map((user) => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{approvalAction === "approve" ? "Xác nhận phê duyệt" : "Xác nhận từ chối"}</DialogTitle>
            <DialogDescription>
              {approvalAction === "approve"
                ? `Bạn có chắc chắn muốn phê duyệt tài khoản của ${selectedUser?.fullName}? Người dùng sẽ cần làm bài test trước khi nhận lớp.`
                : `Bạn có chắc chắn muốn từ chối tài khoản của ${selectedUser?.fullName}? Hành động này không thể hoàn tác.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Hủy
            </Button>
            <Button
              className={approvalAction === "approve" ? "bg-success hover:bg-success/90" : ""}
              variant={approvalAction === "reject" ? "destructive" : "default"}
              onClick={confirmApproval}
            >
              {approvalAction === "approve" ? "Phê duyệt" : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Document Viewer Dialog */}
      <Dialog open={docDialog.open} onOpenChange={(open) => setDocDialog(prev => ({ ...prev, open }))}>
        <DialogContent className="max-w-3xl sm:h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{docDialog.title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 w-full bg-muted flex flex-col items-center justify-center rounded-md border min-h-[50vh]">
            {docDialog.src ? (
              <img src={docDialog.src} alt="Document" className="w-full h-full object-contain" />
            ) : (
              <div className="flex flex-col items-center text-muted-foreground">
                <FileText className="h-16 w-16 mb-4 opacity-50" />
                <p>Bản xem trước tài liệu (Demo)</p>
                <p className="text-sm mt-2 opacity-75">Tài liệu đã được tải lên và xác minh hợp lệ.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDocDialog(prev => ({ ...prev, open: false }))}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
