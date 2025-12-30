"use client"

import { useState, useEffect } from "react"
import { Bell, Moon, Sun, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { logout } from "@/lib/auth"

interface NavbarProps {
  userName?: string
  userEmail?: string
}

export function Navbar({ userName = "User", userEmail = "user@example.com" }: NavbarProps) {
  const [isDark, setIsDark] = useState(true)
  const [displayName, setDisplayName] = useState(userName)
  const [displayEmail, setDisplayEmail] = useState(userEmail)
  const router = useRouter()

  useEffect(() => {
    // Update display name and email from props
    setDisplayName(userName)
    setDisplayEmail(userEmail)
  }, [userName, userEmail])

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark", !isDark)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <nav className="bg-card border-b border-border h-16 flex items-center justify-between px-6 ml-0 lg:ml-64">
      {/* Left section - Title */}
      <div className="hidden sm:block">
        <h2 className="text-lg font-semibold text-foreground">Dashboard</h2>
      </div>

      {/* Right section - Icons and user menu */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-accent rounded-full" />
        </Button>

        {/* Dark Mode Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground">
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-3 pl-2 pr-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                  {displayName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-foreground">{displayName}</p>
                <p className="text-xs text-muted-foreground">{displayEmail}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">{displayName}</p>
              <p className="text-xs text-muted-foreground">{displayEmail}</p>
            </div>
            <DropdownMenuSeparator />
            <Link href="/dashboard/profile">
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="h-4 w-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
