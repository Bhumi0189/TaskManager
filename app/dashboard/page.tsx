"use client"

import React, { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckSquare, Clock, AlertCircle } from "lucide-react"

interface TaskStats {
  total: number
  completed: number
  pending: number
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/tasks")
        if (response.ok) {
          const data = await response.json()
          const tasks = data.tasks || []
          setStats({
            total: tasks.length,
            completed: tasks.filter((t: any) => t.status === "Completed").length,
            pending: tasks.filter((t: any) => t.status === "Pending").length,
          })
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err)
      } finally {
        setIsLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchStats()
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const statConfig = [
    {
      title: "Total Tasks",
      value: stats.total,
      icon: CheckSquare,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "In Progress",
      value: stats.pending,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckSquare,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      title: "Overdue",
      value: 0,
      icon: AlertCircle,
      color: "text-red-400",
      bg: "bg-red-400/10",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">Here's what's happening with your tasks today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statConfig.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <div className={`${stat.bg} p-2 rounded-lg`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-8 w-16 bg-muted" />
                ) : (
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest task updates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4 bg-muted" />
                  <Skeleton className="h-3 w-1/2 bg-muted" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {[
                {
                  activity: "You have " + stats.completed + " completed tasks",
                  time: "Updated now",
                },
                { activity: "You have " + stats.pending + " pending tasks", time: "Updated now" },
                {
                  activity: "Total tasks in system: " + stats.total,
                  time: "Updated now",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                  <div className="mt-1 h-2 w-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <p className="text-sm text-foreground font-medium">{item.activity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
