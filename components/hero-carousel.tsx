"use client"

import { useEffect, useState } from "react"

interface HeroSlide {
  id: number
  image_url: string
  title?: string
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/gallery?limit=5")
        if (res.ok) {
          const data = await res.json()
          if (data.length > 0) {
            setSlides(data)
          } else {
            // Default slides jika gallery kosong
            setSlides([
              { id: 1, image_url: "/desa-jambakan-pemandangan-1.jpg" },
              { id: 2, image_url: "/desa-jambakan-pemandangan-2.jpg" },
              { id: 3, image_url: "/desa-jambakan-pemandangan-3.jpg" },
            ])
          }
        }
      } catch (error) {
        console.error("[v0] Error fetching carousel slides:", error)
        // Fallback dengan placeholder
        setSlides([
          { id: 1, image_url: "/desa-jambakan-pemandangan-1.jpg" },
          { id: 2, image_url: "/desa-jambakan-pemandangan-2.jpg" },
          { id: 3, image_url: "/desa-jambakan-pemandangan-3.jpg" },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchSlides()
  }, [])

  useEffect(() => {
    if (slides.length === 0) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  if (loading || slides.length === 0) {
    return (
      <section className="min-h-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </section>
    )
  }

  return (
    <section className="relative min-h-[600px] overflow-hidden group">
      {/* Carousel Container */}
      <div className="relative w-full h-full min-h-[600px]">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image_url || "/placeholder.svg"}
              alt={slide.title || `Slide ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance drop-shadow-lg">
            Selamat Datang di Desa Jambakan
          </h1>
          <p className="text-xl text-white/90 mb-8 text-balance max-w-2xl mx-auto drop-shadow-md">
            Jelajahi keindahan karya tenun tradisional, warisan karawitan, dan budaya yang kaya dari Desa Jambakan
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/tenun"
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              Lihat Karya Tenun
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="/berita"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors shadow-lg"
            >
              Baca Berita
            </a>
          </div>
        </div>
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/30 hover:bg-white/50 text-white transition-all opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white w-8" : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
