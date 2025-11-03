"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAdminAuth } from "@/contexts/AdminAuthContext"

interface User {
  id: number
  username: string
  email: string
}

export default function AdminLoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useAdminAuth()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard")
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        setError("Username atau password salah")
        return
      }

      const data = await res.json()
      login(data.user)
      router.push("/admin/dashboard")
    } catch (err) {
      setError("Terjadi kesalahan saat login")
      console.error("[v0] Error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-2">DESA JAMBAKAN</h2>
            <p className="text-muted-foreground">Admin Panel</p>
          </div>
        </Link>

        {/* Login Card */}
        <div className="bg-background rounded-lg border border-border p-8 shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Login Admin</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm font-medium">{error}</div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary bg-background"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? "Sedang login..." : "Login"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-center text-sm text-muted-foreground">
              Demo: Username <code className="bg-muted px-2 py-1 rounded">admin</code>, Password{" "}
              <code className="bg-muted px-2 py-1 rounded">admin123</code>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-primary hover:underline font-medium">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  )
}
