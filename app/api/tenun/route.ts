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

    const [rows] = await connection.execute("SELECT * FROM tenun_products ORDER BY created_at DESC")
    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to fetch tenun products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, image_url, price, technique, material } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute(
      "INSERT INTO tenun_products (title, description, image_url, price, technique, material) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description, image_url, price, technique, material],
    )

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to add tenun product" }, { status: 500 })
  }
}
