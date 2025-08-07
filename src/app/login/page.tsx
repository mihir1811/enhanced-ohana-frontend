'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'seller' | 'admin'>('user')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock login success
    document.cookie = `role=${role}; path=/`

    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'seller') router.push('/seller/dashboard')
    else router.push('/')
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 bg-background">
        <div className="w-full max-w-md space-y-8">
          {/* Logo/Brand Section */}
          <div className="text-center space-y-3">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-accent to-secondary rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
              </svg>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Ohana Gems
            </h1>
            <p className="text-muted-foreground">
              Premium Diamonds, Gemstones & Jewelry Marketplace
            </p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground">Welcome Back</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Sign in to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  Account Type
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="user">Customer</option>
                  <option value="seller">Jewelry Seller</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="text-center space-y-4">
              <Link href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot your password?
              </Link>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">New to Ohana Gems?</span>
                </div>
              </div>
              <Link 
                href="/register" 
                className="block w-full py-3 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Luxury Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/10 relative overflow-hidden">
        <div className="relative z-10 text-center max-w-lg space-y-8 p-8">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Discover Exceptional <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Jewelry & Gems
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Connect with certified sellers worldwide and find the perfect diamonds, 
              gemstones, and jewelry pieces for every occasion.
            </p>
          </div>
          
          {/* Feature Icons */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="text-center space-y-3 animate-fadeInUp">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-primary/10">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Certified</h3>
                <p className="text-sm text-muted-foreground">GIA & AGS Certified</p>
              </div>
            </div>
            
            <div className="text-center space-y-3 animate-fadeInUp delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-secondary/10">
                <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Secure</h3>
                <p className="text-sm text-muted-foreground">Protected Transactions</p>
              </div>
            </div>
            
            <div className="text-center space-y-3 animate-fadeInUp delay-300">
              <div className="w-16 h-16 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-accent/10">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Premium</h3>
                <p className="text-sm text-muted-foreground">Luxury Quality</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-float"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-gradient-to-br from-secondary/10 to-transparent rounded-full animate-float delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-20 h-20 bg-gradient-to-br from-accent/10 to-transparent rounded-full animate-float delay-500"></div>
          
          {/* Sparkle Effect */}
          <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute bottom-1/3 left-1/4 w-1 h-1 bg-accent rounded-full animate-ping delay-700"></div>
          <div className="absolute top-2/3 left-1/2 w-1.5 h-1.5 bg-secondary rounded-full animate-ping delay-300"></div>
        </div>
      </div>
    </div>
  )
}
