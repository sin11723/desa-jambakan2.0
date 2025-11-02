"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isBudayaOpen, setIsBudayaOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBudayaOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Profile", href: "/profile" },
  ]

  const navItemsAfterBudaya = [
    { label: "Berita", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
  ]

  const budayaItems = [
    { label: "Tenun", href: "/tenun" },
    { label: "Karawitan", href: "/karawitan" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-secondary border-b-4 border-accent shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="font-bold text-2xl text-accent tracking-wider hover:scale-105 transition-transform">
            🌿 DESA JAMBAKAN
          </Link>

          <div className="hidden md:flex gap-6 items-center">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-semibold hover:text-accent transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            
            {/* Budaya Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsBudayaOpen(!isBudayaOpen)}
                className="text-white font-semibold hover:text-accent transition-colors duration-300 relative group flex items-center gap-1"
              >
                Budaya
                <ChevronDown size={16} className={`transition-transform duration-200 ${isBudayaOpen ? 'rotate-180' : ''}`} />
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></span>
              </button>
              
              {isBudayaOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  {budayaItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-accent transition-colors"
                      onClick={() => setIsBudayaOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItemsAfterBudaya.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-semibold hover:text-accent transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-accent group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </div>

          <button className="md:hidden text-accent" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-3 bg-secondary/95">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-semibold hover:text-accent py-2 px-4 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Budaya Section */}
            <div className="px-4">
              <button
                onClick={() => setIsBudayaOpen(!isBudayaOpen)}
                className="text-white font-semibold hover:text-accent py-2 rounded transition-colors flex items-center gap-1 w-full text-left"
              >
                Budaya
                <ChevronDown size={16} className={`transition-transform duration-200 ${isBudayaOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isBudayaOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  {budayaItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block text-white/80 font-medium hover:text-accent py-1 transition-colors"
                      onClick={() => {
                        setIsOpen(false)
                        setIsBudayaOpen(false)
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navItemsAfterBudaya.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-white font-semibold hover:text-accent py-2 px-4 rounded transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
