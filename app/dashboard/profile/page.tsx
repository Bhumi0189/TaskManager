"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { validateName, validateEmail } from "@/lib/validation"
import { User, Mail, CheckCircle } from "lucide-react"

interface UserProfile {
  id: string
  fullName: string
  email: string
  createdAt: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editData, setEditData] = useState<UserProfile | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/profile")
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfile(data.user)
        setEditData(data.user)
      } catch (err) {
        console.error("Failed to load profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return
    const { name, value } = e.target
    setEditData((prev) => (prev ? { ...prev, [name]: value } : null))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSave = async () => {
    if (!editData) return

    setErrors({})
    const newErrors: Record<string, string> = {}

    if (!validateName(editData.fullName)) {
      newErrors.fullName = "Full name must be at least 2 characters"
    }

    if (!validateEmail(editData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: editData.fullName,
          email: editData.email,
        }),
      })

      if (!response.ok) throw new Error("Failed to update profile")

      const data = await response.json()
      setProfile(data.user)
      setIsSaving(false)
      setIsEditing(false)
      setShowSuccess(true)

      setTimeout(() => setShowSuccess(false), 3000)
    } catch (err) {
      setErrors({ submit: "Failed to save profile" })
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="h-96 bg-muted rounded animate-pulse" />
  }

  if (!profile || !editData) {
    return <div className="text-center text-muted-foreground">Failed to load profile</div>
  }

  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")

  const joinDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="max-w-2xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your account information</p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <Alert className="bg-green-400/10 border-green-400/20">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">Profile updated successfully!</AlertDescription>
        </Alert>
      )}

      {/* Profile Card */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>User Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 bg-primary text-primary-foreground">
              <AvatarFallback className="text-2xl font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member since</p>
              <p className="text-lg font-semibold text-foreground">{joinDate}</p>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={editData.fullName}
                    onChange={handleEditChange}
                    placeholder="Enter your full name"
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName}</p>}
                </>
              ) : (
                <div className="px-3 py-2 rounded-md bg-card border border-border text-foreground">
                  {profile.fullName}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </label>
              {isEditing ? (
                <>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={editData.email}
                    onChange={handleEditChange}
                    placeholder="Enter your email"
                    className={errors.email ? "border-destructive" : ""}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </>
              ) : (
                <div className="px-3 py-2 rounded-md bg-card border border-border text-foreground">{profile.email}</div>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isSaving}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage your security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Password</p>
              <p className="text-sm text-muted-foreground">Change your password</p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border">
            <div>
              <p className="font-medium text-foreground">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add extra security to your account</p>
            </div>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
