import React from 'react'
import Link from 'next/link'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { CreditCard, Globe, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { auctionService } from '@/services/auctionService'
import { SECTION_WIDTH } from '@/lib/constants'
import { BuyerHeroCard } from '@/components/buyer/BuyerHeroCard'
import { BuyerCategoryCard } from '@/components/buyer/BuyerCategoryCard'
import { BuyerPageShell } from '@/components/buyer/BuyerPageShell'
import { BuyerSectionHeader } from '@/components/buyer/BuyerSectionHeader'

export default async function HomePage() {
  let liveAuctions: any[] = []

  try {
    const liveRes = await auctionService.getLiveAuctions<{ data: { data: any[]; meta: any } }>({ limit: 4 })
    liveAuctions = Array.isArray(liveRes?.data?.data) ? liveRes.data.data : []
  } catch (error) {
    liveAuctions = []
  }

  const formatEndsIn = (endTime?: string | Date) => {
    if (!endTime) return ''
    const end = new Date(endTime)
    const now = new Date()
    const diffMs = Math.max(0, end.getTime() - now.getTime())
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `Ends in ${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <NavigationUser />

      {/* Hero Section */}
      <section className="py-10 sm:py-14">
        <BuyerPageShell className="py-0 lg:py-0">
          <BuyerHeroCard
            eyebrow="Verified. Secure. Global."
            title="Elegance in Every Carat"
            subtitle="Buy and sell authenticated Diamonds, Gemstones, Jewelry, and Bullions on the most secure global platform."
            primaryCta={{ label: 'Explore Marketplace', href: '/diamonds' }}
            secondaryCta={{ label: 'Become a Seller', href: '/register' }}
          />
        </BuyerPageShell>
      </section>

      {/* Live Auctions */}
      <section className="py-20 border-t" style={{ borderColor: 'var(--border)' }}>
        <div className={`container px-4 md:px-6 mx-auto max-w-[${SECTION_WIDTH}px]`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl md:text-4xl font-bold">Live Auctions</h2>
            <Link href="/auctions" className="px-5 py-2.5 rounded-full font-bold transition-all border" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}>
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {liveAuctions.map((a: any) => {
              const topBid = Array.isArray(a.bids) && a.bids.length ? a.bids.reduce((max: any, b: any) => (b.amount > (max?.amount ?? 0) ? b : max), null) : null
              const title = a.product?.name ?? `${String(a.productType).charAt(0).toUpperCase() + String(a.productType).slice(1)} #${a.productId}`
              const price = topBid?.amount ? Number(topBid.amount).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) : 'No bids yet'
              const endsIn = formatEndsIn(a.endTime)
              return (
                <Link key={`${a.id}-${a.productId}`} href={`/auctions/${a.id}`} className="block">
                  <div className="rounded-2xl border p-5 transition-all hover:shadow-xl" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="aspect-video rounded-xl mb-4" style={{ backgroundColor: 'var(--muted)' }} />
                    <div className="font-semibold mb-1" style={{ color: 'var(--card-foreground)' }}>{title}</div>
                    <div className="text-sm mb-3" style={{ color: 'var(--muted-foreground)' }}>{price}</div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }}>
                      {endsIn}
                    </div>
                  </div>
                </Link>
              )
            })}
            {liveAuctions.length === 0 && (
              <div className="rounded-2xl border p-8 text-center" style={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-lg" style={{ color: 'var(--muted-foreground)' }}>No live auctions at the moment</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section - Colorful Cards with CSS Variables */}
      <section className="py-24 bg-background transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50"></div>
        <BuyerPageShell className="relative py-0 lg:py-0">
          <BuyerSectionHeader
            title="Curated Collections"
            description="Discover verified listings across our premium categories."
            className="text-center mb-14 mx-auto max-w-3xl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <BuyerCategoryCard
              href="/diamonds"
              title="Diamonds"
              description="GIA Certified loose diamonds, varying cuts and clarities."
              className="h-full"
            />
            <BuyerCategoryCard
              href="/gemstones"
              title="Gemstones"
              description="Rare Sapphires, Rubies, Emeralds, and more."
              className="h-full"
            />
            <BuyerCategoryCard
              href="/jewelry"
              title="Fine Jewelry"
              description="Exquisite rings, necklaces, and bespoke pieces."
              className="h-full"
            />
            <BuyerCategoryCard
              href="/bullions"
              title="Bullions"
              description="Investment grade Gold and Silver bars and coins."
              className="h-full"
            />
            <BuyerCategoryCard
              href="/watches"
              title="Watches"
              description="Curated luxury timepieces with verified provenance."
              className="h-full"
            />
          </div>
        </BuyerPageShell>
      </section>

      {/* Features/Trust Section - Warm Luxury Tint */}
      <section
        className="py-32 transition-colors duration-300 border-y border-border"
        style={{ backgroundColor: 'var(--trust-bg)' }}
      >
        <div className={`container px-4 md:px-6 mx-auto max-w-[${SECTION_WIDTH}px]`}>
          <div className="text-center mb-16">
            <span
              className="font-bold tracking-widest uppercase text-sm"
              style={{ color: 'var(--chart-5)' }}
            >
              Why Choose Ohana
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 text-foreground">Built on Trust & Transparency</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <Shield
                  className="w-10 h-10"
                  style={{ color: 'var(--status-success)' }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Verified Authenticity</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Every item is vetted by expert gemologists and secured with blockchain certification.
              </p>
            </div>

            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <CreditCard
                  className="w-10 h-10"
                  style={{ color: 'var(--primary)' }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Secure Transactions</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Escrow protection ensures your funds are safe until you receive and verify your purchase.
              </p>
            </div>

            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <Globe
                  className="w-10 h-10"
                  style={{ color: 'var(--chart-3)' }}
                />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Global Logistics</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Fully insured shipping to over 50 countries with real-time tracking and customs handling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Vibrant Gradient */}
      <section className="py-24 bg-background transition-colors duration-300">
        <div className={`container px-4 md:px-6 mx-auto max-w-[${SECTION_WIDTH}px]`}>
          <div
            className="max-w-6xl mx-auto rounded-[3rem] p-12 md:p-24 overflow-hidden relative text-center shadow-2xl transition-all duration-300"
            style={{
              background: `linear-gradient(to bottom right, var(--newsletter-bg-start), var(--newsletter-bg-via), var(--newsletter-bg-end))`
            }}
          >
            {/* Decorative background elements */}
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"
            style={{
              background:
                'color-mix(in srgb, var(--background) 40%, var(--foreground) 8%)'
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-96 h-96 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2"
            style={{
              background:
                'color-mix(in srgb, var(--primary) 30%, transparent)'
            }}
          />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Stay Ahead of the Market</h2>
              <p
                className="text-xl max-w-2xl mx-auto font-medium"
                style={{
                  color:
                    'color-mix(in srgb, var(--foreground) 15%, white 85%)'
                }}
              >
                Join 50,000+ traders getting exclusive insights on diamond prices and new arrivals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-6">
                <Input
                  placeholder="Enter your email address"
                  className="h-16 rounded-full px-8 text-lg focus-visible:ring-offset-0 transition-all backdrop-blur-md"
                  style={{
                    backgroundColor:
                      'color-mix(in srgb, var(--background) 20%, transparent)',
                    borderColor:
                      'color-mix(in srgb, var(--primary) 45%, transparent)',
                    color: 'var(--foreground)'
                  }}
                />
                <Button
                  size="lg"
                  className="rounded-full h-16 px-10 font-bold text-lg shadow-lg border-0"
                  style={{
                    backgroundColor: 'var(--primary-foreground)',
                    color: 'var(--primary)'
                  }}
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
