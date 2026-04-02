'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Diamond, Gem, Watch, Package } from 'lucide-react'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { ProductGridSkeleton } from '@/components/ui/ProductGridSkeleton'
import { SECTION_WIDTH } from '@/lib/constants'
import diamondService from '@/services/diamondService'
import Image from 'next/image'
import { PLACEHOLDER_IMAGE } from '@/lib/placeholders'
import useSWR from 'swr'
import { Card } from '@/components/ui/card'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams?.get('q')?.trim() || ''

  // Debounce query to avoid request spam while the user is typing
  const [debouncedQ, setDebouncedQ] = useState(q)
  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedQ(q), 300)
    return () => window.clearTimeout(t)
  }, [q])

  const fetcher = useMemo(() => {
    return async () => {
      const res = await diamondService.searchDiamonds(debouncedQ)
      if (!res?.success) {
        throw new Error(res?.message || 'Search temporarily unavailable')
      }
      return Array.isArray(res.data) ? res.data : []
    }
  }, [debouncedQ])

  const { data, error, isLoading } = useSWR(
    debouncedQ ? ['search:diamonds', debouncedQ] : null,
    fetcher,
    { revalidateOnFocus: false },
  )

  const diamonds = data ?? []
  const hasResults = diamonds.length > 0
  const loading = isLoading && !!debouncedQ
  const errorMessage = error instanceof Error ? error.message : null

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <NavigationUser />
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-8`}>
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
            {q ? `Search results for "${q}"` : 'Search'}
          </h1>
          <p className="mt-2" style={{ color: 'var(--muted-foreground)' }}>
            {q ? (loading ? 'Searching...' : `${diamonds.length} result${diamonds.length !== 1 ? 's' : ''} found`) : 'Search diamonds, gemstones, jewelry, and more'}
          </p>
        </div>

        {!q ? (
          <Card className="text-center py-16 rounded-xl gap-0">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              Start your search
            </h3>
            <p className="mb-8 max-w-md mx-auto text-muted-foreground">
              Use the search bar above to find diamonds, gemstones, jewelry, watches, and bullions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/diamonds"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground transition-colors hover:scale-[1.02]"
              >
                <Diamond className="w-5 h-5" />
                Browse Diamonds
              </Link>
              <Link
                href="/gemstones"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground transition-colors hover:scale-[1.02]"
              >
                <Gem className="w-5 h-5" />
                Browse Gemstones
              </Link>
              <Link
                href="/watches"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground transition-colors hover:scale-[1.02]"
              >
                <Watch className="w-5 h-5" />
                Browse Watches
              </Link>
              <Link
                href="/jewelry"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground transition-colors hover:scale-[1.02]"
              >
                <Package className="w-5 h-5" />
                Browse Jewelry
              </Link>
            </div>
          </Card>
        ) : loading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : errorMessage ? (
          <Card className="text-center py-16 rounded-xl gap-0">
            <p className="mb-4 text-destructive">{errorMessage}</p>
            <Link
              href="/diamonds"
              className="inline-block px-6 py-3 rounded-lg font-medium bg-primary text-primary-foreground"
            >
              Browse Diamonds
            </Link>
          </Card>
        ) : !hasResults ? (
          <Card className="text-center py-16 rounded-xl gap-0">
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No results for &quot;{q}&quot;
            </h3>
            <p className="mb-8 text-muted-foreground">
              Try different keywords or browse our collections
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/diamonds"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground"
              >
                <Diamond className="w-5 h-5" />
                Diamonds
              </Link>
              <Link
                href="/gemstones"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground"
              >
                <Gem className="w-5 h-5" />
                Gemstones
              </Link>
              <Link
                href="/watches"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground"
              >
                <Watch className="w-5 h-5" />
                Watches
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {diamonds.map((d) => (
              <Link
                key={d.id}
                href={`/diamonds/${d.id}`}
                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              >
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={d.image1 || d.images?.[0] || PLACEHOLDER_IMAGE}
                    alt={d.name || `Diamond ${d.id}`}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE
                    }}
                  />
                </div>
                <div className="p-4">
                  <p className="font-semibold line-clamp-2 text-foreground">
                    {d.name || `${d.shape} ${d.caratWeight}ct`}
                  </p>
                  <p className="text-sm mt-1 text-muted-foreground">
                    {d.caratWeight}ct · {d.color} · {d.clarity}
                  </p>
                  <p className="font-bold mt-2 text-foreground">
                    ${Number(d.totalPrice || d.price || 0).toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
