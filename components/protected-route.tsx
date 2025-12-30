"use client"

import React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAuth, setIsAuth] = React.useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await isAuthenticated()
      if (!authenticated) {
        router.push("/login")
      } else {
        setIsAuth(true)
        setIsLoading(false)
      }
    }
    
    checkAuth()
  }, [router])

  if (isLoading || !isAuth) return null

  return <>{children}</>
}
