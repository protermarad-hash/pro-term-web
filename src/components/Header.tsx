'use client';

import { useState, useEffect } from 'react';
import { Phone, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Servicii', href: '#servicii' },
  { label: 'Despre noi', href: '#despre' },
  { label: 'Avantaje', href: '#avantaje' },
  { label: 'Contact', href: '#contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-card py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-hero-gradient flex items-center justify-center">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          <span
            className={`font-heading font-bold text-xl tracking-tight transition-colors ${
              scrolled ? 'text-dark' : 'text-white'
            }`}
          >
            FRIGO<span className="text-accent">TERM</span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-medium text-sm transition-colors hover:text-accent ${
                scrolled ? 'text-dark-300' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:+40700000000"
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            <Phone size={16} />
            0700 000 000
          </a>
          <a href="#contact" className="btn-primary py-2 px-5 text-sm">
            Ofertă gratuită
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className={`md:hidden p-2 rounded-lg ${
            scrolled ? 'text-dark' : 'text-white'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Meniu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-dark-300 font-medium py-2 hover:text-accent transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a href="tel:+40700000000" className="flex items-center gap-2 text-primary font-semibold py-2">
              <Phone size={16} />
              0700 000 000
            </a>
            <a href="#contact" className="btn-primary text-center">
              Ofertă gratuită
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
