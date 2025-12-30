// Authentication utility functions
export function saveToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function clearToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch("/api/auth/me")
    return response.ok
  } catch {
    return false
  }
}

// Simulate JWT token creation (in production, this would come from backend)
export function createMockToken(email: string): string {
  return btoa(JSON.stringify({ email, iat: Date.now() }))
}

export async function logout() {
  await fetch("/api/auth/logout", { method: "POST" })
}

export async function getCurrentUser() {
  try {
    const response = await fetch("/api/auth/me")
    if (!response.ok) return null
    const data = await response.json()
    return data.user
  } catch {
    return null
  }
}
