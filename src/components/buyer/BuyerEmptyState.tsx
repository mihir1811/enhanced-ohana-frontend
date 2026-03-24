import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BuyerEmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: { label: string; href: string }
  className?: string
}) {
  return (
    <Card
      className={cn(
        "flex flex-col items-start gap-3 border-border/60 bg-card/60 backdrop-blur-xl p-8",
        className
      )}
    >
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? (
        <Button asChild className="bg-primary/95 hover:bg-primary">
          <Link href={action.href}>{action.label}</Link>
        </Button>
      ) : null}
    </Card>
  )
}

