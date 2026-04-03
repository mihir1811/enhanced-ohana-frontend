'use client'

import { MousePointerClick } from 'lucide-react'
import type { InquiryCategory } from './inquiryTypes'
import DiamondInquiryForm from './forms/DiamondInquiryForm'
import GemstoneInquiryForm from './forms/GemstoneInquiryForm'
import BullionInquiryForm from './forms/BullionInquiryForm'
import WatchInquiryForm from './forms/WatchInquiryForm'
import JewelryInquiryForm from './forms/JewelryInquiryForm'

export default function InquiryFormSwitch({ category }: { category: InquiryCategory | '' }) {
  if (!category) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
        <MousePointerClick className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" strokeWidth={1.25} />
        <p className="text-sm font-medium text-foreground">Choose a category</p>
        <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
          Select diamond, gemstone, bullion, watch, or jewelry above — the form will load here.
        </p>
      </div>
    )
  }

  switch (category) {
    case 'diamond':
      return <DiamondInquiryForm />
    case 'gemstone':
      return <GemstoneInquiryForm />
    case 'bullion':
      return <BullionInquiryForm />
    case 'watch':
      return <WatchInquiryForm />
    case 'jewelry':
      return <JewelryInquiryForm />
    default:
      return null
  }
}
