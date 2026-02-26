import NavigationUser from '@/components/Navigation/NavigationUser'
import Footer from '@/components/Footer'

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <NavigationUser />
      <main className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
