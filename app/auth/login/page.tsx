"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { loginRequest, demoLogin } from "@/store/slices/auth-slice"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GraduationCap, Loader2 } from "lucide-react"
import Link from "next/link"
import type { UserRole } from "@/types"

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { isAuthenticated, user, isLoading, error } = useAppSelector((state) => state.auth)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Redirect when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectMap: Record<UserRole, string> = {
        admin: "/dashboard/admin",
        tutor: "/dashboard/tutor",
        teacher: "/dashboard/teacher",
        student: "/dashboard/student",
        parent: "/dashboard/parent",
        accountant: "/dashboard/accountant",
        office: "/dashboard/office",
        test_manager: "/dashboard/test-manager",
        test_user: "/dashboard/student", // Fallback
      }

      const path = redirectMap[user.role] || "/dashboard/student"
      router.push(path)
    }
  }, [isAuthenticated, user, router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginRequest({ email, password }))
  }

  const handleDemoLogin = (role: UserRole) => {
    dispatch(demoLogin(role))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-4">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">EduConnect</span>
          </Link>
          <CardTitle>Đăng nhập</CardTitle>
          <CardDescription>Đăng nhập để truy cập hệ thống quản lý học tập</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Đăng nhập</TabsTrigger>
              <TabsTrigger value="demo">Demo nhanh</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Đăng nhập
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                <span className="text-muted-foreground">Chưa có tài khoản? </span>
                <Link href="/auth/register" className="text-primary hover:underline">
                  Đăng ký ngay
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="demo">
              <p className="text-sm text-muted-foreground mb-4 text-center">
                Chọn vai trò để trải nghiệm nhanh hệ thống
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("admin")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Admin</span>
                  <span className="text-xs text-muted-foreground">Quản trị hệ thống</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("tutor")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Gia sư</span>
                  <span className="text-xs text-muted-foreground">Dạy học cá nhân</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("teacher")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Giáo viên</span>
                  <span className="text-xs text-muted-foreground">Dạy từ trung tâm</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("student")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Học sinh</span>
                  <span className="text-xs text-muted-foreground">Học và làm bài</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("parent")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Phụ huynh</span>
                  <span className="text-xs text-muted-foreground">Theo dõi con em</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("accountant")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Kế toán</span>
                  <span className="text-xs text-muted-foreground">Quản lý tài chính</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("office")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Văn phòng</span>
                  <span className="text-xs text-muted-foreground">Điều hành</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-3 flex-col bg-transparent"
                  onClick={() => handleDemoLogin("test_manager")}
                  disabled={isLoading}
                >
                  <span className="font-semibold">Quản lý đề</span>
                  <span className="text-xs text-muted-foreground">Tạo bài kiểm tra</span>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
