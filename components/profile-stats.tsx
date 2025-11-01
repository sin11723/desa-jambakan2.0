interface StatItem {
  label: string
  value: string | number
}

interface ProfileStatsProps {
  stats: StatItem[]
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <div key={index} className="rounded-lg border border-border bg-card p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-primary">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
