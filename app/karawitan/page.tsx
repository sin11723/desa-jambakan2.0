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

export default function KarawaitanPage() {
  const [karawitan, setKarawitan] = useState<Karawitan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/karawitan")
        if (res.ok) setKarawitan(await res.json())
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
          <h1 className="text-4xl md:text-5xl font-bold">Karawitan Desa Jambakan</h1>
          <p className="text-muted-foreground mt-4 text-lg">Pelajari tentang seni musik gamelan tradisional Jawa</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-8">
            {karawitan.map((item) => (
              <Link
                key={item.id}
                href={`/karawitan/${item.id}`}
                className="group block bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-all hover:border-primary"
              >
                <div className="md:flex">
                  <div className="md:w-1/3 h-64 md:h-auto bg-muted overflow-hidden">
                    <img
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 md:w-2/3 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <Music size={20} className="text-primary" />
                      <span className="text-sm font-semibold text-primary">Karawitan</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{item.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Dibuat pada {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </p>
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
