import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-in-production")

export async function createSession(userId: string) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
    path: "/",
  })
}

export async function verifySession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("session")?.value

  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as { userId: string }
  } catch (err) {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
