import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"

export function BuyerCategoryCard({
  title,
  description,
  href,
  badge,
  className,
}: {
  title: string
  description?: string
  href: string
  badge?: string
  className?: string
}) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-border/60 bg-card/60 backdrop-blur-xl transition-shadow hover:shadow-md",
        className
      )}
    >
      <Link href={href} className="block p-6">
        {badge ? (
          <div className="mb-2 inline-flex items-center rounded-full border border-border/60 bg-background/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            {badge}
          </div>
        ) : null}
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}

        <div className="mt-4 text-sm font-medium text-primary">
          Explore <span aria-hidden className="ml-1">{'>'}</span>
        </div>
      </Link>
    </Card>
  )
}

