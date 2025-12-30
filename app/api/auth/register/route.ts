import { createUser } from "@/lib/models"
import { createSession } from "@/lib/session"
import { validateRegister } from "@/lib/validation"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validationErrors = validateRegister(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: "Validation failed", details: validationErrors }, { status: 400 })
    }

    // Create user
    const userId = await createUser({
      fullName: body.fullName,
      email: body.email,
      password: body.password,
    })

    // Create session
    await createSession(userId.toString())

    return NextResponse.json(
      {
        success: true,
        user: {
          id: userId.toString(),
          email: body.email,
          fullName: body.fullName,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : "Registration failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
