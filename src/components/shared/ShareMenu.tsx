'use client'

import React, { useState } from 'react'
import { Link2, Share2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { shareProduct, copyProductUrlToClipboard, type ProductType } from '@/lib/shareUtils'
import toast from 'react-hot-toast'

export interface ShareMenuProps {
  productType: ProductType
  productId: string
  productName?: string
  trigger: React.ReactNode
}

export function ShareMenu({ productType, productId, productName, trigger }: ShareMenuProps) {
  const [open, setOpen] = useState(false)

  const handleCopyLink = async () => {
    const ok = await copyProductUrlToClipboard(productType, productId)
    if (ok) {
      toast.success('Link copied to clipboard')
    } else {
      toast.error('Failed to copy link')
    }
    setOpen(false)
  }

  const handleShare = async () => {
    const { success, method } = await shareProduct(productType, productId, productName)
    if (success) {
      toast.success(method === 'share' ? 'Shared successfully' : 'Link copied to clipboard')
    } else {
      toast.error('Failed to share')
    }
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[160px]">
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Link2 className="w-4 h-4 mr-2" />
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
