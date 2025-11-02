import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { existsSync, mkdirSync } from "fs"

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // Validasi tipe file - hanya gambar yang diizinkan
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipe file tidak diizinkan. Hanya gambar (JPEG, PNG, GIF, WebP) yang diperbolehkan." 
      }, { status: 400 })
    }

    // Validasi ukuran file - maksimal 2MB
    const maxSize = 2 * 1024 * 1024 // 2MB dalam bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "Ukuran file terlalu besar. Maksimal 2MB." 
      }, { status: 400 })
    }

    // Buat nama file unik dengan timestamp
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `tenun_${timestamp}.${fileExtension}`

    // Pastikan folder uploads ada
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true })
    }

    // Konversi file ke bytes dan simpan
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filePath = join(uploadDir, fileName)
    
    await writeFile(filePath, buffer)

    // Return URL relatif untuk disimpan di database
    const imageUrl = `/uploads/${fileName}`

    return NextResponse.json({ 
      success: true, 
      imageUrl: imageUrl,
      fileName: fileName 
    })

  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ 
      error: "Gagal mengupload gambar" 
    }, { status: 500 })
  }
}