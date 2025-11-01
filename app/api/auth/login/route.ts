import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [rows]: any = await connection.execute("SELECT * FROM admin_users WHERE username = ?", [username])

    await connection.end()

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Simple password comparison (in production, use bcrypt)
    const user = rows[0]

    // For demo: check if password matches
    if (password === "admin123" && username === "admin") {
      return NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, email: user.email },
      })
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
