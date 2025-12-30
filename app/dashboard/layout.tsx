"use client"

import type React from "react"
import { useState, useEffect } from "react"

import { Sidebar } from "@/components/sidebar"
import { Navbar } from "@/components/navbar"
import { ProtectedRoute } from "@/components/protected-route"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userName, setUserName] = useState("User")
  const [userEmail, setUserEmail] = useState("user@example.com")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUserName(data.user.fullName)
          setUserEmail(data.user.email)
        }
      } catch (err) {
        console.error("Failed to fetch user:", err)
      }
    }

    fetchUser()
  }, [])

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col lg:ml-64">
          <Navbar userName={userName} userEmail={userEmail} />
          <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
