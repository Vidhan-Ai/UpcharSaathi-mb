'use client'
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import Dashboard from "@/components/Dashboard"
import LandingPage from "@/components/LandingPage"

export default function Home() {
  const { isAuthenticated, user } = useAuth()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (isAuthenticated) {
    return <Dashboard user={user} />
  }

  return <LandingPage />
}