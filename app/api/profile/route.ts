import { verifySession } from "@/lib/session"
import { getUserData, updateUser } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserData(session.userId)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const updated = await updateUser(session.userId, {
      fullName: body.fullName,
      email: body.email,
    })

    if (updated) {
      const user = await getUserData(session.userId)
      return NextResponse.json({ user }, { status: 200 })
    }

    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
