import type { Metadata } from 'next'
import NavigationAdmin from '../../components/Navigation/NavigationAdmin'

export const metadata: Metadata = {
  title: 'Admin Dashboard - Gem World',
  description: 'Manage the Gem World marketplace, users, and system settings.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <NavigationAdmin />
      
      {/* Main Content */}
      <main className="admin-layout">
        {children}
      </main>
    </div>
  )
}