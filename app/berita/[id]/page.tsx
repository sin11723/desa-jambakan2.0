"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react"

interface Activity {
  id: number
  title: string
  description: string
  content: string
  category: string
  image_url: string
  event_date: string
  created_at: string
}

export default function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [activity, setActivity] = useState<Activity | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/activities/${id}`)
        if (res.ok) {
          setActivity(await res.json())
        }
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

  if (!activity) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Berita tidak ditemukan</h1>
          <Link href="/berita" className="text-primary hover:underline">
            Kembali ke Berita
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/berita" className="inline-flex items-center gap-2 text-primary mb-8 hover:underline">
          <ArrowLeft size={20} /> Kembali ke Berita
        </Link>

        {/* Hero Image */}
        <div className="rounded-lg overflow-hidden border border-border mb-12 h-96">
          <img
            src={activity.image_url || "/placeholder.svg"}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-primary" />
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
              {activity.category}
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={20} />
            <span className="font-medium">
              {new Date(activity.event_date).toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <button className="ml-auto flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors">
            <Share2 size={20} />
            Bagikan
          </button>
        </div>

        {/* Konten */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-6">{activity.title}</h1>

          <div className="bg-primary/10 p-6 rounded-lg mb-8">
            <p className="text-lg text-primary font-semibold leading-relaxed">{activity.description}</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <div className="text-muted-foreground space-y-6">
              {activity.content.split("\n").map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="bg-muted/30 p-6 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Dipublikasikan pada{" "}
            {new Date(activity.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </section>
    </main>
  )
}
