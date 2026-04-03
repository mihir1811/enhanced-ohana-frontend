'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/data/useAuth'
import InquiryDetailView from '@/components/inquiry/InquiryDetailView'
import { isInquiryCategory, type InquiryCategory } from '@/components/inquiry/inquiryTypes'
import { Button } from '@/components/ui/button'

export default function SellerInquiryDetailPage() {
  const params = useParams()
  const categoryParam = params.category as string
  const idParam = params.id as string
  const id = Number(idParam)
  const { token } = useAuth()

  const valid = isInquiryCategory(categoryParam) && Number.isFinite(id) && id > 0

  if (!valid) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground mb-4">Invalid inquiry link.</p>
        <Button asChild variant="outline">
          <Link href="/seller/inquiries">Back to inquiries</Link>
        </Button>
      </div>
    )
  }

  const category = categoryParam as InquiryCategory

  return (
    <div className="space-y-6">
      <InquiryDetailView
        mode="seller"
        category={category}
        id={id}
        listHref="/seller/inquiries"
        token={token}
        currentUserId={undefined}
      />
    </div>
  )
}
