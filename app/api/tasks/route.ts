import { verifySession } from "@/lib/session"
import { createTask, getTasksByUserId } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const tasks = await getTasksByUserId(session.userId)
    return NextResponse.json({ tasks }, { status: 200 })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }

    // Convert userId to ObjectId
    const userId = typeof session.userId === "string" ? new ObjectId(session.userId) : session.userId

    const taskId = await createTask({
      userId: userId,
      title: body.title,
      description: body.description || "",
      status: "Pending",
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    })

    return NextResponse.json(
      {
        success: true,
        task: {
          _id: taskId,
          userId: userId,
          title: body.title,
          description: body.description || "",
          status: "Pending",
          deadline: body.deadline ? new Date(body.deadline) : undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
