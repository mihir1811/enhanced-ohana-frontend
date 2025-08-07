'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function LoginPage() {
  const router = useRouter()

  const [form, setForm] = useState({ userName: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)

  try {
    const res = await fetch('http://localhost:3000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(form),
    })

    const result = await res.json()

    if (res.ok && result.success) {
      const { accessToken, user } = result.data

      // ✅ Store access token in localStorage (or cookie)
      localStorage.setItem('accessToken', accessToken)

      // ✅ Optionally set cookie for middleware role guard
      document.cookie = `role=${user.role}; path=/`

      // ✅ Redirect based on role
      if (user.role === 'seller') {
        router.push('/seller/dashboard')
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/')
      }
    } else {
      setError(result.message || 'Login failed')
    }
  } catch (err) {
    console.error(err)
    setError('Something went wrong. Try again.')
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="userName">Username</Label>
          <Input id="userName" name="userName" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}
