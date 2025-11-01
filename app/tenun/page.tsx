"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface TenunProduct {
  id: number
  title: string
  description: string
  image_url: string
  technique?: string
  material?: string
  price?: number
}

export default function TenunPage() {
  const [products, setProducts] = useState<TenunProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/tenun")
        if (res.ok) setProducts(await res.json())
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <main>
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
            <ArrowLeft size={20} /> Kembali
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Karya Tenun Desa Jambakan</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Koleksi lengkap karya tenun tradisional buatan masyarakat Desa Jambakan
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/tenun/${product.id}`}
                className="group overflow-hidden rounded-lg border border-border hover:shadow-lg transition-all hover:border-primary"
              >
                <div className="relative h-64 bg-muted overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.technique && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                        {product.technique}
                      </span>
                    )}
                    {product.material && (
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded font-medium">
                        {product.material}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
