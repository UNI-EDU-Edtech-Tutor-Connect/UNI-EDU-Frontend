"use client"

import type React from "react"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown, GraduationCap, Users, BookOpen, TestTube } from "lucide-react"
import { useAppDispatch } from "@/hooks/use-redux"
import { openLoginModal, openRegisterModal, demoLogin } from "@/store/slices/auth-slice"
import type { UserRole } from "@/types"

const demoRoles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
  { role: "admin", label: "Admin", icon: <Users className="w-4 h-4" /> },
  { role: "tutor", label: "Gia sư", icon: <GraduationCap className="w-4 h-4" /> },
  { role: "teacher", label: "Giáo viên", icon: <BookOpen className="w-4 h-4" /> },
  { role: "student", label: "Học sinh", icon: <GraduationCap className="w-4 h-4" /> },
  { role: "parent", label: "Phụ huynh", icon: <Users className="w-4 h-4" /> },
  { role: "accountant", label: "Kế toán", icon: <Users className="w-4 h-4" /> },
  { role: "office", label: "Văn phòng", icon: <Users className="w-4 h-4" /> },
  { role: "test_manager", label: "Quản lý đề thi", icon: <TestTube className="w-4 h-4" /> },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const dispatch = useAppDispatch()

  const handleDemoLogin = (role: UserRole) => {
    dispatch(demoLogin(role))
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">EduConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="#features"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Tính năng
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Cách hoạt động
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Bảng giá
          </Link>
          <Link
            href="#tests"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Thi thử online
          </Link>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Demo Login Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Demo <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {demoRoles.map((item) => (
                <DropdownMenuItem key={item.role} onClick={() => handleDemoLogin(item.role)} className="cursor-pointer">
                  {item.icon}
                  <span className="ml-2">{item.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" size="sm" onClick={() => dispatch(openLoginModal())}>
            Đăng nhập
          </Button>
          <Button
            size="sm"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => dispatch(openRegisterModal(null))}
          >
            Đăng ký ngay
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="#features" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Tính năng
            </Link>
            <Link href="#how-it-works" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Cách hoạt động
            </Link>
            <Link href="#pricing" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Bảng giá
            </Link>
            <Link href="#tests" className="text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Thi thử online
            </Link>
            <hr className="border-border" />
            <div className="flex flex-col gap-2">
              <Button variant="outline" onClick={() => dispatch(openLoginModal())}>
                Đăng nhập
              </Button>
              <Button className="bg-accent hover:bg-accent/90" onClick={() => dispatch(openRegisterModal(null))}>
                Đăng ký ngay
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
