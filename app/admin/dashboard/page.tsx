"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { LogOut, FileText, ImageIcon, Music, ShoppingBag } from "lucide-react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"
import AdminLogoutWarning from "@/components/AdminLogoutWarning"

interface User {
  id: number
  username: string
  email: string
}

interface DashboardStats {
  totalTenun: number
  totalActivities: number
  totalGallery: number
  totalKarawitan: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout, isAuthenticated } = useAdminAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalTenun: 0,
    totalActivities: 0,
    totalGallery: 0,
    totalKarawitan: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/admin")
      return
    }

    const fetchStats = async () => {
      try {
        const [tenun, activities, gallery, karawitan] = await Promise.all([
          fetch("/api/tenun").then((r) => r.json()),
          fetch("/api/activities").then((r) => r.json()),
          fetch("/api/gallery").then((r) => r.json()),
          fetch("/api/karawitan").then((r) => r.json()),
        ])

        setStats({
          totalTenun: tenun.length || 0,
          totalActivities: activities.length || 0,
          totalGallery: gallery.length || 0,
          totalKarawitan: karawitan.length || 0,
        })
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
      </main>
    )
  }

  const menuItems = [
    {
      title: "Kelola Tenun",
      icon: ShoppingBag,
      href: "/admin/kelola-tenun",
      count: stats.totalTenun,
      description: "Tambah, edit, atau hapus karya tenun",
    },
    {
      title: "Kelola Berita",
      icon: FileText,
      href: "/admin/kelola-berita",
      count: stats.totalActivities,
      description: "Kelola berita dan kegiatan desa",
    },
    {
      title: "Kelola Galeri",
      icon: ImageIcon,
      href: "/admin/kelola-galeri",
      count: stats.totalGallery,
      description: "Kelola foto dan dokumentasi desa",
    },
    {
      title: "Kelola Karawitan",
      icon: Music,
      href: "/admin/kelola-karawitan",
      count: stats.totalKarawitan,
      description: "Kelola konten karawitan",
    },
  ]

  return (
    <main className="min-h-screen bg-muted/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="font-bold text-xl text-primary">
            DESA JAMBAKAN - ADMIN
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              Selamat datang, <span className="font-semibold text-foreground">{user.username}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg font-medium hover:bg-destructive/90 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dashboard Admin</h1>
          <p className="text-muted-foreground text-lg">Kelola konten website Desa Jambakan</p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Tenun</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalTenun}</p>
                  </div>
                  <ShoppingBag size={32} className="text-primary opacity-50" />
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Berita</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalActivities}</p>
                  </div>
                  <FileText size={32} className="text-primary opacity-50" />
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Galeri</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalGallery}</p>
                  </div>
                  <ImageIcon size={32} className="text-primary opacity-50" />
                </div>
              </div>

              <div className="bg-background border border-border rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Karawitan</p>
                    <p className="text-3xl font-bold mt-2">{stats.totalKarawitan}</p>
                  </div>
                  <Music size={32} className="text-primary opacity-50" />
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group bg-background border border-border rounded-lg p-6 hover:shadow-lg hover:border-primary transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                        <Icon size={32} className="text-primary" />
                      </div>
                      <span className="text-2xl font-bold text-muted-foreground">{item.count}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Link>
                )
              })}
            </div>
          </>
        )}
      </div>
      <AdminLogoutWarning />
    </main>
  )
}
