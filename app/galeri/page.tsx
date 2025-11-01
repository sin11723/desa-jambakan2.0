"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, X } from "lucide-react"

interface GalleryItem {
  id: number
  title: string
  description: string
  image_url: string
  category: string
  created_at: string
}

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/gallery")
        if (res.ok) setGallery(await res.json())
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categories = ["All", ...Array.from(new Set(gallery.map((g) => g.category)))]
  const filtered = selectedCategory === "All" ? gallery : gallery.filter((g) => g.category === selectedCategory)

  const handlePrevious = () => {
    if (!selectedImage) return
    const currentIndex = filtered.findIndex((item) => item.id === selectedImage.id)
    if (currentIndex > 0) {
      setSelectedImage(filtered[currentIndex - 1])
    }
  }

  const handleNext = () => {
    if (!selectedImage) return
    const currentIndex = filtered.findIndex((item) => item.id === selectedImage.id)
    if (currentIndex < filtered.length - 1) {
      setSelectedImage(filtered[currentIndex + 1])
    }
  }

  return (
    <main>
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
            <ArrowLeft size={20} /> Kembali
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Galeri Desa Jambakan</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Dokumentasi visual keindahan, kegiatan, dan budaya Desa Jambakan
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filter Kategori */}
        <div className="mb-10">
          <h3 className="font-semibold mb-4 text-lg">Filter Kategori</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Galeri Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 mb-12">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedImage(item)}
                  className="group relative mb-4 w-full rounded-lg overflow-hidden border border-border hover:border-primary transition-all cursor-pointer break-inside-avoid"
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-start p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                      <p className="text-xs">{item.category}</p>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Tidak ada galeri untuk kategori ini</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-screen flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-muted transition-colors"
            >
              <X size={32} />
            </button>

            {/* Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={selectedImage.image_url || "/placeholder.svg"}
                alt={selectedImage.title}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Info & Navigation */}
            <div className="mt-6 bg-background rounded-lg p-6 text-center">
              <h2 className="text-2xl font-bold mb-2">{selectedImage.title}</h2>
              <p className="text-muted-foreground mb-4">{selectedImage.description}</p>
              <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-6">
                {selectedImage.category}
              </span>

              {/* Navigation Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filtered.findIndex((item) => item.id === selectedImage.id) === 0}
                >
                  Sebelumnya
                </button>
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={filtered.findIndex((item) => item.id === selectedImage.id) === filtered.length - 1}
                >
                  Berikutnya
                </button>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                {filtered.findIndex((item) => item.id === selectedImage.id) + 1} dari {filtered.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
