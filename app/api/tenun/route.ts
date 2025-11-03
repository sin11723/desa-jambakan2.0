import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeAll = searchParams.get('includeAll') === 'true'
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    // If includeAll is true (for admin), get all items, otherwise only published
    const query = includeAll 
      ? "SELECT * FROM tenun_products ORDER BY created_at DESC"
      : "SELECT * FROM tenun_products WHERE status = 'published' ORDER BY created_at DESC"
    
    const [rows] = await connection.execute(query)
    await connection.end()

    return NextResponse.json(rows)
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to fetch tenun products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description, image_url, price, technique, material, status = 'published' } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [result]: any = await connection.execute(
      "INSERT INTO tenun_products (title, description, image_url, price, technique, material, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, description, image_url, price, technique, material, status],
    )

    await connection.end()
    return NextResponse.json({ success: true, id: result.insertId })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to add tenun product" }, { status: 500 })
  }
}
