import HeroSection from '@/components/home/HeroSection'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'
import ClosedPopup from '@/components/ui/ClosedPopup'

export default function HomePage() {
  return (
    <>
      <ClosedPopup />
      <HeroSection />
      <FeaturedProducts />
      <TestimonialsSection />
    </>
  )
}
