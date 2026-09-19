'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, Phone, ShoppingCart, User, X } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { SHIPPING_FREE_THRESHOLD } from '@/lib/shipping';

const navLinks = [
  { label: 'Produse', href: '/produse' },
  { label: 'Multisplit', href: '/multisplit' },
  { label: 'Servicii', href: '/servicii' },
  { label: 'Proiecte HVAC', href: '/servicii/proiecte-hvac-romania' },
  { label: 'Calculator BTU', href: '/calculator-btu' },
  { label: 'Blog', href: '/blog' },
  { label: 'Despre noi', href: '/despre' },
  { label: 'Contact', href: '/#contact' },
];

const contactPhone = '0749 025 610';
const contactPhoneHref = 'tel:+40749025610';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const { totalItems, openCart } = useCart();
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const desktopViewport = window.matchMedia('(min-width: 1280px)');
    const closeMenuOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktopViewport.addEventListener('change', closeMenuOnDesktop);
    return () => desktopViewport.removeEventListener('change', closeMenuOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        requestAnimationFrame(() => menuButtonRef.current?.focus());
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    requestAnimationFrame(() => firstMenuLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const accountHref = user ? '/cont/profil' : '/cont/autentificare';
  const accountLabel = user ? 'Contul meu' : 'Intră în cont';
  const navigationColor = scrolled ? 'text-slate-700' : 'text-white/85';

  const closeMenu = () => setMenuOpen(false);
  const handleCartClick = () => {
    closeMenu();
    openCart();
  };

  return (
    <header className={`fixed inset-x-0 top-0 ${menuOpen ? 'z-[100]' : 'z-50'}`}>
      <div className="border-b border-white/10 bg-primary-800 text-white">
        <div className="mx-auto flex h-8 max-w-7xl items-center justify-between px-4 text-[11px] font-semibold sm:px-6 lg:px-8">
          <span className="truncate text-white/75">
            Livrare gratuită la comenzi peste{' '}
            {SHIPPING_FREE_THRESHOLD.toLocaleString('ro-RO')} RON
          </span>
          <a
            href={contactPhoneHref}
            className="ml-4 hidden items-center gap-2 text-white transition-colors hover:text-accent-200 sm:flex"
          >
            <Phone size={13} aria-hidden="true" />
            Consultanță: {contactPhone}
          </a>
        </div>
      </div>

      <div
        className={`border-b transition-colors duration-200 ${
          scrolled
            ? 'border-slate-200 bg-white/95 shadow-card backdrop-blur-xl'
            : 'border-white/10 bg-primary/90 backdrop-blur-xl'
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center rounded-xl bg-white px-2 py-1 shadow-sm ring-1 ring-slate-200/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-label="PRO TERM — pagina principală"
          >
            <Image
              src="/logo-proterm.jpg"
              alt="PRO TERM — Soluții HVAC Complete"
              width={180}
              height={62}
              className="h-11 w-auto object-contain sm:h-12"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-4 xl:flex" aria-label="Navigare principală">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-[13px] font-semibold transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${navigationColor}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-1.5 xl:flex">
            <button
              type="button"
              onClick={openCart}
              className={`relative rounded-xl p-2.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                scrolled ? 'text-primary hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label={`Coș de cumpărături${totalItems ? `, ${totalItems} produse` : ''}`}
            >
              <ShoppingCart size={20} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {!authLoading && (
              <Link
                href={accountHref}
                className={`flex items-center gap-2 rounded-xl p-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent 2xl:px-3 ${
                  scrolled ? 'text-primary hover:bg-slate-100' : 'text-white hover:bg-white/10'
                }`}
                aria-label={accountLabel}
              >
                <User size={20} aria-hidden="true" />
                <span className="hidden 2xl:inline">{accountLabel}</span>
              </Link>
            )}

            <Link
              href="/#contact"
              className="ml-1 inline-flex items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Solicită o ofertă
            </Link>
          </div>

          <div className="flex items-center gap-1 xl:hidden">
            <button
              type="button"
              onClick={handleCartClick}
              className={`relative flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
              aria-label={`Coș de cumpărături${totalItems ? `, ${totalItems} produse` : ''}`}
            >
              <ShoppingCart size={21} aria-hidden="true" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-0.5 text-[9px] font-bold text-white">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </button>

            {!authLoading && (
              <Link
                href={accountHref}
                className={`flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  scrolled ? 'text-primary' : 'text-white'
                }`}
                aria-label={accountLabel}
              >
                <User size={21} aria-hidden="true" />
              </Link>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                scrolled ? 'text-primary' : 'text-white'
              }`}
              onClick={() => setMenuOpen((isOpen) => !isOpen)}
              aria-label={menuOpen ? 'Închide meniul' : 'Deschide meniul'}
              aria-expanded={menuOpen}
              aria-controls={menuId}
            >
              {menuOpen ? <X size={23} aria-hidden="true" /> : <Menu size={23} aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id={menuId}
          className="max-h-[calc(100vh-6.75rem)] overflow-y-auto border-b border-slate-200 bg-white shadow-2xl xl:hidden"
        >
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8"
            aria-label="Navigare mobilă"
          >
            {navLinks.map((link, index) => (
              <Link
                key={link.href}
                ref={index === 0 ? firstMenuLinkRef : undefined}
                href={link.href}
                className="border-b border-slate-100 py-3 text-base font-semibold text-dark transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={closeMenu}
              >
                {link.label}
              </Link>
            ))}

            <Link
              href={accountHref}
              className="flex items-center gap-2 border-b border-slate-100 py-3 text-base font-semibold text-dark hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              onClick={closeMenu}
            >
              <User size={18} aria-hidden="true" />
              {accountLabel}
            </Link>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={contactPhoneHref}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-primary/15 px-5 py-3 font-bold text-primary hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={closeMenu}
              >
                <Phone size={18} aria-hidden="true" />
                {contactPhone}
              </a>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-3 font-bold text-white shadow-accent hover:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                onClick={closeMenu}
              >
                Solicită o ofertă
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
