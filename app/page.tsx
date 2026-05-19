import HeroSection from '@/components/home/HeroSection'
import CategoryGrid from '@/components/home/CategoryGrid'
import FeaturedProducts from '@/components/home/FeaturedProducts'
import TestimonialsSection from '@/components/home/TestimonialsSection'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryGrid />
      <FeaturedProducts />
      <TestimonialsSection />
    </>
  )
}
