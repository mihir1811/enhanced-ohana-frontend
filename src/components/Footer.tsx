'use client'

import { SECTION_WIDTH } from '@/lib/constants'
import Link from 'next/link'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      // Handle newsletter subscription
      setIsSubscribed(true)
      setTimeout(() => setIsSubscribed(false), 3000)
      setEmail('')
    }
  }

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-white" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Main Footer Content */}
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))', borderRadius: 'var(--radius-lg)' }}>
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--primary-foreground)' }}>
                  <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-orange-400 bg-clip-text text-transparent">
                  Ohana Diamonds
                </h2>
                <p className="text-sm opacity-75">Premium Marketplace</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--muted-foreground)' }}>
              Your trusted destination for certified diamonds, exquisite gemstones, and luxury jewelry. 
              Experience the finest collection with expert craftsmanship and unmatched quality.
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Link>
              <Link href="https://instagram.com" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-2.458 0-4.467-2.01-4.467-4.468 0-2.458 2.009-4.467 4.467-4.467 2.458 0 4.468 2.009 4.468 4.467 0 2.458-2.01 4.468-4.468 4.468zm7.518 0c-2.458 0-4.467-2.01-4.467-4.468 0-2.458 2.009-4.467 4.467-4.467 2.458 0 4.468 2.009 4.468 4.467 0 2.458-2.01 4.468-4.468 4.468z"/>
                </svg>
              </Link>
              <Link href="https://twitter.com" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Link>
              <Link href="https://youtube.com" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ backgroundColor: 'var(--accent)', borderRadius: 'var(--radius-md)' }}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Shop</h3>
            <ul className="space-y-3">
              <li><Link href="/products/diamonds" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Diamonds</Link></li>
              <li><Link href="/products/gemstones" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Gemstones</Link></li>
              <li><Link href="/products/jewelry" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Fine Jewelry</Link></li>
              <li><Link href="/products/engagement-rings" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Engagement Rings</Link></li>
              <li><Link href="/products/wedding-bands" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Wedding Bands</Link></li>
              <li><Link href="/products/lab-grown" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Lab Grown Diamonds</Link></li>
              <li><Link href="/auction" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Live Auctions</Link></li>
            </ul>
          </div>

          {/* Services & Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Services & Support</h3>
            <ul className="space-y-3">
              <li><Link href="/diamond-certification" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Certificate Verification</Link></li>
              <li><Link href="/expert-consultation" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Expert Consultation</Link></li>
              <li><Link href="/custom-jewelry" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Custom Design</Link></li>
              <li><Link href="/appraisal" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Jewelry Appraisal</Link></li>
              <li><Link href="/insurance" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Jewelry Insurance</Link></li>
              <li><Link href="/support" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Customer Support</Link></li>
              <li><Link href="/shipping" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Shipping & Returns</Link></li>
              <li><Link href="/warranty" className="text-sm transition-colors hover:text-amber-400" style={{ color: 'var(--muted-foreground)' }}>Warranty Info</Link></li>
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6" style={{ color: 'var(--foreground)' }}>Stay Connected</h3>
            
            {/* Newsletter Signup */}
            <div className="mb-6">
              <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
                Subscribe to get exclusive offers and the latest diamond trends.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border text-sm transition-all duration-300 focus:ring-2 focus:border-transparent"
                    style={{ 
                      backgroundColor: 'var(--input)', 
                      borderColor: 'var(--border)', 
                      color: 'var(--foreground)',
                      borderRadius: 'var(--radius-lg)'
                    }}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="w-full px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    background: 'linear-gradient(135deg, var(--chart-1), var(--chart-4))',
                    color: 'var(--primary-foreground)',
                    borderRadius: 'var(--radius-lg)'
                  }}
                >
                  {isSubscribed ? '✓ Subscribed!' : 'Subscribe Now'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>support@ohanadiamonds.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--chart-1)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  123 Diamond District<br />
                  New York, NY 10036
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--muted)' }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                © {currentYear} Ohana Diamonds. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <Link href="/privacy" className="text-xs hover:text-amber-400 transition-colors" style={{ color: 'var(--muted-foreground)' }}>Privacy Policy</Link>
                <Link href="/terms" className="text-xs hover:text-amber-400 transition-colors" style={{ color: 'var(--muted-foreground)' }}>Terms of Service</Link>
                <Link href="/cookies" className="text-xs hover:text-amber-400 transition-colors" style={{ color: 'var(--muted-foreground)' }}>Cookie Policy</Link>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="flex items-center space-x-3">
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>We Accept:</span>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-5 rounded bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">VISA</span>
                </div>
                <div className="w-8 h-5 rounded bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">MC</span>
                </div>
                <div className="w-8 h-5 rounded bg-gradient-to-r from-blue-700 to-blue-800 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">AMEX</span>
                </div>
                <div className="w-8 h-5 rounded bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-white">PP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}