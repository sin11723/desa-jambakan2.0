"use client"

import React, { useEffect, useState } from "react"
import { useAdminAuth } from "@/contexts/AdminAuthContext"

export default function AdminLogoutWarning() {
  const { showWarning, extendSession, logout } = useAdminAuth()
  const [countdown, setCountdown] = useState(120) // 2 menit dalam detik

  useEffect(() => {
    if (!showWarning) {
      setCountdown(120)
      return
    }

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          logout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [showWarning, logout])

  if (!showWarning) return null

  const minutes = Math.floor(countdown / 60)
  const seconds = countdown % 60

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-yellow-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sesi Akan Berakhir
          </h3>
          
          <p className="text-gray-600 mb-4">
            Sesi admin Anda akan berakhir dalam{" "}
            <span className="font-bold text-red-600">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </span>
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            Klik "Perpanjang Sesi" untuk melanjutkan atau "Logout" untuk keluar sekarang.
          </p>
          
          <div className="flex gap-3 justify-center">
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout Sekarang
            </button>
            <button
              onClick={extendSession}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Perpanjang Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}