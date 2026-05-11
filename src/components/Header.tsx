'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

const navLinks = [
  { label: 'Servicii',    href: '/#servicii' },
  { label: 'Produse',     href: '/produse' },
  { label: 'Despre noi',  href: '/despre' },
  { label: 'Avantaje',    href: '/#avantaje' },
  { label: 'Contact',     href: '/#contact' },
];

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { totalItems, openCart }  = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textColor   = scrolled ? 'text-dark-300' : 'text-white/90';
  const bgClass     = scrolled
    ? 'bg-white/95 backdrop-blur-md shadow-card py-3'
    : 'bg-transparent py-5';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-proterm.jpg"
            alt="PROTERM"
            width={160}
            height={48}
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium text-sm transition-colors hover:text-accent ${textColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+40700000000"
            className={`flex items-center gap-1.5 text-sm font-semibold transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            <Phone size={15} />
            0700 000 000
          </a>

          {/* Cart icon */}
          <button
            onClick={openCart}
            className={`relative p-2 rounded-lg transition-colors ${
              scrolled ? 'hover:bg-gray-100 text-dark' : 'hover:bg-white/10 text-white'
            }`}
            aria-label="Coș de cumpărături"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          <Link href="/#contact" className="btn-primary py-2 px-5 text-sm">
            Ofertă gratuită
          </Link>
        </div>

        {/* Mobile: cart + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={openCart}
            className={`relative p-2 rounded-lg ${scrolled ? 'text-dark' : 'text-white'}`}
            aria-label="Coș"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            className={`p-2 rounded-lg ${scrolled ? 'text-dark' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Meniu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark-300 font-medium py-2 hover:text-accent transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="tel:+40700000000"
              className="flex items-center gap-2 text-primary font-semibold py-2"
            >
              <Phone size={16} />
              0700 000 000
            </a>
            <Link href="/#contact" className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
              Ofertă gratuită
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
