import Link from "next/link"
import type { ReactNode } from "react"

interface ProductCardProps {
  href: string
  image: string
  title: string
  description: string
  tags?: Array<{ label: string; variant?: "primary" | "secondary" }>
  badge?: ReactNode
  children?: ReactNode
}

export function ProductCard({ href, image, title, description, tags, badge, children }: ProductCardProps) {
  return (
    <Link
      href={href}
      className="group h-full flex flex-col overflow-hidden rounded-xl border border-border bg-card hover:shadow-xl transition-all duration-300 hover:border-primary/50 hover:-translate-y-1"
    >
      <div className="relative h-64 bg-muted overflow-hidden">
        <img
          src={image || "/placeholder.svg?height=256&width=512&query=product"}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {badge && <div className="absolute top-4 right-4">{badge}</div>}
      </div>

      <div className="flex-1 p-6 flex flex-col">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1 line-clamp-3">{description}</p>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span
                key={i}
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  tag.variant === "secondary" ? "bg-secondary/10 text-secondary" : "bg-primary/10 text-primary"
                }`}
              >
                {tag.label}
              </span>
            ))}
          </div>
        )}

        {children && <div className="pt-4 border-t border-border">{children}</div>}
      </div>
    </Link>
  )
}
