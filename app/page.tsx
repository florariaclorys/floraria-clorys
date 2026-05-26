import HeroImmersive, { TickerBar } from '@/components/home/HeroImmersive'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroImmersive />
      <TickerBar />
      <FeaturedProducts />
      <TestimonialsSection />
    </>
  )
}
