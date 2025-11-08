'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAppSelector } from "@/store/hooks"
import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'
import { ArrowRight, Shield, Award, Zap } from 'lucide-react'

export default function HomePage() {
  const { role, user } = useAppSelector((state) => state.auth)

  return (
    <div className="min-h-screen bg-white">
      <NavigationUser />

      {/* Hero Section - Clean & Simple */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Diamond & Jewelry Marketplace
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Global B2B & B2C platform connecting verified traders. Buy and sell certified diamonds, 
              gemstones, and fine jewelry with confidence.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/diamonds"
                className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
              >
                Browse Diamonds
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/jewelry"
                className="inline-flex items-center border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-colors"
              >
                Explore Jewelry
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories - Image Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
            {/* Rings */}
            <Link href="/jewelry/rings" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/jewelryCategoryImages/ring.webp"
                  alt="Diamond Rings"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Rings</h3>
                  <p className="text-sm text-gray-200 mb-3">Engagement, Wedding & More</p>
                  <span className="inline-flex items-center text-sm font-semibold">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Necklaces */}
            <Link href="/jewelry/necklaces" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/jewelryCategoryImages/necklace.webp"
                  alt="Necklaces"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Necklaces</h3>
                  <p className="text-sm text-gray-200 mb-3">Pendants, Chains & Chokers</p>
                  <span className="inline-flex items-center text-sm font-semibold">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Earrings */}
            <Link href="/jewelry/earrings" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/jewelryCategoryImages/earrings.webp"
                  alt="Earrings"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Earrings</h3>
                  <p className="text-sm text-gray-200 mb-3">Studs, Hoops & Dangles</p>
                  <span className="inline-flex items-center text-sm font-semibold">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Bracelets */}
            <Link href="/jewelry/bracelets" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/jewelryCategoryImages/bracelet.webp"
                  alt="Bracelets"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Bracelets</h3>
                  <p className="text-sm text-gray-200 mb-3">Bangles, Tennis & Cuffs</p>
                  <span className="inline-flex items-center text-sm font-semibold">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Jewelry Sets */}
            <Link href="/jewelry" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="aspect-[4/5] relative">
                <Image
                  src="/images/jewelryCategoryImages/set.webp"
                  alt="Jewelry Sets"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">Jewelry Sets</h3>
                  <p className="text-sm text-gray-200 mb-3">Complete Collections</p>
                  <span className="inline-flex items-center text-sm font-semibold">
                    Shop Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Secondary Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto mt-8">
            <Link 
              href="/diamonds" 
              className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl p-6 text-center transition-all duration-300"
            >
              <div className="text-4xl mb-3">💎</div>
              <h3 className="text-lg font-bold text-gray-900">Diamonds</h3>
              <p className="text-xs text-gray-600 mt-1">Certified & Lab-Grown</p>
            </Link>

            <Link 
              href="/gemstones" 
              className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-xl p-6 text-center transition-all duration-300"
            >
              <div className="text-4xl mb-3">💍</div>
              <h3 className="text-lg font-bold text-gray-900">Gemstones</h3>
              <p className="text-xs text-gray-600 mt-1">Ruby, Sapphire, Emerald</p>
            </Link>

            <Link 
              href="/jewelry/watches" 
              className="group bg-gradient-to-br from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 rounded-xl p-6 text-center transition-all duration-300"
            >
              <div className="text-4xl mb-3">⌚</div>
              <h3 className="text-lg font-bold text-gray-900">Watches</h3>
              <p className="text-xs text-gray-600 mt-1">Luxury Timepieces</p>
            </Link>

            <Link 
              href="/bullions" 
              className="group bg-gradient-to-br from-yellow-50 to-yellow-100 hover:from-yellow-100 hover:to-yellow-200 rounded-xl p-6 text-center transition-all duration-300"
            >
              <div className="text-4xl mb-3">🟨</div>
              <h3 className="text-lg font-bold text-gray-900">Bullions</h3>
              <p className="text-xs text-gray-600 mt-1">Gold, Silver, Platinum</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Features - Clean Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Trade With Us
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Secure Trading</h3>
              <p className="text-gray-600">
                Escrow protection and verified sellers for safe transactions
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Certified Products</h3>
              <p className="text-gray-600">
                GIA & IGI certified diamonds with detailed grading reports
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
                <Zap className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Live Auctions</h3>
              <p className="text-gray-600">
                Real-time bidding on exclusive diamonds and jewelry
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Simple */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Trading?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of buyers and sellers on our trusted marketplace
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              href="/auctions"
              className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View Auctions
            </Link>
          </div>
        </div>
      </section>

      {/* Stats - Clean & Minimal */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">15,000+</div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">2,500+</div>
              <div className="text-gray-600">Verified Sellers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Daily Transactions</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
