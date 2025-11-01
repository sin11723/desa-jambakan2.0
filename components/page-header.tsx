import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description: string
  subtitle?: string
  showBackButton?: boolean
  backLink?: string
}

export function PageHeader({ title, description, subtitle, showBackButton = true, backLink = "/" }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showBackButton && (
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 font-medium transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Kembali
          </Link>
        )}

        <div className="space-y-4">
          {subtitle && <p className="text-accent font-bold text-sm uppercase tracking-widest">{subtitle}</p>}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight text-foreground">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">{description}</p>
        </div>
      </div>
    </section>
  )
}
