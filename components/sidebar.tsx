"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/auth"
import { LayoutDashboard, CheckSquare, User, Settings, LogOut, Menu, X } from "lucide-react"

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Tasks", icon: CheckSquare, href: "/dashboard/tasks" },
  { label: "Profile", icon: User, href: "/dashboard/profile" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} className="bg-card border-border">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } z-40 overflow-y-auto`}
      >
        <div className="p-6 space-y-8 h-full flex flex-col">
          {/* Logo */}
          <div className="pt-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-sidebar-primary p-2 rounded-lg">
                <CheckSquare className="h-6 w-6 text-sidebar-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold text-sidebar-foreground">TaskManager</h1>
            </div>
            <p className="text-xs text-muted-foreground">Task Management</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start gap-3 ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-destructive hover:text-destructive border-destructive/20 bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
