// Form validation utilities

export interface ValidationError {
  field: string
  message: string
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function validatePassword(password: string): boolean {
  return password.length >= 6
}

export function validateName(name: string): boolean {
  return name.trim().length >= 2
}

export function validateRegister(data: {
  fullName: string
  email: string
  password: string
  confirmPassword: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!validateName(data.fullName)) {
    errors.push({ field: "fullName", message: "Full name must be at least 2 characters" })
  }

  if (!validateEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email" })
  }

  if (!validatePassword(data.password)) {
    errors.push({ field: "password", message: "Password must be at least 6 characters" })
  }

  if (data.password !== data.confirmPassword) {
    errors.push({ field: "confirmPassword", message: "Passwords do not match" })
  }

  return errors
}

export function validateLogin(data: {
  email: string
  password: string
}): ValidationError[] {
  const errors: ValidationError[] = []

  if (!validateEmail(data.email)) {
    errors.push({ field: "email", message: "Please enter a valid email" })
  }

  if (!validatePassword(data.password)) {
    errors.push({ field: "password", message: "Password is required" })
  }

  return errors
}
