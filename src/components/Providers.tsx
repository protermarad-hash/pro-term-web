'use client';

import { CartProvider } from '@/lib/cart-context';
import CartDrawer from './CartDrawer';
import CookieConsent from './CookieConsent';
import WhatsAppFloat from './WhatsAppFloat';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <WhatsAppFloat />
      <CookieConsent />
    </CartProvider>
  );
}
