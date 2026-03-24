import * as React from "react"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BuyerHeroCard({
  eyebrow,
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  className,
  children,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  className?: string
  children?: React.ReactNode
}) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/60 bg-card/70 backdrop-blur-xl",
        className
      )}
    >
      <div className="relative z-10 grid gap-6 p-6 sm:p-8">
        <div className="grid gap-2">
          {eyebrow ? (
            <div className="text-xs font-medium tracking-wide text-primary">
              {eyebrow}
            </div>
          ) : null}
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          {subtitle ? (
            <p className="max-w-2xl text-pretty text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {children ? <div>{children}</div> : null}

        {(primaryCta || secondaryCta) ? (
          <div className="flex flex-wrap items-center gap-3">
            {primaryCta ? (
              <Button asChild className="bg-primary/95 hover:bg-primary">
                <Link href={primaryCta.href}>{primaryCta.label}</Link>
              </Button>
            ) : null}
            {secondaryCta ? (
              <Button asChild variant="outline" className="border-border/60 bg-background/30">
                <Link href={secondaryCta.href}>{secondaryCta.label}</Link>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Card>
  )
}

