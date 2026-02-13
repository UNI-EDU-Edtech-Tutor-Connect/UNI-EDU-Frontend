"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppDispatch, useAppSelector } from "@/hooks/use-redux"
import { closeLoginModal, loginRequest, openRegisterModal, clearError } from "@/store/slices/auth-slice"
import { Loader2 } from "lucide-react"

export function LoginModal() {
  const dispatch = useAppDispatch()
  const { loginModalOpen, isLoading, error } = useAppSelector((state) => state.auth)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch(loginRequest({ email, password }))
  }

  const handleClose = () => {
    dispatch(closeLoginModal())
    dispatch(clearError())
    setEmail("")
    setPassword("")
  }

  return (
    <Dialog open={loginModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Đăng nhập</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Đăng nhập
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Chưa có tài khoản?{" "}
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => {
                handleClose()
                dispatch(openRegisterModal(null))
              }}
            >
              Đăng ký ngay
            </button>
          </p>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Demo nhanh</span>
            </div>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Sử dụng email chứa: admin, tutor, teacher, student, parent để đăng nhập demo
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}
