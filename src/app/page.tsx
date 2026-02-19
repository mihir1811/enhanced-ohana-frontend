import React from 'react'
import Link from 'next/link'
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { ArrowRight, Shield, Award, Globe, ShoppingBag, Gem, CreditCard, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { auctionService } from '@/services/auctionService'
import { SECTION_WIDTH } from '@/lib/constants'

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
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* Dynamic Gradient using CSS Variables */}
          <div
            className="absolute inset-0 transition-all duration-300"
            style={{
              background: `linear-gradient(to bottom right, var(--hero-gradient-start), var(--hero-gradient-via), var(--hero-gradient-end))`
            }}
          />

          {/* Animated decorative blobs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-400/20 dark:bg-amber-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="container relative z-20 px-4 md:px-6 text-center">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="inline-block animate-fade-in-up">
              <span className="py-2.5 px-5 rounded-full bg-white/60 dark:bg-white/5 border border-indigo-100 dark:border-white/10 text-sm font-bold tracking-wide text-indigo-900 dark:text-blue-100 backdrop-blur-md shadow-sm">
                ✨ The World's Premier Luxury Marketplace
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none text-foreground transition-colors duration-300 drop-shadow-sm">
              Elegance in <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-fuchsia-600 dark:from-blue-400 dark:via-purple-400 dark:to-amber-300 animate-gradient-x">
                Every Carat
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed transition-colors duration-300 font-medium">
              Buy and sell authenticated Diamonds, Gemstones, Jewelry, and Bullions on the most secure global platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-10">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white text-lg px-10 h-14 rounded-full font-bold shadow-xl hover:shadow-2xl shadow-blue-900/20 transition-all hover:-translate-y-1 border-0">
                Explore Marketplace
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-border text-foreground hover:bg-muted text-lg px-10 h-14 rounded-full font-bold transition-all bg-transparent backdrop-blur-sm">
                Become a Seller
              </Button>
            </div>
          </div>
        </div>
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
      <section className="py-32 bg-background transition-colors duration-300 relative">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-50"></div>
        <div className="container relative px-4 md:px-6 mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight">
              Curated Collections
            </h2>
            <p className="text-lg font-medium text-muted-foreground max-w-2xl mx-auto">
              Discover verified listings across our premium categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Diamond Card - Blue Theme */}
            <Link href="/diamonds" className="group block h-full">
              <div
                className="h-full relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--card-diamond-bg)',
                  borderColor: 'var(--card-diamond-border)'
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: 'var(--card-diamond-icon-bg)',
                    color: 'var(--card-diamond-icon-text)'
                  }}
                >
                  <Gem className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Diamonds</h3>
                <p className="text-muted-foreground leading-relaxed">
                  GIA Certified loose diamonds, varying cuts and clarities.
                </p>
              </div>
            </Link>

            {/* Gemstones Card - Purple/Pink Theme */}
            <Link href="/gemstones" className="group block h-full">
              <div
                className="h-full relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--card-gem-bg)',
                  borderColor: 'var(--card-gem-border)'
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: 'var(--card-gem-icon-bg)',
                    color: 'var(--card-gem-icon-text)'
                  }}
                >
                  <Award className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Gemstones</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Rare Sapphires, Rubies, Emeralds, and more.
                </p>
              </div>
            </Link>

            {/* Jewelry Card - Rose/Red Theme */}
            <Link href="/jewelry" className="group block h-full">
              <div
                className="h-full relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--card-jewelry-bg)',
                  borderColor: 'var(--card-jewelry-border)'
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: 'var(--card-jewelry-icon-bg)',
                    color: 'var(--card-jewelry-icon-text)'
                  }}
                >
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Fine Jewelry</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Exquisite rings, necklaces, and bespoke pieces.
                </p>
              </div>
            </Link>

            {/* Bullions Card - Amber/Gold Theme */}
            <Link href="/bullions" className="group block h-full">
              <div
                className="h-full relative overflow-hidden p-8 rounded-[2rem] border transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                style={{
                  backgroundColor: 'var(--card-bullion-bg)',
                  borderColor: 'var(--card-bullion-border)'
                }}
              >
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    backgroundColor: 'var(--card-bullion-icon-bg)',
                    color: 'var(--card-bullion-icon-text)'
                  }}
                >
                  <TrendingUp className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Bullions</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Investment grade Gold and Silver bars and coins.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Trust Section - Warm Luxury Tint */}
      <section
        className="py-32 transition-colors duration-300 border-y border-border"
        style={{ backgroundColor: 'var(--trust-bg)' }}
      >
        <div className={`container px-4 md:px-6 mx-auto max-w-[${SECTION_WIDTH}px]`}>
          <div className="text-center mb-16">
            <span className="text-amber-500 font-bold tracking-widest uppercase text-sm">Why Choose Ohana</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 text-foreground">Built on Trust & Transparency</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <Shield className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Verified Authenticity</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Every item is vetted by expert gemologists and secured with blockchain certification.
              </p>
            </div>

            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <CreditCard className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Secure Transactions</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                Escrow protection ensures your funds are safe until you receive and verify your purchase.
              </p>
            </div>

            <div className="space-y-6 px-4 group">
              <div className="w-24 h-24 bg-card rounded-full shadow-lg flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 transition-transform duration-300 border border-border">
                <Globe className="w-10 h-10 text-purple-500" />
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
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Stay Ahead of the Market</h2>
              <p className="text-blue-100 text-xl max-w-2xl mx-auto font-medium">
                Join 50,000+ traders getting exclusive insights on diamond prices and new arrivals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-6">
                <Input
                  placeholder="Enter your email address"
                  className="bg-white/10 border-white/20 text-white placeholder:text-blue-100/70 h-16 rounded-full px-8 text-lg focus-visible:ring-offset-0 focus-visible:ring-white/30 transition-all focus:bg-white/20 backdrop-blur-md"
                />
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-blue-50 rounded-full h-16 px-10 font-bold text-lg shadow-lg border-0">
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
