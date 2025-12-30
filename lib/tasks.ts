// Task management utilities

export interface Task {
  id: string
  title: string
  status: "Pending" | "Completed"
  createdAt: string
}

// Mock database (in production, this would be real API calls)
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Design Homepage",
    status: "Completed",
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    title: "Setup Database",
    status: "Pending",
    createdAt: "2024-01-12",
  },
  {
    id: "3",
    title: "API Integration",
    status: "Pending",
    createdAt: "2024-01-14",
  },
  {
    id: "4",
    title: "User Authentication",
    status: "Completed",
    createdAt: "2024-01-08",
  },
  {
    id: "5",
    title: "Testing and QA",
    status: "Pending",
    createdAt: "2024-01-16",
  },
]

export function getTasks(): Task[] {
  return mockTasks
}

export function addTask(title: string): Task {
  const newTask: Task = {
    id: Date.now().toString(),
    title,
    status: "Pending",
    createdAt: new Date().toISOString().split("T")[0],
  }
  mockTasks.push(newTask)
  return newTask
}

export function updateTask(id: string, updates: Partial<Task>): Task | null {
  const taskIndex = mockTasks.findIndex((t) => t.id === id)
  if (taskIndex === -1) return null

  mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates }
  return mockTasks[taskIndex]
}

export function deleteTask(id: string): boolean {
  const index = mockTasks.findIndex((t) => t.id === id)
  if (index === -1) return false
  mockTasks.splice(index, 1)
  return true
}

export function filterTasks(tasks: Task[], status: string | null, searchTerm: string): Task[] {
  return tasks.filter((task) => {
    const matchesStatus = !status || task.status === status
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })
}
