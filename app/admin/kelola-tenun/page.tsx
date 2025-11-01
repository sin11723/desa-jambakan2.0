"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, Edit2, Trash2, ArrowLeft } from "lucide-react"

interface TenunProduct {
  id: number
  title: string
  description: string
  image_url: string
  technique?: string
  material?: string
  price?: number
  status?: 'draft' | 'published'
}

export default function KelolaTenunPage() {
  const router = useRouter()
  const [products, setProducts] = useState<TenunProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    technique: "",
    material: "",
    price: 0,
    status: "published" as "draft" | "published",
  })
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("adminUser")
    if (!user) router.push("/admin")

    fetchProducts()
  }, [router])

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/tenun?includeAll=true")
      if (res.ok) setProducts(await res.json())
    } catch (error) {
      console.error("[v0] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi form
    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Judul dan deskripsi harus diisi!")
      return
    }
    
    try {
      const res = await fetch("/api/tenun", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        const result = await res.json()
        console.log("Product created successfully:", result)
        setFormData({
          title: "",
          description: "",
          image_url: "",
          technique: "",
          material: "",
          price: 0,
          status: "published",
        })
        setIsFormOpen(false)
        fetchProducts()
      } else {
        const errorData = await res.json()
        console.error("Failed to create product:", errorData)
        alert("Gagal menyimpan produk. Silakan coba lagi.")
      }
    } catch (error) {
      console.error("[v0] Error:", error)
      alert("Terjadi kesalahan. Silakan coba lagi.")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return

    try {
      const res = await fetch(`/api/tenun/${id}`, { method: "DELETE" })
      if (res.ok) fetchProducts()
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
              <h1 className="text-2xl font-bold">Kelola Karya Tenun</h1>
              <p className="text-sm text-muted-foreground">Total: {products.length} karya</p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Tambah Karya
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form */}
        {isFormOpen && (
          <div className="bg-background border border-border rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Tambah Karya Tenun Baru</h2>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Judul Karya</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Nama karya tenun"
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Deskripsi</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsi lengkap karya"
                  rows={4}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Teknik</label>
                  <input
                    type="text"
                    value={formData.technique}
                    onChange={(e) => setFormData({ ...formData, technique: e.target.value })}
                    placeholder="Mis: Tangan"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Bahan</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Mis: Benang Katun"
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

              <div>
                <label className="block text-sm font-semibold mb-2">Harga (opsional)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number.parseInt(e.target.value) : 0 })}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                />
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
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  Simpan Karya
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

        {/* Products List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-12 bg-background rounded-lg border border-border">
                <p className="text-muted-foreground">Belum ada karya tenun. Tambahkan karya baru!</p>
              </div>
            ) : (
              products.map((product) => (
                <div
                  key={product.id}
                  className="bg-background border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{product.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{product.description.substring(0, 100)}...</p>
                    <div className="flex gap-3 text-xs">
                      <span className={`px-2 py-1 rounded font-medium ${
                        product.status === 'draft' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {product.status === 'draft' ? 'Draft' : 'Published'}
                      </span>
                      {product.technique && (
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                          Teknik: {product.technique}
                        </span>
                      )}
                      {product.material && (
                        <span className="bg-secondary/10 text-secondary px-2 py-1 rounded">
                          Bahan: {product.material}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                      <Edit2 size={20} className="text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
