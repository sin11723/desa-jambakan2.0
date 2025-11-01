"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Music } from "lucide-react"

interface Karawitan {
  id: number
  title: string
  description: string
  content: string
  image_url: string
  created_at: string
}

export default function KarawaitanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [item, setItem] = useState<Karawitan | null>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>("")

  useEffect(() => {
    params.then((p) => setId(p.id))
  }, [params])

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/karawitan/${id}`)
        if (res.ok) {
          // For now, fetch all and find the one with the matching ID
          const allRes = await fetch("/api/karawitan")
          if (allRes.ok) {
            const all = await allRes.json()
            const found = all.find((k: Karawitan) => k.id === Number.parseInt(id))
            setItem(found || null)
          }
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

  if (!item) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Konten tidak ditemukan</h1>
          <Link href="/karawitan" className="text-primary hover:underline">
            Kembali ke Karawitan
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/karawitan" className="inline-flex items-center gap-2 text-primary mb-8 hover:underline">
          <ArrowLeft size={20} /> Kembali ke Karawitan
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <div className="sticky top-20 rounded-lg overflow-hidden border border-border">
              <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="w-full h-96 object-cover" />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Music size={24} className="text-primary" />
              <span className="text-lg font-semibold text-primary">Karawitan</span>
            </div>

            <h1 className="text-4xl font-bold mb-6">{item.title}</h1>

            <div className="bg-primary/10 p-6 rounded-lg mb-8">
              <p className="text-lg text-primary font-semibold">{item.description}</p>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-muted-foreground space-y-4">
                {item.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Terakhir diperbarui pada {new Date(item.created_at).toLocaleDateString("id-ID")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
