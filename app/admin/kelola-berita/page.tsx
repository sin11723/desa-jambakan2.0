"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft, Calendar } from "lucide-react"

interface Activity {
  id: number
  title: string
  description: string
  content: string
  category: string
  image_url: string
  event_date: string
}

export default function KelolaBeritaPage() {
  const router = useRouter()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Kegiatan",
    image_url: "",
    event_date: new Date().toISOString().split("T")[0],
  })

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (!user) router.push("/admin")

    fetchActivities()
  }, [router])

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/activities")
      if (res.ok) setActivities(await res.json())
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          content: "",
          category: "Kegiatan",
          image_url: "",
          event_date: new Date().toISOString().split("T")[0],
        })
        setIsFormOpen(false)
        fetchActivities()
      }
    } catch (error) {
      console.error("[v0] Error:", error)
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
            onClick={() => setIsFormOpen(!isFormOpen)}
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
            <h2 className="text-xl font-bold mb-4">Tambah Berita Baru</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
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
                <label className="block text-sm font-semibold mb-2">URL Gambar</label>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Simpan Berita
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="flex-1 px-4 py-2 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
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
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded">{activity.category}</span>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(activity.event_date).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
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
      </div>
    </main>
  )
}
