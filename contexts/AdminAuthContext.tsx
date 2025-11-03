"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  username: string
  email: string
}

interface AdminAuthContextType {
  user: User | null
  login: (userData: User) => void
  logout: () => void
  isAuthenticated: boolean
  showWarning: boolean
  extendSession: () => void
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

// Konfigurasi waktu (dalam milidetik)
const IDLE_TIME = 15 * 60 * 1000 // 15 menit tidak aktif
const WARNING_TIME = 2 * 60 * 1000 // Peringatan 2 menit sebelum logout
const SESSION_DURATION = 30 * 60 * 1000 // Total sesi 30 menit

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [showWarning, setShowWarning] = useState(false)
  const [lastActivity, setLastActivity] = useState(Date.now())
  const [sessionStart, setSessionStart] = useState(Date.now())

  // Fungsi untuk mereset aktivitas
  const resetActivity = useCallback(() => {
    setLastActivity(Date.now())
    setShowWarning(false)
  }, [])

  // Fungsi untuk extend session
  const extendSession = useCallback(() => {
    setSessionStart(Date.now())
    setLastActivity(Date.now())
    setShowWarning(false)
  }, [])

  // Fungsi logout
  const logout = useCallback(() => {
    localStorage.removeItem("adminUser")
    localStorage.removeItem("adminSessionStart")
    setUser(null)
    setShowWarning(false)
    router.push("/admin")
  }, [router])

  // Fungsi login
  const login = useCallback((userData: User) => {
    const now = Date.now()
    localStorage.setItem("adminUser", JSON.stringify(userData))
    localStorage.setItem("adminSessionStart", now.toString())
    setUser(userData)
    setLastActivity(now)
    setSessionStart(now)
    setShowWarning(false)
  }, [])

  // Event listeners untuk aktivitas user
  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    
    const handleActivity = () => {
      if (user) {
        resetActivity()
      }
    }

    // Tambahkan event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    return () => {
      // Cleanup event listeners
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
    }
  }, [user, resetActivity])

  // Timer untuk cek idle time dan session duration
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      const now = Date.now()
      const timeSinceActivity = now - lastActivity
      const timeSinceSessionStart = now - sessionStart

      // Cek apakah sesi sudah melebihi batas maksimal
      if (timeSinceSessionStart >= SESSION_DURATION) {
        logout()
        return
      }

      // Cek apakah user idle terlalu lama
      if (timeSinceActivity >= IDLE_TIME) {
        logout()
        return
      }

      // Tampilkan peringatan jika mendekati timeout
      if (timeSinceActivity >= (IDLE_TIME - WARNING_TIME) && !showWarning) {
        setShowWarning(true)
      }
    }, 1000) // Cek setiap detik

    return () => clearInterval(interval)
  }, [user, lastActivity, sessionStart, showWarning, logout])

  // Inisialisasi user dari localStorage
  useEffect(() => {
    const userStr = localStorage.getItem("adminUser")
    const sessionStartStr = localStorage.getItem("adminSessionStart")
    
    if (userStr && sessionStartStr) {
      const userData: User = JSON.parse(userStr)
      const sessionStartTime = parseInt(sessionStartStr)
      const now = Date.now()
      
      // Cek apakah sesi masih valid
      if (now - sessionStartTime < SESSION_DURATION) {
        setUser(userData)
        setLastActivity(now)
        setSessionStart(sessionStartTime)
      } else {
        // Sesi expired, hapus data
        localStorage.removeItem("adminUser")
        localStorage.removeItem("adminSessionStart")
      }
    }
  }, [])

  const value: AdminAuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    showWarning,
    extendSession
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider")
  }
  return context
}