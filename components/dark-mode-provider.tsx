"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface DarkModeContextType {
  isDark: boolean
  toggleDarkMode: () => void
}

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined)

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for saved preference or system preference
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      setIsDark(saved === "true")
    } else {
      setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    localStorage.setItem("darkMode", isDark.toString())
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark, mounted])

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev)
  }

  if (!mounted) {
    return <>{children}</>
  }

  return <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>{children}</DarkModeContext.Provider>
}

export function useDarkMode() {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error("useDarkMode must be used within DarkModeProvider")
  }
  return context
}
