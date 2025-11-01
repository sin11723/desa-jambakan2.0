import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [rows] = await connection.execute("SELECT * FROM karawitan ORDER BY created_at DESC")
    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to fetch karawitan" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, content, image_url } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute("INSERT INTO karawitan (title, description, content, image_url) VALUES (?, ?, ?, ?)", [
      title,
      description,
      content,
      image_url,
    ])

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to add karawitan content" }, { status: 500 })
  }
}
