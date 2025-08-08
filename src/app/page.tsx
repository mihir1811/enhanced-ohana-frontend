'use client'

import { useAppSelector } from '@/store/hooks'

export default function HomePage() {
  const { role, user } = useAppSelector((state) => state.auth)

  if (role === 'user') {
    return (
      <div>
        <h1>Welcome back, {user?.name || 'User'} 👋</h1>
        <p>Here’s your personalized homepage.</p>
        {/* Add user-specific widgets */}
      </div>
    )
  }

  return (
    <div>
      <h1>Welcome to Our Website 🌍</h1>
      <p>This is the public landing page.</p>
    </div>
  )
}
