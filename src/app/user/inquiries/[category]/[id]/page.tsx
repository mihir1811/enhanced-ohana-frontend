'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/data/useAuth'
import { SECTION_WIDTH } from '@/lib/constants'
import InquiryDetailView from '@/components/inquiry/InquiryDetailView'
import { isInquiryCategory, type InquiryCategory } from '@/components/inquiry/inquiryTypes'
import { Button } from '@/components/ui/button'

export default function UserInquiryDetailPage() {
  const params = useParams()
  const categoryParam = params.category as string
  const idParam = params.id as string
  const id = Number(idParam)
  const { token, user } = useAuth()

  const valid = isInquiryCategory(categoryParam) && Number.isFinite(id) && id > 0

  if (!valid) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto px-4 py-16 text-center" style={{ maxWidth: SECTION_WIDTH }}>
          <p className="text-muted-foreground mb-4">Invalid inquiry link.</p>
          <Button asChild variant="outline">
            <Link href="/user/inquiries">Back to my inquiries</Link>
          </Button>
        </div>
      </div>
    )
  }

  const category = categoryParam as InquiryCategory

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10" style={{ maxWidth: SECTION_WIDTH }}>
        <InquiryDetailView
          mode="user"
          category={category}
          id={id}
          listHref="/user/inquiries"
          token={token}
          currentUserId={user?.id}
        />
      </div>
    </div>
  )
}
