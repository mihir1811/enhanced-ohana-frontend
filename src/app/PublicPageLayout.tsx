import Footer from '@/components/Footer'
import NavigationUser from '@/components/Navigation/NavigationUser'
import React from 'react'

const PublicPageLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <>
      {/* Navigation Header */}
      <NavigationUser />
      
      {/* Main Content */}
      <main>
        {children}
      </main>
      
      {/* Footer */}
      <Footer />
    </>
  )
}

export default PublicPageLayout
