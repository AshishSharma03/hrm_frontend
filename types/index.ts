export type UserRole = "admin" | "recruiter" | "employee" | "candidate"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: "active" | "suspended"
  createdAt: string
}

export interface Employee extends User {
  employeeId: string
  department: string
  designation: string
  dateOfJoining: string
  salary?: number
  salaryAccountDetails?: string
}

export interface Recruiter extends User {
  recruiterCode: string
  approvalStatus: "approved" | "pending"
}

export interface AuthResponse {
  user: User
  token: string
  redirectPath: string
}

export interface LoginRequest {
  email: string
  password: string
}

// Account Configuration Types
export interface AccountConfig {
  id: string
  platform: "linkedin" | "naukri" | "indeed" | "google-drive" | "email"
  name: string
  username?: string
  apiKey?: string
  clientId?: string
  clientSecret?: string
  webhookUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Template Types
export interface DocumentTemplate {
  id: string
  name: string
  type: "offer_letter" | "certificate" | "exit_letter" | "job_posting" | "appointment" | "appointment_letter"
  content: string
  variables: string[] // placeholder variables like {{name}}, {{date}}
  isActive: boolean
  createdAt: string
  updatedAt: string
  createdBy: string
}
