'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import FloatingUI from './FloatingUI'
import FeaturesBar from '@/components/home/FeaturesBar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  const isAdmin = path.startsWith('/admin')

  if (isAdmin) return <>{children}</>

  return (
    <>
      <Header />
      <FeaturesBar />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingUI />
    </>
  )
}
