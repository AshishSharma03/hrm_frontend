import { type NextRequest, NextResponse } from "next/server"

const MOCK_USERS: Record<string, any> = {
  "admin@company.com": {
    id: "1",
    email: "admin@company.com",
    name: "Admin User",
    role: "admin",
    status: "active",
  },
  "recruiter@company.com": {
    id: "2",
    email: "recruiter@company.com",
    name: "Recruiter User",
    role: "recruiter",
    status: "active",
  },
  "employee@company.com": {
    id: "3",
    email: "employee@company.com",
    name: "Employee User",
    role: "employee",
    status: "active",
  },
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    let decoded
    try {
      decoded = JSON.parse(Buffer.from(token, "base64").toString())
    } catch (error) {
      console.error("Token decode error:", error)
      return NextResponse.json({ message: "Invalid token format" }, { status: 401 })
    }

    if (!decoded.email) {
      return NextResponse.json({ message: "Invalid token data" }, { status: 401 })
    }

    const user = MOCK_USERS[decoded.email]

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("[v0] Auth check error:", error)
    return NextResponse.json({ message: "Failed to fetch user", success: false }, { status: 500 })
  }
}
