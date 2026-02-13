"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { closeRegisterModal, registerRequest, openLoginModal, clearError } from "@/store/slices/auth-slice"
import { Loader2 } from "lucide-react"
import type { UserRole } from "@/types"

const roleOptions: { value: UserRole; label: string }[] = [
  { value: "student", label: "Học sinh" },
  { value: "parent", label: "Phụ huynh" },
  { value: "tutor", label: "Gia sư" },
  { value: "teacher", label: "Giáo viên" },
]

export function RegisterModal() {
  const dispatch = useAppDispatch()
  const { registerModalOpen, selectedRole, isLoading, error } = useAppSelector((state) => state.auth)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: selectedRole || ("student" as UserRole),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(registerRequest(formData))
  }

  const handleClose = () => {
    dispatch(closeRegisterModal())
    dispatch(clearError())
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      password: "",
      role: "student",
    })
  }

  return (
    <Dialog open={registerModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Đăng ký tài khoản</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="role">Bạn là</Label>
            <Select
              value={formData.role}
              onValueChange={(value: UserRole) => setFormData({ ...formData, role: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <Input
              id="fullName"
              placeholder="Nguyễn Văn A"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="0912345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={8}
            />
          </div>

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng ký
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => {
                handleClose()
                dispatch(openLoginModal())
              }}
            >
              Đăng nhập
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
