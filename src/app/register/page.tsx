'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'customer'
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Set default role as user
    document.cookie = `role=user; path=/`
    router.push('/')
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Section - Luxury Showcase */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-secondary/5 via-accent/5 to-primary/10 relative overflow-hidden">
        <div className="relative z-10 text-center max-w-lg space-y-8 p-8">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold text-foreground leading-tight">
              Join the Premier <br />
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Jewelry Marketplace
              </span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're seeking exquisite jewelry or looking to showcase your 
              craftsmanship, Ohana Gems is your gateway to the world of luxury.
            </p>
          </div>
          
          {/* Benefits */}
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4 text-left animate-slideInLeft">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Verified Sellers</h3>
                <p className="text-sm text-muted-foreground">All jewelry professionals are thoroughly vetted</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 text-left animate-slideInLeft delay-200">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-secondary/10">
                <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Authenticity Guaranteed</h3>
                <p className="text-sm text-muted-foreground">Every piece comes with certification and warranty</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 text-left animate-slideInLeft delay-300">
              <div className="w-12 h-12 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-accent/10">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Quick transactions with instant notifications</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4 text-left animate-slideInLeft delay-500">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm border border-primary/10">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Global Community</h3>
                <p className="text-sm text-muted-foreground">Connect with jewelry lovers worldwide</p>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/3 right-1/4 w-28 h-28 bg-gradient-to-br from-primary/10 to-transparent rounded-full animate-float"></div>
          <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-gradient-to-br from-secondary/10 to-transparent rounded-full animate-float delay-1000"></div>
          <div className="absolute top-2/3 right-1/3 w-16 h-16 bg-gradient-to-br from-accent/10 to-transparent rounded-full animate-float delay-500"></div>
          
          {/* Luxury Pattern */}
          <div className="absolute inset-0 opacity-5">
            <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="luxury-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="10" cy="10" r="2" fill="currentColor" className="text-primary" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#luxury-pattern)" />
            </svg>
          </div>
          
          {/* Sparkles */}
          <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-primary rounded-full animate-ping"></div>
          <div className="absolute bottom-1/4 right-1/4 w-1 h-1 bg-accent rounded-full animate-ping delay-700"></div>
          <div className="absolute top-3/4 left-1/2 w-1.5 h-1.5 bg-secondary rounded-full animate-ping delay-300"></div>
        </div>
      </div>

      {/* Right Section - Form */}
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
              <h2 className="text-2xl font-semibold text-foreground">Create Your Account</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Join thousands of jewelry enthusiasts and professionals
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-foreground">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-foreground">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="accountType" className="text-sm font-medium text-foreground">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <option value="customer">Customer - Buy jewelry & gems</option>
                  <option value="seller">Jewelry Seller - Sell products</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Create a strong password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-300 shadow-sm hover:shadow-md"
                  placeholder="Confirm your password"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="w-4 h-4 text-primary bg-card border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{' '}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="#" className="text-primary hover:text-primary/80 transition-colors">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-lg font-medium hover:from-primary/90 hover:to-accent/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Creating account...</span>
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background text-muted-foreground">Already have an account?</span>
                </div>
              </div>
              <Link 
                href="/login" 
                className="block w-full py-3 px-4 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
