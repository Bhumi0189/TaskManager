import { verifySession } from "@/lib/session"
import { getUserData } from "@/lib/auth-server"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await verifySession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await getUserData(session.userId)
    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}
