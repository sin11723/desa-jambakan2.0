import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [rows]: any = await connection.execute("SELECT * FROM activities WHERE id = ?", [id])

    await connection.end()

    if (rows.length === 0) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, content, category, image_url, event_date } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    const [result]: any = await connection.execute(
      "UPDATE activities SET title = ?, description = ?, content = ?, category = ?, image_url = ?, event_date = ? WHERE id = ?",
      [title, description, content, category, image_url, event_date, id]
    )

    await connection.end()

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Activity not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Activity updated successfully" })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 })
  }
}
