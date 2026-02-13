"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/landing/header"
import { HeroSection } from "@/components/landing/hero-section"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorksSection } from "@/components/landing/how-it-works-section"
import { SubjectsSection } from "@/components/landing/subjects-section"
import { OnlineTestSection } from "@/components/landing/online-test-section"
import { TestimonialsSection } from "@/components/landing/testimonials-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { LoginModal } from "@/components/auth/login-modal"
import { RegisterModal } from "@/components/auth/register-modal"
import { useAppSelector } from "@/hooks/use-redux"

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect to appropriate dashboard based on role
      router.push(`/dashboard/${user.role}`)
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <SubjectsSection />
        <OnlineTestSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />

      {/* Auth Modals */}
      <LoginModal />
      <RegisterModal />
    </div>
  )
}
