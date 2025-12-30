import { clearSession } from "@/lib/session"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await clearSession()
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 })
  }
}
