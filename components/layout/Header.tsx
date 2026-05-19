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
            {/* Teddy bear SVG */}
            <svg width="52" height="56" viewBox="0 0 52 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 drop-shadow-sm">
              {/* Ears */}
              <circle cx="10" cy="13" r="7" fill="#E8D5B0"/>
              <circle cx="10" cy="13" r="4" fill="#D4B896"/>
              <circle cx="42" cy="13" r="7" fill="#E8D5B0"/>
              <circle cx="42" cy="13" r="4" fill="#D4B896"/>
              {/* Body */}
              <ellipse cx="26" cy="40" rx="15" ry="14" fill="#E8D5B0"/>
              {/* Belly */}
              <ellipse cx="26" cy="42" rx="8" ry="7" fill="#D4B896"/>
              {/* Head */}
              <circle cx="26" cy="22" r="14" fill="#E8D5B0"/>
              {/* Snout */}
              <ellipse cx="26" cy="27" rx="6" ry="4" fill="#D4B896"/>
              {/* Eyes */}
              <circle cx="21" cy="20" r="2" fill="#3D2010"/>
              <circle cx="31" cy="20" r="2" fill="#3D2010"/>
              {/* Eye shine */}
              <circle cx="22" cy="19" r="0.7" fill="white"/>
              <circle cx="32" cy="19" r="0.7" fill="white"/>
              {/* Nose */}
              <ellipse cx="26" cy="25" rx="2" ry="1.5" fill="#3D2010"/>
              {/* Smile */}
              <path d="M22 28 Q26 31 30 28" stroke="#3D2010" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
              {/* Left arm holding rose */}
              <ellipse cx="12" cy="38" rx="4.5" ry="8" fill="#E8D5B0" transform="rotate(-20 12 38)"/>
              {/* Right arm */}
              <ellipse cx="40" cy="38" rx="4.5" ry="8" fill="#E8D5B0" transform="rotate(20 40 38)"/>
              {/* Rose stem */}
              <line x1="14" y1="44" x2="14" y2="28" stroke="#4a7c4e" strokeWidth="1.5" strokeLinecap="round"/>
              {/* Rose leaves */}
              <ellipse cx="11" cy="36" rx="3.5" ry="1.5" fill="#5a9e5e" transform="rotate(-30 11 36)"/>
              {/* Rose flower */}
              <circle cx="14" cy="26" r="5" fill="#C0392B"/>
              <circle cx="14" cy="26" r="3.5" fill="#E74C3C"/>
              <ellipse cx="12" cy="24" rx="2.5" ry="2" fill="#C0392B" transform="rotate(-20 12 24)"/>
              <ellipse cx="16" cy="24" rx="2.5" ry="2" fill="#C0392B" transform="rotate(20 16 24)"/>
              <circle cx="14" cy="26" r="1.5" fill="#922B21"/>
              {/* Bow on head */}
              <path d="M20 10 Q23 8 26 10 Q23 12 20 10Z" fill="#C4708A"/>
              <path d="M32 10 Q29 8 26 10 Q29 12 32 10Z" fill="#C4708A"/>
              <circle cx="26" cy="10" r="2" fill="#A0506A"/>
            </svg>
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
