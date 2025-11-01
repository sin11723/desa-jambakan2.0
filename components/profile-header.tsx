import { MapPin, Users, Briefcase } from "lucide-react"

interface ProfileHeaderProps {
  desaName: string
  district: string
  province: string
  imageUrl: string
  totalPopulation: number
  mainLivelihoods: string
}

export function ProfileHeader({
  desaName,
  district,
  province,
  imageUrl,
  totalPopulation,
  mainLivelihoods,
}: ProfileHeaderProps) {
  return (
    <div className="relative">
      {/* Hero Image */}
      <div className="relative h-96 w-full overflow-hidden rounded-lg">
        <img src={imageUrl || "/placeholder.svg"} alt={desaName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <h1 className="text-4xl font-bold text-balance mb-2">{desaName}</h1>
          <p className="text-lg flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {district}, {province}
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 -mt-16 relative z-10 mx-auto w-full max-w-4xl px-4">
        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Users className="h-6 w-6 text-primary" />
            <span className="text-sm text-muted-foreground">Jumlah Penduduk</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalPopulation.toLocaleString("id-ID")}</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
          <div className="flex items-center gap-3 mb-2">
            <Briefcase className="h-6 w-6 text-accent" />
            <span className="text-sm text-muted-foreground">Mata Pencaharian</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{mainLivelihoods}</p>
        </div>

        <div className="bg-primary text-primary-foreground rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="h-6 w-6" />
            <span className="text-sm opacity-90">Status</span>
          </div>
          <p className="text-lg font-bold">Desa Aktif</p>
        </div>
      </div>
    </div>
  )
}
