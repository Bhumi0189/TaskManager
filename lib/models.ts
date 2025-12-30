import { getDatabase } from "./db"
import bcrypt from "bcryptjs"
import { ObjectId } from "mongodb"

// User model
export interface User {
  _id?: ObjectId
  fullName: string
  email: string
  password: string
  createdAt: Date
  updatedAt: Date
}

// Task model
export interface Task {
  _id?: ObjectId
  userId: ObjectId | string
  title: string
  description?: string
  status: "Pending" | "Completed"
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

// User operations
export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  // Check if user already exists
  const existingUser = await db.collection<User>("users").findOne({ email: userData.email })
  if (existingUser) {
    throw new Error("Email already registered")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10)

  const user: User = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<User>("users").insertOne(user)
  return result.insertedId
}

export async function getUserByEmail(email: string) {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ email })
}

export async function getUserById(id: ObjectId | string) {
  const db = await getDatabase()
  const userId = typeof id === "string" ? new ObjectId(id) : id
  return db.collection<User>("users").findOne({ _id: userId })
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword)
}

export async function updateUser(id: ObjectId | string, updates: Partial<Omit<User, "_id">>) {
  const db = await getDatabase()
  const userId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db
    .collection<User>("users")
    .updateOne({ _id: userId }, { $set: { ...updates, updatedAt: new Date() } })

  return result.modifiedCount > 0
}

// Task operations
export async function createTask(taskData: Omit<Task, "_id" | "createdAt" | "updatedAt">) {
  const db = await getDatabase()

  const task: Task = {
    ...taskData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection<Task>("tasks").insertOne(task)
  return result.insertedId
}

export async function getTasksByUserId(userId: ObjectId | string) {
  const db = await getDatabase()
  const parsedUserId = typeof userId === "string" ? new ObjectId(userId) : userId

  return db.collection<Task>("tasks").find({ userId: parsedUserId }).sort({ createdAt: -1 }).toArray()
}

export async function getTaskById(id: ObjectId | string) {
  const db = await getDatabase()
  const taskId = typeof id === "string" ? new ObjectId(id) : id
  return db.collection<Task>("tasks").findOne({ _id: taskId })
}

export async function updateTask(id: ObjectId | string, updates: Partial<Omit<Task, "_id">>) {
  const db = await getDatabase()
  const taskId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db
    .collection<Task>("tasks")
    .updateOne({ _id: taskId }, { $set: { ...updates, updatedAt: new Date() } })

  return result.modifiedCount > 0
}

export async function deleteTask(id: ObjectId | string) {
  const db = await getDatabase()
  const taskId = typeof id === "string" ? new ObjectId(id) : id

  const result = await db.collection<Task>("tasks").deleteOne({ _id: taskId })
  return result.deletedCount > 0
}

// Additional User operations
export async function getUserData(userId: string) {
  const user = await getUserById(new ObjectId(userId))
  if (!user) {
    throw new Error("User not found")
  }

  return {
    id: user._id?.toString(),
    email: user.email,
    fullName: user.fullName,
    createdAt: user.createdAt,
  }
}
