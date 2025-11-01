import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-secondary text-white mt-20 border-t-4 border-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-accent">Desa Jambakan</h3>
            <p className="text-sm opacity-90">
              Melestarikan warisan budaya tenun tradisional melalui teknologi modern.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">Menu Utama</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="hover:text-accent transition-colors">
                  Profile Desa
                </Link>
              </li>
              <li>
                <Link href="/tenun" className="hover:text-accent transition-colors">
                  Karya Tenun
                </Link>
              </li>
              <li>
                <Link href="/karawitan" className="hover:text-accent transition-colors">
                  Karawitan
                </Link>
              </li>
              <li>
                <Link href="/berita" className="hover:text-accent transition-colors">
                  Berita
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-accent transition-colors">
                  Galeri
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">Kontak</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <Phone size={16} />
                <span>+62 XXX XXXX XXXX</span>
              </div>
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <Mail size={16} />
                <span>info@desajambakan.id</span>
              </div>
              <div className="flex items-center gap-2 hover:text-accent transition-colors">
                <MapPin size={16} />
                <span>Jambakan, Jawa Tengah</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-accent">Ikuti Kami</h4>
            <div className="flex gap-4">
              <Instagram className="hover:text-accent cursor-pointer transition-colors" size={24} />
              <Facebook className="hover:text-accent cursor-pointer transition-colors" size={24} />
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm opacity-80">
          <p>&copy; 2025 Desa Jambakan. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  )
}
