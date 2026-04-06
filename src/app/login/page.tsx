'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDispatch } from 'react-redux'
import { useAppDispatch } from '@/store/hooks'
import { fetchSellerInfo } from '@/features/seller/sellerSlice'
import Link from 'next/link'
import { Inter, Playfair_Display } from 'next/font/google'
import { motion, useReducedMotion } from 'framer-motion'
import { setCredentials } from '../../features/auth/authSlice'
import { API_CONFIG, buildApiUrl } from '@/lib/constants'

const inter = Inter({ subsets: ['latin'] })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['500', '600', '700'] })

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const shouldReduceMotion = useReducedMotion()
  const redirectTo = searchParams.get('redirect') || ''
  const dispatch = useDispatch()
  const appDispatch = useAppDispatch()
  
  const [formData, setFormData] = useState({
    userName: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const isPasswordValid = (password: string) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasNumber = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasNumber &&
      hasSpecialChar
    )
  }

  const canSubmit = formData.userName && isPasswordValid(formData.password)
  const easeOut = [0.22, 1, 0.36, 1] as const
  const rise = shouldReduceMotion ? 0 : 18

  const headerMotion = shouldReduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, ease: easeOut },
      }

  const sideMotion = (delay = 0) =>
    shouldReduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: rise },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: easeOut },
        }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!canSubmit) return

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

        // Redirect based on role or explicit redirect param
        if (redirectTo && redirectTo.startsWith('/') && !redirectTo.startsWith('//')) {
          router.push(redirectTo)
        } else {
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
    <div className={`${inter.className} min-h-screen bg-[#f5f6fa] text-[#171923] dark:bg-[#0d1117] dark:text-[#e6edf3]`}>
      <motion.header className="border-b border-black/5 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#111827]/90" {...headerMotion}>
        <div className="mx-auto flex h-16 max-w-full items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className={`${playfair.className} text-[34px] leading-none tracking-tight text-[#111] dark:text-white`}>
            GemWorld
          </Link>
          <nav className="hidden items-center gap-9 text-[15px] text-[#454a57] md:flex dark:text-[#a8b3c7]">
            <Link href="#" className="transition hover:text-[#111] dark:hover:text-white">Collections</Link>
            <Link href="#" className="transition hover:text-[#111] dark:hover:text-white">Knowledge</Link>
            <Link href="#" className="transition hover:text-[#111] dark:hover:text-white">About</Link>
          </nav>
        </div>
      </motion.header>

      <main className="mx-auto grid max-w-full grid-cols-1 px-4 py-6 sm:px-6 md:py-8 lg:min-h-[760px] lg:grid-cols-[1fr_1fr] lg:px-10 lg:py-0">
        <motion.section className="relative min-h-[340px] overflow-hidden rounded-2xl lg:rounded-none lg:min-h-[760px]" {...sideMotion(0.1)}>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(7, 15, 35, 0.35) 0%, rgba(7, 21, 50, 0.92) 100%), url('https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=1400&auto=format&fit=crop')",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white sm:p-8 lg:p-12">
            <motion.h1 className={`${playfair.className} max-w-[14ch] text-4xl leading-[1.05] sm:text-5xl`} {...sideMotion(0.2)}>
              Return to the Sanctuary.
            </motion.h1>
            <div className="mt-6 max-w-[560px] rounded-2xl border border-white/15 bg-black/20 p-6 backdrop-blur-sm">
              <p className="text-sm leading-7 text-white/90 sm:text-[17px]">
                Access your curated dashboard, track exclusive pieces, and continue your journey with
                the world&apos;s finest gemstone marketplace.
              </p>
              <div className="mt-6 flex items-center gap-3 text-xs tracking-[0.24em] text-white/80">
                <div className="flex -space-x-2">
                  <span className="h-8 w-8 rounded-lg border border-white/50 bg-white/25" />
                  <span className="h-8 w-8 rounded-lg border border-white/50 bg-white/25" />
                  <span className="h-8 w-8 rounded-lg border border-white/50 bg-white/25" />
                </div>
                <span>WELCOME BACK, CURATOR</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="flex items-center justify-center py-8 lg:min-h-[760px] lg:py-14" {...sideMotion(0.22)}>
          <div className="w-full max-w-[420px] rounded-2xl bg-transparent p-0 dark:bg-[#0f1724]/80 dark:p-6">
            <motion.p className="text-[11px] font-semibold tracking-[0.3em] text-[#8d7b42] dark:text-[#d4b24f]" {...sideMotion(0.28)}>
              SIGN IN
            </motion.p>
            <motion.h2 className={`${playfair.className} mt-2 text-5xl leading-none text-[#121826] dark:text-white`} {...sideMotion(0.32)}>
              GemWorld Login
            </motion.h2>
            <motion.p className="mt-4 max-w-[36ch] text-[15px] leading-7 text-[#505767] dark:text-[#a8b3c7]" {...sideMotion(0.36)}>
              Continue where you left off and access your personalized gemstone journey.
            </motion.p>

            <motion.form onSubmit={handleSubmit} className="mt-9 space-y-7" {...sideMotion(0.42)}>
              {error && (
                <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300" role="alert">
                  {error}
                </div>
              )}

              <label className="block">
                <span className="block text-[11px] font-semibold tracking-[0.16em] text-[#6a7080] dark:text-[#9fb0c4]">USERNAME</span>
                <input
                  name="userName"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.userName}
                  onChange={handleInputChange}
                  placeholder="juliancurator"
                  className="mt-3 h-10 w-full border-0 border-b border-[#c9c1a3] bg-transparent px-0 text-[17px] text-[#131924] placeholder:text-[#c4c8d0] focus:outline-none dark:border-[#3f4d66] dark:text-[#e6edf3] dark:placeholder:text-[#6f7b91]"
                />
              </label>

              <label className="block">
                <span className="block text-[11px] font-semibold tracking-[0.16em] text-[#6a7080] dark:text-[#9fb0c4]">PASSWORD</span>
                <div className="relative mt-3">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••••"
                    className="h-10 w-full border-0 border-b border-[#c9c1a3] bg-transparent px-0 pr-9 text-[17px] text-[#131924] placeholder:text-[#c4c8d0] focus:outline-none dark:border-[#3f4d66] dark:text-[#e6edf3] dark:placeholder:text-[#6f7b91]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#a8adba] transition hover:text-[#525866] dark:text-[#6f7b91] dark:hover:text-[#c9d3e3]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    </svg>
                  </button>
                </div>
                {formData.password && !isPasswordValid(formData.password) ? (
                  <span className="mt-2 block text-[11px] text-amber-700 dark:text-amber-400">Min 8 chars, 1 uppercase, 1 number, 1 special.</span>
                ) : null}
              </label>

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-[#8d7b42] hover:underline dark:text-[#d4b24f]">
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading || !canSubmit}
                className="h-12 w-full rounded-lg text-[12px] font-semibold tracking-[0.18em] text-white transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{ background: 'linear-gradient(90deg,#8f6a00,#f0bb06)' }}
                whileHover={
                  !shouldReduceMotion && canSubmit && !isLoading
                    ? { y: -1.5, scale: 1.01, filter: 'brightness(1.04)' }
                    : undefined
                }
                whileTap={!shouldReduceMotion && canSubmit && !isLoading ? { scale: 0.992 } : undefined}
              >
                {isLoading ? 'SIGNING IN...' : 'SIGN IN'}
              </motion.button>
            </motion.form>

            <p className="mt-9 text-center text-sm text-[#6a7080] dark:text-[#9fb0c4]">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-semibold text-[#111] dark:text-white">Create Account</Link>
            </p>
          </div>
        </motion.section>
      </main>

      <motion.footer className="border-t border-black/5 bg-white/60 dark:border-white/10 dark:bg-[#111827]/80" {...sideMotion(0.48)}>
        <div className="mx-auto flex max-w-full flex-col items-center justify-between gap-4 px-4 py-5 text-[11px] text-[#6f7380] sm:px-6 md:flex-row lg:px-10 dark:text-[#94a3b8]">
          <span className={`${playfair.className} text-xl text-[#111] dark:text-white`}>GemWorld</span>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="#" className="underline underline-offset-4">PRIVACY POLICY</Link>
            <Link href="#" className="underline underline-offset-4">TERMS OF SERVICE</Link>
            <Link href="#" className="underline underline-offset-4">ETHICAL SOURCING</Link>
            <Link href="#" className="underline underline-offset-4">GIA CERTIFICATION</Link>
          </div>
          <span className="text-center">© 2024 GEMWORLD EDITORIAL. ALL RIGHTS RESERVED.</span>
        </div>
      </motion.footer>
    </div>
  )
}
