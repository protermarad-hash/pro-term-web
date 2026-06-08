'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu, X, ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { SHIPPING_FREE_THRESHOLD } from '@/lib/shipping';

const navLinks = [
  { label: 'Servicii',       href: '/servicii' },
  { label: 'Produse',        href: '/produse' },
  { label: 'Calculator BTU', href: '/calculator-btu' },
  { label: 'Blog',           href: '/blog' },
  { label: 'Despre noi',     href: '/despre' },
  { label: 'Avantaje',       href: '/#avantaje' },
  { label: 'Contact',        href: '/#contact' },
];

const contactPhone = '0749 025 610';
const contactPhoneHref = 'tel:+40749025610';

export default function Header() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const { totalItems, openCart }  = useCart();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const textColor = scrolled ? 'text-dark-300' : 'text-slate-100';
  const bgClass = scrolled
    ? 'bg-white/95 backdrop-blur-xl shadow-card py-3 border-b border-slate-100'
    : 'bg-primary/85 backdrop-blur-xl py-4 border-b border-white/10';

  const accountHref  = user ? '/cont/profil' : '/cont/autentificare';
  const accountLabel = user ? 'Contul meu' : 'Intră în cont';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
      {!scrolled && (
        <div className="bg-primary/95 border-b border-white/10 py-1.5 text-center text-xs font-medium text-white/80">
          Transport gratuit la comenzi peste {SHIPPING_FREE_THRESHOLD.toLocaleString('ro-RO')} RON
        </div>
      )}
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-slate-100">
            <Image
              src="/logo-proterm.jpg"
              alt="PROTERM"
              width={150}
              height={45}
              className="h-9 w-auto object-contain"
              priority
            />
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-semibold text-sm transition-colors hover:text-accent ${textColor}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href={contactPhoneHref}
            className={`flex items-center gap-1.5 text-sm font-bold transition-colors ${
              scrolled ? 'text-primary hover:text-accent' : 'text-white hover:text-accent-200'
            }`}
          >
            <Phone size={15} />
            {contactPhone}
          </a>

          <button
            onClick={openCart}
            className={`relative p-2.5 rounded-xl transition-colors ${
              scrolled ? 'hover:bg-slate-100 text-dark' : 'hover:bg-white/10 text-white'
            }`}
            aria-label="Coș de cumpărături"
          >
            <ShoppingCart size={20} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </button>

          {!authLoading && (
            <Link
              href={accountHref}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                scrolled
                  ? 'border border-slate-200 text-dark hover:border-primary hover:text-primary'
                  : 'border border-white/30 text-white hover:bg-white/10'
              }`}
            >
              <User size={15} />
              {accountLabel}
            </Link>
          )}

          <Link href="/#contact" className="btn-primary py-2.5 px-5 text-sm">
            Ofertă gratuită
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={openCart}
            className={`relative p-2 rounded-xl ${scrolled ? 'text-dark' : 'text-white'}`}
            aria-label="Coș"
          >
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          {!authLoading && (
            <Link
              href={accountHref}
              className={`p-2 rounded-xl ${scrolled ? 'text-dark' : 'text-white'}`}
              aria-label={accountLabel}
            >
              <User size={22} />
            </Link>
          )}
          <button
            className={`p-2 rounded-xl ${scrolled ? 'text-dark' : 'text-white'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Meniu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-dark-300 font-semibold py-2 hover:text-accent transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              className="flex items-center gap-2 text-dark-300 font-semibold py-2 hover:text-accent transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <User size={16} />
              {accountLabel}
            </Link>
            <a
              href={contactPhoneHref}
              className="flex items-center gap-2 text-primary font-bold py-2"
            >
              <Phone size={16} />
              {contactPhone}
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
