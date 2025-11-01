"use client"

import { useState, useEffect } from "react"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileSection } from "@/components/profile-section"
import { ProfileStats } from "@/components/profile-stats"
import { Target, BookOpen, Mail, Phone, MapPin } from "lucide-react"

interface DesaProfile {
  id: number
  desa_name: string
  desa_code: string
  sub_district: string
  district: string
  province: string
  description: string
  vision: string
  mission: string
  history: string
  total_population: number
  total_families: number
  village_chief_name: string
  village_chief_phone: string
  area_km2: number
  main_livelihoods: string
  contact_email: string
  contact_phone: string
  address: string
  image_url: string
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<DesaProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile")
        if (!response.ok) {
          throw new Error("Gagal mengambil data profile")
        }
        const data = await response.json()
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/60">Memuat data profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">{error || "Profile tidak ditemukan"}</p>
        </div>
      </div>
    )
  }

  const stats = [
    { label: "Kode Desa", value: profile.desa_code },
    { label: "Jumlah Keluarga", value: profile.total_families.toLocaleString("id-ID") },
    { label: "Luas Wilayah", value: `${profile.area_km2} km²` },
    { label: "Kepala Desa", value: profile.village_chief_name },
  ]

  return (
    <main className="min-h-screen bg-background pt-20 pb-20">
      <div className="mx-auto w-full max-w-5xl px-4 space-y-12">
        {/* Header Section */}
        <ProfileHeader
          desaName={profile.desa_name}
          district={profile.district}
          province={profile.province}
          imageUrl={profile.image_url}
          totalPopulation={profile.total_population}
          mainLivelihoods={profile.main_livelihoods}
        />

        {/* Stats Grid */}
        <ProfileStats stats={stats} />

        {/* Main Content Sections */}
        <div className="space-y-8">
          <ProfileSection title="Tentang Desa" content={profile.description} icon="ℹ️" />

          <ProfileSection title="Visi" content={profile.vision} icon={<Target className="h-6 w-6" />} />

          <ProfileSection title="Misi" content={profile.mission} icon={<BookOpen className="h-6 w-6" />} />

          <ProfileSection title="Sejarah Desa" content={profile.history} icon="📖" />
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border border-border bg-card p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Alamat</h3>
            <div className="flex gap-4">
              <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <p className="text-foreground/80">{profile.address}</p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-8">
            <h3 className="text-xl font-bold text-foreground mb-6">Kontak</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <a
                  href={`tel:${profile.contact_phone}`}
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  {profile.contact_phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a
                  href={`mailto:${profile.contact_email}`}
                  className="text-foreground/80 hover:text-primary transition-colors"
                >
                  {profile.contact_email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
