'use client'

import React, { useEffect, useState } from 'react'
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

export default function SearchPage() {
  const searchParams = useSearchParams()
  const q = searchParams?.get('q')?.trim() || ''
  const [loading, setLoading] = useState(!!q)
  const [diamonds, setDiamonds] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!q) {
      setLoading(false)
      setDiamonds([])
      return
    }
    setLoading(true)
    setError(null)
    diamondService
      .searchDiamonds(q)
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setDiamonds(res.data)
        } else {
          setDiamonds([])
        }
      })
      .catch(() => {
        setDiamonds([])
        setError('Search temporarily unavailable')
      })
      .finally(() => setLoading(false))
  }, [q])

  const hasResults = diamonds.length > 0
  const isEmpty = !q || (!loading && !hasResults && !error)

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
          <div
            className="text-center py-16 rounded-xl border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              Start your search
            </h3>
            <p className="mb-8 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              Use the search bar above to find diamonds, gemstones, jewelry, watches, and bullions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/diamonds"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors hover:scale-[1.02]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Diamond className="w-5 h-5" />
                Browse Diamonds
              </Link>
              <Link
                href="/gemstones"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors hover:scale-[1.02]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Gem className="w-5 h-5" />
                Browse Gemstones
              </Link>
              <Link
                href="/watches"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors hover:scale-[1.02]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Watch className="w-5 h-5" />
                Browse Watches
              </Link>
              <Link
                href="/jewelry"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border transition-colors hover:scale-[1.02]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Package className="w-5 h-5" />
                Browse Jewelry
              </Link>
            </div>
          </div>
        ) : loading ? (
          <ProductGridSkeleton count={8} columns={4} />
        ) : error ? (
          <div
            className="text-center py-16 rounded-xl border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <p className="mb-4" style={{ color: 'var(--destructive)' }}>{error}</p>
            <Link
              href="/diamonds"
              className="inline-block px-6 py-3 rounded-lg font-medium"
              style={{ backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              Browse Diamonds
            </Link>
          </div>
        ) : !hasResults ? (
          <div
            className="text-center py-16 rounded-xl border"
            style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Search className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--muted-foreground)' }} />
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
              No results for &quot;{q}&quot;
            </h3>
            <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
              Try different keywords or browse our collections
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/diamonds"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Diamond className="w-5 h-5" />
                Diamonds
              </Link>
              <Link
                href="/gemstones"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Gem className="w-5 h-5" />
                Gemstones
              </Link>
              <Link
                href="/watches"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <Watch className="w-5 h-5" />
                Watches
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {diamonds.map((d) => (
              <Link
                key={d.id}
                href={`/diamonds/${d.id}`}
                className="rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
                style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="aspect-square relative" style={{ backgroundColor: 'var(--muted)' }}>
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
                  <p className="font-semibold line-clamp-2" style={{ color: 'var(--foreground)' }}>
                    {d.name || `${d.shape} ${d.caratWeight}ct`}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                    {d.caratWeight}ct · {d.color} · {d.clarity}
                  </p>
                  <p className="font-bold mt-2" style={{ color: 'var(--foreground)' }}>
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
