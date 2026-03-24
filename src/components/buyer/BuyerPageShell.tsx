import * as React from "react"

import { cn } from "@/lib/utils"
import { SECTION_WIDTH } from "@/lib/constants"

export function BuyerPageShell({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        `mx-auto w-full max-w-[${SECTION_WIDTH}px] px-4 py-10 sm:px-6`,
        "lg:py-14",
        className
      )}
    >
      {children}
    </div>
  )
}

