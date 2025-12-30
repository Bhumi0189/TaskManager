import { authenticateUser } from "@/lib/auth-server"
import { createSession } from "@/lib/session"
import { validateLogin } from "@/lib/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationErrors = validateLogin(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    // Authenticate user
    const user = await authenticateUser(body.email, body.password)

    // Create session
    await createSession(user.id!)

    return NextResponse.json(
      {
        success: true,
        user,
      },
      { status: 200 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed"
    return NextResponse.json({ error: message }, { status: 401 })
  }
}
