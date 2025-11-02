import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { title, description, image_url, category } = await request.json()

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute(
      "UPDATE gallery SET title = ?, description = ?, image_url = ?, category = ? WHERE id = ?",
      [title, description, image_url, category, id]
    )

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "desa_jambakan",
    })

    await connection.execute("DELETE FROM gallery WHERE id = ?", [id])

    await connection.end()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}