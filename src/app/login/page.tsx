// src/app/(public)/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { setCookie } from '@/lilb/cookie-utils'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'user' | 'seller' | 'admin'>('user')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // ✅ Mock login success
    await setCookie('role', role)

    if (role === 'admin') router.push('/admin/dashboard')
    else if (role === 'seller') router.push('/seller/dashboard')
    else router.push('/')
  }

  return (
    <main className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-zinc-900 rounded shadow">
      <h2 className="text-2xl font-bold mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="role">Login As</Label>
          <select
            id="role"
            className="w-full px-3 py-2 border rounded bg-white text-black dark:bg-zinc-800 dark:text-white"
            value={role}
            onChange={e => setRole(e.target.value as any)}
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </main>
  )
}
