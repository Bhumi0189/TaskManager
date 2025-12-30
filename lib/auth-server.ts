import { getUserByEmail, verifyPassword, getUserData } from "./models"

export async function authenticateUser(email: string, password: string) {
  const user = await getUserByEmail(email)
  if (!user) {
    throw new Error("Invalid email or password")
  }

  const passwordValid = await verifyPassword(password, user.password)
  if (!passwordValid) {
    throw new Error("Invalid email or password")
  }

  return {
    id: user._id?.toString(),
    email: user.email,
    fullName: user.fullName,
  }
}

export { getUserData }
