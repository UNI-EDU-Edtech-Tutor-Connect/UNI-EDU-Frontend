"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector, useAppDispatch } from "@/hooks/use-redux"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { fetchNotificationsRequest } from "@/store/slices/notifications-slice"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const { sidebarOpen } = useAppSelector((state) => state.ui)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/")
    } else {
      dispatch(fetchNotificationsRequest())
    }
  }, [isAuthenticated, user, router, dispatch])

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <DashboardSidebar />
      <div className={cn("transition-all duration-300", sidebarOpen ? "ml-64" : "ml-20")}>
        <DashboardHeader />
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
