import { verifySession } from "./session"
import { type NextRequest, NextResponse } from "next/server"

export async function withAuth(request: NextRequest) {
  const session = await verifySession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return null // Allow the request to proceed
}

export async function withAuthRedirect(request: NextRequest) {
  const session = await verifySession()

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return null // Allow the request to proceed
}
