"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Bell, Shield, Palette } from "lucide-react"

interface SettingItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  enabled: boolean
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingItem[]>([
    {
      id: "notifications",
      title: "Email Notifications",
      description: "Receive email updates about your tasks",
      icon: <Bell className="h-5 w-5" />,
      enabled: true,
    },
    {
      id: "privacy",
      title: "Private Profile",
      description: "Hide your profile from other users",
      icon: <Shield className="h-5 w-5" />,
      enabled: false,
    },
    {
      id: "theme",
      title: "Dark Mode",
      description: "Use dark theme by default",
      icon: <Palette className="h-5 w-5" />,
      enabled: true,
    },
  ])

  const handleToggle = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) => (setting.id === id ? { ...setting, enabled: !setting.enabled } : setting)),
    )
  }

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your TaskManager experience</p>
      </div>

      {/* Preferences */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Control your account preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1 text-accent">{setting.icon}</div>
                <div>
                  <p className="font-medium text-foreground">{setting.title}</p>
                  <p className="text-sm text-muted-foreground">{setting.description}</p>
                </div>
              </div>
              <Switch checked={setting.enabled} onCheckedChange={() => handleToggle(setting.id)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/20 bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full border-destructive/20 text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Delete Account
          </Button>
          <p className="text-xs text-muted-foreground">
            Once you delete your account, there is no going back. Please be certain.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
