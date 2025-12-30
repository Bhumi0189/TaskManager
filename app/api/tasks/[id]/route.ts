import { verifySession } from "@/lib/session"
import { getTaskById, updateTask, deleteTask } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const task = await getTaskById(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ task }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch task" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const task = await getTaskById(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const updated = await updateTask(id, {
      title: body.title ?? task.title,
      status: body.status ?? task.status,
    })

    if (updated) {
      const updatedTask = await getTaskById(id)
      return NextResponse.json({ task: updatedTask }, { status: 200 })
    }

    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const task = await getTaskById(id)

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 })
    }

    if (task.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const deleted = await deleteTask(id)
    if (deleted) {
      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 })
  }
}
