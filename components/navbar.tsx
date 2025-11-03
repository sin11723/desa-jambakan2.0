"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, ChevronDown } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const navItems = [
    { label: "Beranda", href: "/" },
    {
      label: "Profil Desa",
      submenu: [
        { label: "Sejarah Desa", href: "/profile" },
        { label: "Peta Desa", href: "/profil/peta" },
        { label: "Struktur Desa", href: "/profil/struktur" },
      ],
    },
    {
      label: "Budaya",
      submenu: [
        { label: "Tenun", href: "/tenun" },
        { label: "Karawitan", href: "/karawitan" },
      ],
    },
    { label: "Berita", href: "/berita" },
    { label: "Galeri", href: "/galeri" },
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

          <div className="hidden md:flex gap-1">
            {navItems.map((item) =>
              "submenu" in item ? (
                <div
                  key={item.label}
                  className="relative group"
                  onMouseEnter={() => setOpenDropdown(item.label)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <button className="text-white font-semibold hover:text-[hsl(63,100%,41%)] transition-colors duration-300 px-4 py-2 flex items-center gap-1 relative group/btn">
                    {item.label}
                    <ChevronDown size={16} className="group-hover/btn:rotate-180 transition-transform" />
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#D2691E] group-hover/btn:w-full transition-all duration-300"></span>
                  </button>
                  <div className="absolute left-0 mt-0 w-48 bg-[#A0522D] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 py-2">
                    {item.submenu.map((subitem) => (
                      <Link
                        key={subitem.href}
                        href={subitem.href}
                        className="block px-4 py-2 text-white hover:bg-[#8B4513] hover:text-[#D2691E] transition-colors"
                      >
                        {subitem.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white font-semibold hover:text-[#D2691E] transition-colors duration-300 relative group px-4 py-2"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-[#D2691E] group-hover:w-full transition-all duration-300"></span>
                </Link>
              ),
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden pb-6 flex flex-col gap-3 bg-[#8B4513]/95">
            {navItems.map((item) =>
              "submenu" in item ? (
                <div key={item.label}>
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className="w-full text-left text-white font-semibold hover:text-[#D2691E] py-2 px-4 rounded transition-colors flex items-center justify-between"
                  >
                    {item.label}
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${openDropdown === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openDropdown === item.label && (
                    <div className="bg-[#A0522D] rounded ml-4 mt-1">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.href}
                          href={subitem.href}
                          className="block text-white hover:text-[#D2691E] py-2 px-4 transition-colors"
                          onClick={() => {
                            setIsOpen(false)
                            setOpenDropdown(null)
                          }}
                        >
                          {subitem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white font-semibold hover:text-[#D2691E] py-2 px-4 rounded transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
