'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '@/store/hooks'
import { fetchSellerInfo } from '@/features/seller/sellerSlice'
import Link from 'next/link'
import { setCredentials } from '../../features/auth/authSlice'
import { API_CONFIG, buildApiUrl } from '@/lib/constants'

export default function LoginPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const appDispatch = useAppDispatch()
  
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const { user, accessToken } = result.data

        // Save to Redux store
        dispatch(setCredentials({ user, token: accessToken }))

        // If seller, fetch and store seller profile in sellerSlice
        if (user.role === 'seller') {
          appDispatch(fetchSellerInfo(result?.data?.sellerId))
        }

        // Save cookies for middleware
        document.cookie = `role=${user.role}; path=/`
        document.cookie = `token=${accessToken}; path=/`

        // Redirect based on role
        switch (user.role) {
          case 'admin':
            router.push('/admin')
            break
          case 'seller':
            router.push('/seller/dashboard')
            break
          default:
            router.push('/')
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'radial-gradient(circle at top, color-mix(in srgb, var(--chart-3) 16%, transparent), transparent 60%), radial-gradient(circle at bottom, color-mix(in srgb, var(--chart-5) 14%, transparent), transparent 60%), var(--background)'
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Animated gradient orbs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-float"
          style={{ background: 'color-mix(in srgb, var(--chart-5) 22%, transparent)' }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl animate-float delay-1000"
          style={{ background: 'color-mix(in srgb, var(--chart-1) 18%, transparent)' }}
        ></div>
        <div
          className="absolute top-1/2 right-1/3 w-64 h-64 rounded-full blur-3xl animate-float delay-500"
          style={{ background: 'color-mix(in srgb, var(--chart-3) 16%, transparent)' }}
        ></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px]"></div>
        
        {/* Sparkle effects */}
        <div
          className="absolute top-1/5 left-1/5 w-1 h-1 rounded-full animate-ping"
          style={{ backgroundColor: 'var(--chart-5)' }}
        ></div>
        <div
          className="absolute top-2/3 left-2/3 w-1.5 h-1.5 rounded-full animate-ping delay-700"
          style={{ backgroundColor: 'var(--chart-2)' }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/2 w-1 h-1 rounded-full animate-ping delay-300"
          style={{ backgroundColor: 'var(--chart-1)' }}
        ></div>
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Section - Welcome Back */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-12">
          <div className="max-w-lg space-y-8">
            {/* Brand Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-2xl"
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom right, var(--chart-5), color-mix(in srgb, var(--chart-5) 70%, var(--chart-1) 30%))'
                  }}
                >
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
                  </svg>
                </div>
                <div>
                  <h1
                    className="text-2xl font-bold bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, color-mix(in srgb, var(--chart-5) 80%, white 20%), color-mix(in srgb, var(--chart-4) 80%, white 20%))'
                    }}
                  >
                    Gem World
                  </h1>
                  <p className="text-slate-400 text-sm">Premium Marketplace</p>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Welcome Back to
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, color-mix(in srgb, var(--chart-5) 80%, white 20%), color-mix(in srgb, var(--chart-1) 80%, white 20%))'
                    }}
                  >
                    Luxury & Elegance
                  </span>
                </h2>
                <p className="text-slate-300 text-lg leading-relaxed">
                  Continue your journey in the world&apos;s finest jewelry marketplace. 
                  Access your dashboard, manage your collection, and discover new treasures.
                </p>
              </div>
            </div>
            
            {/* Features for logged in users */}
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--status-success) 16%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--status-success) 40%, transparent)'
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--status-success)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3
                    className="font-semibold transition-colors group-hover:text-emerald-300"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Personal Dashboard
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Access your personalized marketplace experience</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--status-info) 16%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--status-info) 40%, transparent)'
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--status-info)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3
                    className="font-semibold transition-colors group-hover:text-blue-300"
                    style={{ color: 'var(--foreground)' }}
                  >
                    Saved Collections
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">View your favorite pieces and wishlists</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4 group">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center border transition-colors"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--chart-3) 16%, transparent)',
                    borderColor: 'color-mix(in srgb, var(--chart-3) 40%, transparent)'
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: 'var(--chart-3)' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">Trusted Account</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">Enjoy verified buyer or seller privileges</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {/* Glassmorphic Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom right, var(--chart-5), color-mix(in srgb, var(--chart-4) 70%, var(--chart-5) 30%))'
                  }}
                >
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L3.09 8.26L12 14L20.91 8.26L12 2ZM21 16.5C21 16.88 20.79 17.21 20.47 17.38L12.57 21.82C12.41 21.94 12.21 22 12 22S11.59 21.94 11.43 21.82L3.53 17.38C3.21 17.21 3 16.88 3 16.5V7.5C3 7.12 3.21 6.79 3.53 6.62L11.43 2.18C11.59 2.06 11.79 2 12 2S12.41 2.06 12.57 2.18L20.47 6.62C20.79 6.79 21 7.12 21 7.5V16.5Z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
                  <p className="text-slate-400 mt-2" style={{ color: 'var(--muted-foreground)' }}>
                    Sign in to your account
                  </p>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div
                    className="p-4 rounded-xl text-sm backdrop-blur-sm border"
                    style={{
                      backgroundColor:
                        'color-mix(in srgb, var(--destructive) 10%, transparent)',
                      borderColor: 'color-mix(in srgb, var(--destructive) 40%, transparent)',
                      color: 'color-mix(in srgb, var(--destructive) 85%, white 15%)'
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="userName"
                    className="text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Username
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          'linear-gradient(to right, color-mix(in srgb, var(--chart-5) 20%, transparent), color-mix(in srgb, var(--chart-1) 20%, transparent))'
                      }}
                    ></div>
                    <input
                      id="userName"
                      name="userName"
                      type="text"
                      required
                      value={formData.userName}
                      onChange={handleInputChange}
                      className="relative w-full px-4 py-3 rounded-xl text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 backdrop-blur-sm border"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--card) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
                        boxShadow: '0 0 0 1px color-mix(in srgb, var(--border) 40%, transparent)'
                      }}
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    Password
                  </label>
                  <div className="relative group">
                    <div
                      className="absolute inset-0 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{
                        background:
                          'linear-gradient(to right, color-mix(in srgb, var(--chart-5) 20%, transparent), color-mix(in srgb, var(--chart-1) 20%, transparent))'
                      }}
                    ></div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="relative w-full px-4 py-3 rounded-xl text-white placeholder-slate-400 focus:ring-2 transition-all duration-300 backdrop-blur-sm border"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--card) 10%, transparent)',
                        borderColor: 'color-mix(in srgb, var(--border) 80%, transparent)',
                        boxShadow: '0 0 0 1px color-mix(in srgb, var(--border) 40%, transparent)'
                      }}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="flex justify-end">
                  <Link
                    href="#"
                    className="text-sm transition-colors"
                    style={{ color: 'var(--chart-5)' }}
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 text-white rounded-xl font-semibold focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:-translate-y-0.5 disabled:transform-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, var(--primary), color-mix(in srgb, var(--primary) 70%, var(--chart-5) 30%))',
                    boxShadow: '0 18px 45px color-mix(in srgb, var(--primary) 32%, transparent)'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing you in...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              {/* Register Link */}
                  <div className="pt-6 border-t" style={{ borderColor: 'color-mix(in srgb, var(--border) 60%, transparent)' }}>
                <div className="text-center space-y-4">
                  <p className="text-slate-400" style={{ color: 'var(--muted-foreground)' }}>
                    Don&apos;t have an account?
                  </p>
                  <Link 
                    href="/register" 
                    className="block w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 border-2"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--chart-5) 60%, transparent)',
                      color: 'var(--chart-5)',
                      backgroundColor: 'color-mix(in srgb, var(--chart-5) 8%, transparent)'
                    }}
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
