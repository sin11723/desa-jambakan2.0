"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  description: string
  image_url: string
  category: string
}

export default function KelolaGaleriPage() {
  const router = useRouter()
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "Tenun",
  })

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (!user) router.push("/admin")

    fetchGallery()
  }, [router])

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery")
      if (res.ok) setGallery(await res.json())
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload file')
    }
    
    const data = await response.json()
    return data.imageUrl
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingId(item.id)
    setFormData({
      title: item.title,
      description: item.description,
      image_url: item.image_url,
      category: item.category,
    })
    setSelectedFile(null)
    setIsFormOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image_url: "",
      category: "Tenun",
    })
    setSelectedFile(null)
    setEditingId(null)
    setIsFormOpen(false)
  }

  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      let imageUrl = formData.image_url

      // Upload file if selected
      if (selectedFile) {
        imageUrl = await uploadFile(selectedFile)
      }

      const dataToSend = {
        ...formData,
        image_url: imageUrl,
      }

      if (editingId) {
        // Update existing gallery item
        const res = await fetch(`/api/gallery/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        })

        if (res.ok) {
          resetForm()
          fetchGallery()
        }
      } else {
        // Add new gallery item
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        })

        if (res.ok) {
          resetForm()
          fetchGallery()
        }
      }
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus gambar ini?")) return

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (res.ok) fetchGallery()
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-primary hover:text-primary/80 transition-colors">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Kelola Galeri</h1>
              <p className="text-sm text-muted-foreground">Total: {gallery.length} foto</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (isFormOpen) {
                resetForm()
              } else {
                setIsFormOpen(true)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            {isFormOpen ? 'Batal' : 'Tambah Foto'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {isFormOpen && (
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Foto Galeri' : 'Tambah Foto ke Galeri'}
            </h2>
            <form onSubmit={handleAddGallery} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Judul Foto</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul foto"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi foto"
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                >
                  <option value="Tenun">Tenun</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Budaya">Budaya</option>
                  <option value="Dokumentasi">Dokumentasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Upload Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-2">
                    File terpilih: {selectedFile.name}
                  </p>
                )}
                {editingId && formData.image_url && !selectedFile && (
                  <div className="mt-2">
                    <p className="text-sm text-muted-foreground mb-2">Gambar saat ini:</p>
                    <img 
                      src={formData.image_url} 
                      alt="Current" 
                      className="w-32 h-32 object-cover rounded-lg border border-border"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  {editingId ? 'Update Foto' : 'Simpan Foto'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery List */}
        {!isFormOpen && (
          loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
              {gallery.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-background rounded-lg border border-border">
                  <p className="text-muted-foreground">Belum ada foto di galeri. Tambahkan foto baru!</p>
                </div>
              ) : (
                gallery.map((item) => (
                  <div
                    key={item.id}
                    className="mb-6 bg-background border border-border rounded-lg overflow-hidden break-inside-avoid group hover:border-primary transition-all"
                  >
                    <div className="relative h-40 bg-muted overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                      <p className="text-xs text-muted-foreground mb-3">{item.description}</p>
                      <span className="inline-block text-xs bg-primary/10 text-primary px-2 py-1 rounded mb-3">
                        {item.category}
                      </span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="flex-1 p-2 hover:bg-muted rounded transition-colors text-xs font-medium text-primary"
                        >
                          <Edit2 size={16} className="mx-auto" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="flex-1 p-2 hover:bg-destructive/10 rounded transition-colors text-xs font-medium text-destructive"
                        >
                          <Trash2 size={16} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )
        )}
      </div>
    </main>
  )
}
