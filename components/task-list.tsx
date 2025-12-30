"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TaskCreateModal } from "./task-create-modal"
import { CheckCircle2, Circle, Edit2, Trash2, Search, RefreshCw, AlertCircle, Clock, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"

interface Task {
  _id: string
  title: string
  description?: string
  status: "Pending" | "Completed"
  deadline?: string
  createdAt: string
}

// Helper function to check if task is overdue
function isTaskOverdue(deadline?: string, status?: string): boolean {
  if (!deadline || status === "Completed") return false
  const deadlineDate = new Date(deadline)
  const now = new Date()
  return deadlineDate < now
}

// Helper function to format deadline
function formatDeadline(deadline?: string): string {
  if (!deadline) return ""
  const date = new Date(deadline)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string | null>("all")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [editDeadline, setEditDeadline] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const fetchTasks = useCallback(async () => {
    try {
      setIsSyncing(true)
      const response = await fetch("/api/tasks")
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to fetch tasks")
      }
      const data = await response.json()
      console.log("Tasks fetched:", data.tasks)
      setTasks(data.tasks || [])
      setError("")
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load tasks"
      console.error("Error fetching tasks:", errorMsg)
      setError(errorMsg)
    } finally {
      setIsSyncing(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
    setIsLoading(false)
  }, [fetchTasks])

  // Auto-refresh every 5 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks()
    }, 5000)

    return () => clearInterval(interval)
  }, [fetchTasks])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus = !statusFilter || statusFilter === "all" || task.status === statusFilter
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
      return matchesStatus && matchesSearch
    })
  }, [tasks, statusFilter, searchTerm])

  const handleTaskCreate = async (title: string, description?: string, deadline?: string) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, deadline }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to create task")
      }
      const data = await response.json()
      console.log("Task created:", data.task)
      setTasks([data.task, ...tasks])
      setSuccessMessage("Task created successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
      // Refresh tasks from server to ensure data consistency
      await fetchTasks()
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to create task"
      console.error("Error creating task:", errorMsg)
      setError(errorMsg)
    }
  }

  const handleStatusToggle = async (id: string) => {
    const task = tasks.find((t) => t._id === id)
    if (!task) return

    try {
      const newStatus = task.status === "Completed" ? "Pending" : "Completed"
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update task")
      }
      const data = await response.json()
      console.log("Task updated:", data.task)
      setTasks(tasks.map((t) => (t._id === id ? data.task : t)))
      setSuccessMessage(`Task marked as ${newStatus}`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update task"
      console.error("Error updating task:", errorMsg)
      setError(errorMsg)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return

    try {
      const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to delete task")
      }
      setTasks(tasks.filter((t) => t._id !== id))
      setSuccessMessage("Task deleted successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to delete task"
      console.error("Error deleting task:", errorMsg)
      setError(errorMsg)
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description || "")
    if (task.deadline) {
      // Convert ISO string to datetime-local format
      const date = new Date(task.deadline)
      const isoString = date.toISOString()
      setEditDeadline(isoString.slice(0, 16))
    } else {
      setEditDeadline("")
    }
  }

  const handleEditSave = async (id: string) => {
    if (!editTitle.trim()) return

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: editTitle, description: editDescription, deadline: editDeadline }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update task")
      }
      const data = await response.json()
      console.log("Task updated:", data.task)
      setTasks(tasks.map((t) => (t._id === id ? data.task : t)))
      setEditingId(null)
      setEditTitle("")
      setEditDescription("")
      setEditDeadline("")
      setSuccessMessage("Task updated successfully")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to update task"
      console.error("Error updating task:", errorMsg)
      setError(errorMsg)
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditTitle("")
    setEditDescription("")
    setEditDeadline("")
  }

  const taskStats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "Completed").length,
    pending: tasks.filter((t) => t.status === "Pending").length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tasks</h1>
          <p className="text-muted-foreground mt-2">Manage and track your projects</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => fetchTasks()}
            disabled={isSyncing}
            title="Refresh tasks"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
          </Button>
          <TaskCreateModal onTaskCreate={handleTaskCreate} />
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-400">{taskStats.completed}</p>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-yellow-400">{taskStats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter || "all"} onValueChange={(value) => setStatusFilter(value || "all")}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Your Tasks</CardTitle>
          <CardDescription>{filteredTasks.length} tasks found</CardDescription>
        </CardHeader>
        <CardContent>
          {successMessage && (
            <Alert className="mb-4 bg-green-500/10 border-green-500/30">
              <AlertCircle className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">{successMessage}</AlertDescription>
            </Alert>
          )}

          {filteredTasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No tasks found. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => (
                <Card key={task._id} className="border-border bg-muted/30">
                  <CardContent className="pt-6">
                    {editingId === task._id ? (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Task Title</label>
                          <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Task title"
                            className="border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Description</label>
                          <Textarea
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            placeholder="Task description (optional)"
                            rows={3}
                            className="border-border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-foreground">Deadline (Optional)</label>
                          <Input
                            type="datetime-local"
                            value={editDeadline}
                            onChange={(e) => setEditDeadline(e.target.value)}
                            className="border-border"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleEditCancel}
                            className="border-border"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleEditSave(task._id)}
                            className="bg-primary hover:bg-primary/90"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleStatusToggle(task._id)}
                          className="flex-shrink-0 text-muted-foreground hover:text-accent transition-colors mt-1 hover:scale-110 active:scale-95"
                          title={task.status === "Completed" ? "Click to mark as Pending" : "Click to mark as Completed"}
                        >
                          {task.status === "Completed" ? (
                            <div className="flex flex-col items-center gap-1">
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                              <span className="text-xs text-green-500 font-medium">Done</span>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-1">
                              <Circle className="h-6 w-6 text-yellow-500" />
                              <span className="text-xs text-yellow-500 font-medium">Pending</span>
                            </div>
                          )}
                        </button>

                        <div className="flex-1">
                          <p
                            className={`font-semibold text-lg cursor-pointer hover:opacity-80 ${
                              task.status === "Completed"
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                            onClick={() => handleStatusToggle(task._id)}
                            title="Click to toggle status"
                          >
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground mt-2">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-2 mt-3 text-xs">
                            <span className={`px-3 py-1 rounded font-medium ${
                              task.status === "Completed"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              {task.status}
                            </span>
                            {task.deadline && (
                              <span className={`px-3 py-1 rounded font-medium flex items-center gap-1 ${
                                isTaskOverdue(task.deadline, task.status)
                                  ? "bg-red-500/20 text-red-400"
                                  : "bg-blue-500/20 text-blue-400"
                              }`}>
                                <Clock className="h-3 w-3" />
                                {isTaskOverdue(task.deadline, task.status) ? "Overdue: " : "Due: "}
                                {formatDeadline(task.deadline)}
                              </span>
                            )}
                            {isTaskOverdue(task.deadline, task.status) && (
                              <span className="px-3 py-1 rounded bg-red-500/30 text-red-300 font-semibold flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                OVERDUE
                              </span>
                            )}
                            <span className="bg-muted px-3 py-1 rounded text-muted-foreground">
                              Created: {new Date(task.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEditStart(task)}
                            className="text-muted-foreground hover:text-foreground"
                            title="Edit task"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(task._id)}
                            className="text-muted-foreground hover:text-destructive"
                            title="Delete task"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
