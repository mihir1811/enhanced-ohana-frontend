'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    userName: '',
    email: '',
    password: '',
  })
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setFile(file || null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('userName', form.userName)
    formData.append('email', form.email)
    formData.append('password', form.password)
    if (file) formData.append('profilePicture', file)

    try {
      const res = await fetch('http://localhost:3000/api/v1/auth/register', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        // Optionally set role cookie here if backend returns it
        // setCookie('role', data.role)
        router.push('/login')
      } else {
        alert(data.message || 'Registration failed')
      }
    } catch (err) {
      console.error('Register error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="userName">Username</Label>
          <Input id="userName" name="userName" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" id="password" name="password" onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="profilePicture">Profile Picture</Label>
          <Input type="file" id="profilePicture" onChange={handleFileChange} />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </form>
    </div>
  )
}
