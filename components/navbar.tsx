"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: "Beranda", href: "/" },
    { label: "Profile", href: "/profile" },
    { label: "Tenun", href: "/tenun" },
    { label: "Karawitan", href: "/karawitan" },
    { label: "Berita", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
  ]

  const budayaItems = [
    { label: "Tenun", href: "/tenun" },
    { label: "Karawitan", href: "/karawitan" },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-[#a71f00] border-b-4 border-[rgb(228,213,0)] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            href="/"
            className="font-bold text-2xl text-white tracking-wider hover:scale-105 transition-transform flex items-center gap-2"
          >
            <span className="text-3xl">🌾</span>
            <span>DESA JAMBAKAN</span>
          </Link>

          <div className="hidden md:flex gap-6">
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
            <Link
              href="/admin"
              className="px-6 py-2 bg-accent text-secondary rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Admin
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
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
            <Link
              href="/admin"
              className="px-6 py-2 bg-accent text-secondary rounded-full font-bold text-center hover:shadow-lg transition-all"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
