"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface TaskCreateModalProps {
  onTaskCreate: (title: string, description?: string, deadline?: string) => Promise<void>
}

export function TaskCreateModal({ onTaskCreate }: TaskCreateModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)
    setError("")

    try {
      await onTaskCreate(title, description, deadline)
      setTitle("")
      setDescription("")
      setDeadline("")
      setOpen(false)
    } catch (err) {
      setError("Failed to create task")
    } finally {
      setIsLoading(false)
    }
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </DialogTrigger>
      <DialogContent className="border-border bg-card">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>Add a new task with optional deadline</DialogDescription>
        </DialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              Task Title *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              disabled={isLoading}
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              Description (Optional)
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
              disabled={isLoading}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="deadline" className="text-sm font-medium text-foreground">
              Deadline (Optional)
            </label>
            <Input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={isLoading}
              min={today}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()} className="bg-primary hover:bg-primary/90">
              {isLoading ? "Creating..." : "Create Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
