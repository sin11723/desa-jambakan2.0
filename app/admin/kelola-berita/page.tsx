"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft, Calendar } from "lucide-react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import AdminLogoutWarning from "@/components/AdminLogoutWarning"

interface Activity {
  id: number
  title: string
  description: string
  content: string
  category: string
  image_url: string
  event_date: string
  status?: 'draft' | 'published'
}

// Fungsi untuk memformat ukuran file
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export default function KelolaBeritaPage() {
  const router = useRouter()
  const { isAuthenticated } = useAdminAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Kegiatan",
    image_url: "",
    event_date: new Date().toISOString().split("T")[0],
    status: "published" as "draft" | "published",
  })

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }
    
    fetchActivities()
  }, [isAuthenticated, router])

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities?includeAll=true")
      if (res.ok) setActivities(await res.json())
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Reset error sebelumnya
    setFileError(null)

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Tipe file tidak diizinkan. Hanya gambar (JPEG, PNG, GIF, WebP) yang diperbolehkan.')
      e.target.value = '' // Reset input
      return
    }

    // Validasi ukuran file (maksimal 2MB)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (file.size > maxSize) {
      setFileError(`Ukuran file terlalu besar. Maksimal 2MB. File Anda: ${formatFileSize(file.size)}`)
      e.target.value = '' // Reset input
      return
    }

    setSelectedFile(file)
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    
    try {
      let imageUrl = formData.image_url

      // Upload gambar jika ada file yang dipilih
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          imageUrl = uploadResult.imageUrl
        } else {
          const errorData = await uploadRes.json()
          alert(errorData.error || 'Gagal mengupload gambar')
          return
        }
      }

      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
        }),
      })

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "Kegiatan",
          image_url: "",
          event_date: new Date().toISOString().split("T")[0],
          status: "published",
        })
        setSelectedFile(null)
        setFileError(null)
        setIsFormOpen(false)
        fetchActivities()
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      alert('Terjadi kesalahan saat menyimpan berita')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus berita ini?")) return

    try {
      const res = await fetch(`/api/activities/${id}`, { method: "DELETE" })
      if (res.ok) fetchActivities()
    } catch (error) {
      console.error("[v0] Error:", error)
    }
  }

  const handleEdit = (activity: Activity) => {
    setFormData({
      title: activity.title,
      description: activity.description,
      content: activity.content,
      category: activity.category,
      image_url: activity.image_url,
      event_date: activity.event_date,
      status: activity.status || "published",
    })
    setEditingId(activity.id)
    setSelectedFile(null)
    setFileError(null)
    setIsFormOpen(true)
  }

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingId) return
    
    setIsUploading(true)
    
    try {
      let imageUrl = formData.image_url

      // Upload gambar jika ada file yang dipilih
      if (selectedFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', selectedFile)

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (uploadRes.ok) {
          const uploadResult = await uploadRes.json()
          imageUrl = uploadResult.imageUrl
        } else {
          const errorData = await uploadRes.json()
          alert(errorData.error || 'Gagal mengupload gambar')
          return
        }
      }

      const res = await fetch(`/api/activities/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image_url: imageUrl,
        }),
      })

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "Kegiatan",
          image_url: "",
          event_date: new Date().toISOString().split("T")[0],
          status: "published",
        })
        setSelectedFile(null)
        setFileError(null)
        setEditingId(null)
        setIsFormOpen(false)
        fetchActivities()
      } else {
        alert('Gagal mengupdate berita')
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      alert('Terjadi kesalahan saat mengupdate berita')
    } finally {
      setIsUploading(false)
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
              <h1 className="text-2xl font-bold">Kelola Berita & Kegiatan</h1>
              <p className="text-sm text-muted-foreground">Total: {activities.length} berita</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingId(null)
              setSelectedFile(null)
              setFileError(null)
              setFormData({
                title: "",
                description: "",
                content: "",
                category: "Kegiatan",
                image_url: "",
                event_date: new Date().toISOString().split("T")[0],
                status: "published",
              })
              setIsFormOpen(!isFormOpen)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Tambah Berita
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {isFormOpen && (
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Berita" : "Tambah Berita Baru"}
            </h2>
            <form onSubmit={editingId ? handleUpdateActivity : handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Judul Berita</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Judul berita"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Ringkasan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ringkasan singkat"
                  rows={2}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Konten Lengkap</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Konten berita lengkap"
                  rows={6}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                  >
                    <option value="Kesehatan">Senam / Kesehatan</option>
                    <option value="Gotong Royong">Gotong Royong</option>
                    <option value="PKK">PKK</option>
                    <option value="BUMDES">BUMDES</option>
                    <option value="Kegiatan">Kegiatan Umum</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Tanggal Acara</label>
                  <input
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Gambar Berita</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
                
                {/* Tampilkan pesan error jika ada */}
                {fileError && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-red-600 font-medium">{fileError}</p>
                    </div>
                  </div>
                )}
                
                {/* Tampilkan informasi file yang dipilih */}
                {selectedFile && !fileError && (
                  <p className="text-sm text-green-600 mt-1">
                    File dipilih: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  </p>
                )}
                
                {/* Informasi validasi */}
                <p className="text-xs text-muted-foreground mt-1">
                  Format yang didukung: JPEG, PNG, GIF, WebP. Maksimal 2MB.
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Status Publikasi</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as "draft" | "published" })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                >
                  <option value="published">Langsung Publish</option>
                  <option value="draft">Simpan sebagai Draft</option>
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Draft tidak akan tampil di halaman publik, hanya admin yang bisa melihat
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Mengupload...' : (editingId ? 'Update Berita' : 'Simpan Berita')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFormOpen(false)
                    setSelectedFile(null)
                    setFileError(null)
                    setEditingId(null)
                    setFormData({
                      title: "",
                      description: "",
                      content: "",
                      category: "Kegiatan",
                      image_url: "",
                      event_date: new Date().toISOString().split("T")[0],
                      status: "published",
                    })
                  }}
                  className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        {!isFormOpen && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
              </div>
            ) : (
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-12 bg-background rounded-lg border border-border">
                    <p className="text-muted-foreground">Belum ada berita. Tambahkan berita baru!</p>
                  </div>
                ) : (
                  activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                    <div className="flex gap-3 text-xs">
                      <span className={`px-2 py-1 rounded font-medium ${
                        activity.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {activity.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{activity.category}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(activity.event_date).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleEdit(activity)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors" 
                      title="Edit"
                    >
                      <Edit2 size={20} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 size={20} className="text-destructive" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
          </>
        )}
      </div>
      <AdminLogoutWarning />
    </main>
  )
}
