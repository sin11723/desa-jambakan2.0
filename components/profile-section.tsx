import type React from "react"
interface ProfileSectionProps {
  title: string
  content: string
  icon?: React.ReactNode
}

export function ProfileSection({ title, content, icon }: ProfileSectionProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-8">
      <div className="flex items-center gap-3 mb-4">
        {icon && <div className="text-primary text-2xl">{icon}</div>}
        <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      </div>
      <p className="text-foreground/80 leading-relaxed text-justify">{content}</p>
    </div>
  )
}
