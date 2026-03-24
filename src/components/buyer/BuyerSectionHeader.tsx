import * as React from "react"
import { cn } from "@/lib/utils"

export function BuyerSectionHeader({
  title,
  description,
  className,
}: {
  title: string
  description?: string
  className?: string
}) {
  return (
    <div className={cn("mb-6 grid gap-2", className)}>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-pretty text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}

