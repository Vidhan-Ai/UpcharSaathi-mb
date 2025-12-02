'use client'
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import HeroSection from "@/components/HeroSection"
import FeaturesSection from "@/components/FeaturesSection"
import CTASection from "@/components/CTASection"

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="bg-light" style={{ minHeight: '100vh' }}>
      <HeroSection isLoaded={isLoaded} />
      <FeaturesSection />
      <CTASection isAuthenticated={isAuthenticated} />
    </div>
  )
}