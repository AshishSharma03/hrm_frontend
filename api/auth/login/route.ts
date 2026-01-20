import { type NextRequest, NextResponse } from "next/server"

// Mock user database - replace with real database
const MOCK_USERS: Record<string, any> = {
  "admin@company.com": {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    status: "active",
    password: "password123", // In production, this would be hashed
  },
  "recruiter@company.com": {
    id: "2",
    email: "recruiter@company.com",
    name: "Recruiter User",
    role: "recruiter",
    status: "active",
    password: "password123",
  },
  "employee@company.com": {
    id: "3",
    email: "employee@company.com",
    name: "Employee User",
    role: "employee",
    status: "active",
    password: "password123",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    const user = MOCK_USERS[email]

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
    }

    // In production, generate a proper JWT token
    const token = Buffer.from(JSON.stringify({ id: user.id, email: user.email, role: user.role })).toString("base64")

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      token,
    })
  } catch (error) {
    console.error("Authentication error:", error)
    return NextResponse.json({ message: "Login failed" }, { status: 500 })
  }
}
