"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux"
import { Bell, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const { user } = useAppSelector((state) => state.auth)
  const { notifications, unreadCount } = useAppSelector((state) => state.notifications)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background px-6">
      {/* Left side - Welcome text */}
      <div>
        <p className="text-sm text-muted-foreground">
          Chào mừng trở lại, <span className="font-medium text-foreground">{user?.fullName || "Người dùng"}</span>
        </p>
      </div>

      {/* Right side - Notifications + User */}
      <div className="flex items-center gap-2">
        {/* Notifications - Simple bell with count */}
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
              {unreadCount}
            </span>
          )}
        </Button>

        {/* User Avatar + Name (no dropdown) */}
        <div className="flex items-center gap-2 ml-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            {user?.avatar ? (
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user?.fullName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-primary">{user?.fullName?.charAt(0)}</span>
            )}
          </div>
          <span className="hidden md:flex items-center gap-1 text-sm font-medium">
            {user?.fullName}
            {user?.role === "teacher" && (
              <span title="Giáo viên đã kiểm định Bằng Đại học">
                <ShieldCheck className="h-4 w-4 text-amber-500 fill-amber-100" />
              </span>
            )}
          </span>
        </div>
      </div>
    </header>
  )
}
