import { NextResponse } from "next/server"
import mysql from "mysql2/promise"

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "desa_jambakan",
})

export async function GET() {
  try {
    const connection = await pool.getConnection()
    const [rows] = await connection.execute("SELECT * FROM desa_profile ORDER BY id DESC LIMIT 1")
    connection.release()

    if (rows.length === 0) {
      return NextResponse.json({ error: "Profile desa tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: "Gagal mengambil data profile desa" }, { status: 500 })
  }
}
