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
    <footer className="border-t transition-colors duration-300" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}>
      <div className={`max-w-[${SECTION_WIDTH}px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300" style={{ background: 'linear-gradient(135deg, var(--status-warning), color-mix(in srgb, var(--status-warning) 70%, black))' }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z" />
                </svg>
              </div>
              <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, var(--status-warning), var(--primary))' }}>Gem World</span>
            </Link>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              The world&apos;s premier marketplace for certified diamonds, precious gemstones, and luxury timepieces. Experience excellence in every facet.
            </p>
            <div className="flex items-center space-x-4">
              {['facebook', 'instagram', 'twitter', 'linkedin'].map((social) => (
                <a
                  key={social}
                  href={`#${social}`}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border transition-all duration-300 hover:scale-110"
                  style={{ backgroundColor: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--status-warning)';
                    e.currentTarget.style.borderColor = 'var(--status-warning)';
                    e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--status-warning) 10%, transparent)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--muted-foreground)';
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.backgroundColor = 'var(--muted)';
                  }}
                >
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.411 2.865 8.149 6.839 9.465.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.341-3.369-1.341-.454-1.152-1.11-1.459-1.11-1.459-.908-.62.069-.608.069-.62 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.147 22 16.411 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--foreground)' }}>Shop Collections</h3>
            <ul className="space-y-4">
              {[
                { label: 'Natural Diamonds', href: '/diamonds' },
                { label: 'Lab Grown Diamonds', href: '/diamonds?diamondType=lab-grown' },
                { label: 'Precious Gemstones', href: '/gemstones' },
                { label: 'Luxury Watches', href: '/watches' },
                { label: 'Investment Bullions', href: '/bullions' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:translate-x-1 inline-block transform duration-200"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-warning)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-6" style={{ color: 'var(--foreground)' }}>The Company</h3>
            <ul className="space-y-4">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Our Story', href: '/story' },
                { label: 'Expert Consultation', href: '/expert-consultation' },
                { label: 'Diamond Education', href: '/education' },
                { label: 'Become a Seller', href: '/become-seller' }
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:translate-x-1 inline-block transform duration-200"
                    style={{ color: 'var(--muted-foreground)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--status-warning)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--foreground)' }}>Join the Elite</h3>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Subscribe to receive exclusive offers, new collection alerts, and expert market insights.
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl text-sm border focus:ring-2 transition-all duration-300 outline-none"
                  style={{ backgroundColor: 'var(--input)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--status-warning)';
                    e.currentTarget.style.boxShadow = '0 0 0 2px color-mix(in srgb, var(--status-warning) 20%, transparent)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold transition-all duration-300 hover:shadow-lg active:scale-95"
                style={{ backgroundColor: 'var(--status-warning)', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--status-warning) 80%, black)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--status-warning)'}
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-wrap justify-center md:justify-start gap-6 text-xs" style={{ color: 'var(--muted-foreground)' }}>
            <Link href="/privacy" className="hover:text-amber-500 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-amber-500 transition-colors">Terms of Service</Link>
            <Link href="/shipping" className="hover:text-amber-500 transition-colors">Shipping & Returns</Link>
            <Link href="/cookies" className="hover:text-amber-500 transition-colors">Cookie Settings</Link>
          </div>
          <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} Gem World. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}