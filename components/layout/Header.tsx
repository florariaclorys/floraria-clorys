'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ShoppingBag, Menu, X, User } from 'lucide-react'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { cartCount } = useCart()
  const isHome = pathname === '/'

  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const navLinks = [
    { href: '/', label: 'Acasă' },
    { href: '/catalog', label: 'Catalog' },
    { href: '/contact', label: 'Contact' },
  ]

  const headerBg = isHome && !isScrolled
    ? 'bg-transparent'
    : 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-light'

  const textColor = isHome && !isScrolled ? 'text-white' : 'text-textdark'
  const logoColor = isHome && !isScrolled ? 'text-white' : 'text-primary'
  const logoSubColor = isHome && !isScrolled ? 'text-gold' : 'text-gold'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Teddy bears image */}
            <img src="/images/ursulet.png" alt="ursulet" className="h-14 w-auto object-contain flex-shrink-0 drop-shadow-sm" />
            <div className="flex flex-col items-start">
              <span className={`font-lato text-xs tracking-[0.25em] uppercase font-light transition-colors ${logoSubColor}`}>
                Floraria
              </span>
              <span className={`font-cormorant text-3xl font-semibold leading-none tracking-wide transition-colors group-hover:text-accent ${logoColor}`}>
                Clory&apos;s
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-lato text-xs tracking-[0.2em] uppercase font-semibold transition-colors hover:text-accent ${
                  pathname === link.href ? 'text-accent' : textColor
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart + Mobile */}
          <div className="flex items-center gap-4">
            <Link href="/cos" className="relative group">
              <ShoppingBag
                size={22}
                className={`transition-colors group-hover:text-accent ${textColor}`}
              />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center font-lato leading-none">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <Link href="/admin" className="group" aria-label="Admin">
              <User
                size={20}
                className={`transition-colors group-hover:text-accent ${textColor} opacity-40 group-hover:opacity-100`}
              />
            </Link>

            <button
              className={`md:hidden transition-colors hover:text-accent ${textColor}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Meniu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="bg-white border-t border-light px-6 py-4 flex flex-col gap-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={`font-lato text-sm tracking-widest uppercase font-semibold transition-colors hover:text-accent ${
                pathname === link.href ? 'text-accent' : 'text-textdark'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cos"
            onClick={() => setMobileOpen(false)}
            className="font-lato text-sm tracking-widest uppercase font-semibold text-textdark hover:text-accent transition-colors flex items-center gap-2"
          >
            <ShoppingBag size={16} />
            Coș ({cartCount})
          </Link>
        </nav>
      </div>
    </header>
  )
}
