"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Menu, Search, ShoppingCart, Heart, ChevronDown } from "lucide-react"
import ThemeSwitcher from "../ThemeSwitcher"
import { SECTION_WIDTH } from "../../lib/constants"

type NavChild = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href: string
  children?: NavChild[]
}

const navItems: NavItem[] = [
  {
    label: "Diamonds",
    href: "/diamonds",
    children: [
      { label: "Natural Single", href: "/diamonds?diamondType=natural&category=single" },
      { label: "Natural Melee", href: "/diamonds?diamondType=natural&category=melee" },
      { label: "Lab Grown Single", href: "/diamonds?diamondType=lab-grown&category=single" },
      { label: "Lab Grown Melee", href: "/diamonds?diamondType=lab-grown&category=melee" }
    ]
  },
  {
    label: "Gemstones",
    href: "/gemstones",
    children: [
      { label: "Single Gemstones", href: "/gemstones?category=single" },
      { label: "Melee Gemstones", href: "/gemstones?category=melee" }
    ]
  },
  {
    label: "Jewelry",
    href: "/jewelry",
    children: [
      { label: "Rings", href: "/jewelry/rings" },
      { label: "Earrings", href: "/jewelry/earrings" },
      { label: "Necklaces", href: "/jewelry/necklaces" }
    ]
  },
  {
    label: "Watches",
    href: "/watches"
  },
  {
    label: "Bullions",
    href: "/bullions"
  },
  {
    label: "Auctions",
    href: "/auctions"
  },
  {
    label: "Experience the Diamond",
    href: "/experience-the-diamond"
  }
]

const NavigationUser = () => {
  const { user } = useSelector((state: RootState) => state.auth)

  const [searchQuery, setSearchQuery] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState<string | null>(null)
  const [navDropdownPosition, setNavDropdownPosition] = useState<{ left: number } | null>(null)

  const profileRef = useRef<HTMLDivElement | null>(null)
  const navBarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false)
      }
      if (navBarRef.current && !navBarRef.current.contains(target)) {
        setActiveNav(null)
        setNavDropdownPosition(null)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileOpen(false)
        setActiveNav(null)
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
    >
      <div className={`mx-auto flex max-w-[${SECTION_WIDTH}px] items-center justify-between gap-3 px-4 py-3 sm:px-4 lg:px-4`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/user" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 text-white shadow">
              <span className="text-sm font-semibold">OH</span>
            </div>
            <span className="hidden text-sm font-semibold tracking-tight text-foreground sm:inline">
              Ohana Marketplace
            </span>
          </Link>
        </div>

        <form
          onSubmit={handleSearchSubmit}
          className="hidden flex-1 items-center justify-center px-4 lg:flex"
        >
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search diamonds, gemstones, jewelry..."
              className="w-full rounded-full border border-input bg-input px-9 py-2 text-sm text-foreground shadow-sm outline-none ring-0 transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/40"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 sm:gap-2">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center lg:hidden"
          >
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-32 rounded-full border border-input bg-input px-7 py-1.5 text-xs text-foreground outline-none ring-0 focus:border-amber-500 focus:ring-1 focus:ring-amber-500/40 sm:w-40"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </form>

          <Link
            href="/user/wishlist"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
          </Link>

          <Link
            href="/user/cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </Link>

          <div className="hidden sm:flex">
            <ThemeSwitcher />
          </div>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-input bg-background px-2 pl-2.5 pr-2.5 text-xs text-foreground shadow-sm hover:bg-muted"
              aria-haspopup="true"
              aria-expanded={profileOpen}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-[11px] font-semibold text-white">
                {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
              </div>
              <div className="hidden text-left sm:block">
                <div className="max-w-[90px] truncate text-[11px] font-medium">
                  {user?.name || user?.email || "Guest"}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {user ? "Account" : "Sign in"}
                </div>
              </div>
              <ChevronDown
                className={`h-3 w-3 text-muted-foreground transition-transform ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 text-sm text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:text-white z-10">
                {user ? (
                  <>
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      Signed in as
                      <div className="truncate text-[11px] font-medium text-foreground">
                        {user.email}
                      </div>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                      href="/user"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href="/user/profile"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Profile</span>
                    </Link>
                    <Link
                      href="/user/orders"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Orders</span>
                    </Link>
                    <Link
                      href="/user/wishlist"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Wishlist</span>
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                      type="button"
                      className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-red-600 hover:bg-red-50"
                    >
                      <span>Sign out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Sign in</span>
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center justify-between rounded-lg px-2 py-1.5 hover:bg-muted"
                      onClick={() => setProfileOpen(false)}
                    >
                      <span>Create account</span>
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="border-t"
        style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
      >
        <div
          ref={navBarRef}
          className="relative mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2 text-sm text-muted-foreground sm:px-6 lg:px-8"
        >
          <nav className="flex flex-1 items-center gap-4 overflow-x-auto scrollbar-hide lg:justify-between">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0
              const isActive = activeNav === item.label

              return (
                <div
                  key={item.label}
                  className="relative flex-shrink-0"
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                    onClick={(e) => {
                      if (!hasChildren) {
                        window.location.href = item.href
                        return
                      }

                      if (!navBarRef.current) {
                        setActiveNav((current) => (current === item.label ? null : item.label))
                        return
                      }

                      const isCurrentlyActive = isActive

                      if (isCurrentlyActive) {
                        setActiveNav(null)
                        setNavDropdownPosition(null)
                        return
                      }

                      const navRect = navBarRef.current.getBoundingClientRect()
                      const btnRect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect()

                      let left = btnRect.left - navRect.left
                      const maxLeft = navRect.width - 260
                      if (left > maxLeft) {
                        left = Math.max(0, maxLeft)
                      }

                      setNavDropdownPosition({ left })
                      setActiveNav(item.label)
                    }}
                  >
                    <span>{item.label}</span>
                    {hasChildren && (
                      <ChevronDown
                        className={`h-3 w-3 text-muted-foreground transition-transform ${isActive ? "rotate-180" : ""}`}
                      />
                    )}
                  </button>
                </div>
              )
            })}
          </nav>

          {activeNav &&
            navDropdownPosition &&
            navItems.find((item) => item.label === activeNav)?.children &&
            navItems.find((item) => item.label === activeNav)?.children!.length > 0 && (
              <div
                className="absolute top-full z-40 mt-2"
                style={{ left: navDropdownPosition.left }}
              >
                <div className="inline-block max-h-[22rem] overflow-y-auto rounded-xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-800 dark:bg-black dark:text-white">
                  <div className="flex flex-col gap-1 p-2">
                    {navItems
                      .find((item) => item.label === activeNav)
                      ?.children!.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center justify-between rounded-lg px-3 py-1.5 text-xs hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => {
                            setActiveNav(null)
                            setNavDropdownPosition(null)
                          }}
                        >
                          <span>{child.label}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              </div>
            )}
        </div>

        {mobileMenuOpen && (
          <div
            className="border-t lg:hidden"
            style={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
          >
            <nav className="mx-auto flex max-w-[1400px] flex-col gap-1 px-4 py-3 text-sm text-foreground sm:px-6">
              {navItems.map((item) => (
                <div key={item.label} className="flex flex-col">
                  <Link
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-muted"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.label}</span>
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Link>
                  {item.children && item.children.length > 0 && (
                    <div className="ml-3 flex flex-col gap-0.5 border-l border-border/60 pl-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="rounded-lg px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default NavigationUser
