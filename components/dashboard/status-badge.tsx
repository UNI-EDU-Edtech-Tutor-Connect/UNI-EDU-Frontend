import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusType =
  | "pending"
  | "approved"
  | "rejected"
  | "active"
  | "inactive"
  | "completed"
  | "cancelled"
  | "in_progress"
  | "open"
  | "pending_payment"
  | "verified"
  | "unverified"
  | "passed"
  | "failed"

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: { label: "Chờ duyệt", className: "bg-warning/10 text-warning border-warning/20" },
  approved: { label: "Đã duyệt", className: "bg-success/10 text-success border-success/20" },
  rejected: { label: "Từ chối", className: "bg-destructive/10 text-destructive border-destructive/20" },
  active: { label: "Hoạt động", className: "bg-success/10 text-success border-success/20" },
  inactive: { label: "Tạm dừng", className: "bg-muted text-muted-foreground border-border" },
  completed: { label: "Hoàn thành", className: "bg-success/10 text-success border-success/20" },
  cancelled: { label: "Đã hủy", className: "bg-destructive/10 text-destructive border-destructive/20" },
  in_progress: { label: "Đang học", className: "bg-primary/10 text-primary border-primary/20" },
  open: { label: "Đang tìm", className: "bg-accent/10 text-accent border-accent/20" },
  pending_payment: { label: "Chờ thanh toán", className: "bg-warning/10 text-warning border-warning/20" },
  verified: { label: "Đã xác thực", className: "bg-success/10 text-success border-success/20" },
  unverified: { label: "Chưa xác thực", className: "bg-muted text-muted-foreground border-border" },
  passed: { label: "Đạt", className: "bg-success/10 text-success border-success/20" },
  failed: { label: "Không đạt", className: "bg-destructive/10 text-destructive border-destructive/20" },
}

interface StatusBadgeProps {
  status: StatusType | string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    className: "bg-muted text-muted-foreground",
  }

  return (
    <Badge variant="outline" className={cn("font-medium", config.className, className)}>
      {config.label}
    </Badge>
  )
}
