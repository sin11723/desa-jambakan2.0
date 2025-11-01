import type { ReactNode } from "react"

interface CardGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
}

export function CardGrid({ children, columns = 3 }: CardGridProps) {
  const colsClass = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  }

  return <div className={`grid grid-cols-1 ${colsClass[columns]} gap-6`}>{children}</div>
}
