"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import HeroCarousel from "@/components/hero-carousel"

interface TenunProduct {
  id: number
  title: string
  description: string
  image_url: string
  technique?: string
  material?: string
}

interface Activity {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  event_date: string
}

export default function Home() {
  const [tenunProducts, setTenunProducts] = useState<TenunProduct[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tenunRes, activitiesRes] = await Promise.all([fetch("/api/tenun"), fetch("/api/activities")])

        if (tenunRes.ok) setTenunProducts(await tenunRes.json())
        if (activitiesRes.ok) setActivities(await activitiesRes.json())
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <HeroCarousel />

      {/* Karya Tenun Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Karya Tenun Desa Jambakan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Koleksi karya tenun tradisional yang dibuat dengan keahlian turun temurun
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenunProducts.slice(0, 6).map((product) => (
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
                  <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.technique && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{product.technique}</span>
                    )}
                    {product.material && (
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                        {product.material}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            href="/tenun"
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            Lihat Semua Karya <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Berita & Kegiatan Section */}
      <section className="bg-muted/30 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Berita & Kegiatan Desa</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Informasi terbaru tentang kegiatan senam, gotong royong, PKK, dan BUMDES
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activities.slice(0, 3).map((activity) => (
                <Link
                  key={activity.id}
                  href={`/berita/${activity.id}`}
                  className="group bg-background rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary"
                >
                  <div className="relative h-48 bg-muted overflow-hidden">
                    <img
                      src={activity.image_url || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      {activity.category}
                    </span>
                    <h3 className="font-bold text-lg mt-3 mb-2 group-hover:text-primary transition-colors">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-3">
                      {new Date(activity.event_date).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/berita"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Lihat Semua Berita <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Karawitan Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Karawitan Desa Jambakan</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Pelajari tentang seni musik tradisional Jawa yang memukau
          </p>
        </div>

        <Link
          href="/karawitan"
          className="group block bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all hover:border-primary"
        >
          <div className="md:flex items-center">
            <div className="md:w-1/3 h-80 bg-muted overflow-hidden">
              <img
                src="/traditional-gamelan-music.jpg"
                alt="Karawitan"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-8 md:w-2/3">
              <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors">
                Pelajari Karawitan Tradisional
              </h3>
              <p className="text-muted-foreground mb-6">
                Karawitan adalah istilah yang digunakan untuk menggambarkan musik gamelan Jawa. Seni tradisional ini
                merupakan bagian integral dari budaya Indonesia dan terus diwariskan dari generasi ke generasi di Desa
                Jambakan.
              </p>
              <span className="inline-flex items-center gap-2 text-primary font-semibold">
                Pelajari Selengkapnya <ArrowRight size={20} />
              </span>
            </div>
          </div>
        </Link>
      </section>
    </main>
  )
}
