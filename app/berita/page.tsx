"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

interface Activity {
  id: number
  title: string
  description: string
  category: string
  image_url: string
  event_date: string
  created_at: string
}

export default function BeritaPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>("All")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/activities")
        if (res.ok) setActivities(await res.json())
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const categories = ["All", ...Array.from(new Set(activities.map((a) => a.category)))]

  const filtered = selectedCategory === "All" ? activities : activities.filter((a) => a.category === selectedCategory)

  return (
    <main>
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary mb-6 hover:underline">
            <ArrowLeft size={20} /> Kembali
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold">Berita & Kegiatan Desa</h1>
          <p className="text-muted-foreground mt-4 text-lg">
            Informasi terbaru tentang kegiatan senam, gotong royong, PKK, BUMDES, dan acara desa lainnya
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

        {/* Berita List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.length > 0 ? (
              filtered.map((activity) => (
                <Link
                  key={activity.id}
                  href={`/berita/${activity.id}`}
                  className="group overflow-hidden rounded-lg border border-border hover:shadow-lg transition-all hover:border-primary bg-background"
                >
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <img
                      src={activity.image_url || "/placeholder.svg"}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {activity.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar size={14} />
                        {new Date(activity.event_date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">Tidak ada berita untuk kategori ini</p>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
