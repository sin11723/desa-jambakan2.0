"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Share2 } from "lucide-react"

interface TenunProduct {
  id: number
  title: string
  description: string
  image_url: string
  technique?: string
  material?: string
  price?: number
  created_at?: string
}

export default function TenunDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [product, setProduct] = useState<TenunProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/tenun/${id}`)
        if (res.ok) setProduct(await res.json())
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </main>
    )
  }

  if (!product) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Produk tidak ditemukan</h1>
          <Link href="/tenun" className="text-primary hover:underline">
            Kembali ke Karya Tenun
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/tenun" className="inline-flex items-center gap-2 text-primary mb-8 hover:underline">
          <ArrowLeft size={20} /> Kembali ke Karya Tenun
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Gambar */}
          <div className="flex items-center justify-center">
            <div className="relative w-full h-96 bg-muted rounded-lg overflow-hidden border border-border">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Informasi Produk */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold mb-4">{product.title}</h1>

            <div className="flex flex-wrap gap-3 mb-6">
              {product.technique && (
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-lg font-medium">
                  Teknik: {product.technique}
                </div>
              )}
              {product.material && (
                <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-lg font-medium">
                  Bahan: {product.material}
                </div>
              )}
            </div>

            {product.price && (
              <div className="mb-6 pb-6 border-b border-border">
                <p className="text-4xl font-bold text-secondary">Rp {product.price.toLocaleString("id-ID")}</p>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Deskripsi Produk</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors">
                Hubungi Pengrajin
              </button>
              <button className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2">
                <Share2 size={20} />
                Bagikan
              </button>
            </div>

            {product.created_at && (
              <p className="text-sm text-muted-foreground mt-8">
                Ditambahkan pada {new Date(product.created_at).toLocaleDateString("id-ID")}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
