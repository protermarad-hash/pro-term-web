'use client';

import { CartProvider } from '@/lib/cart-context';
import CartDrawer from './CartDrawer';
import CookieConsent from './CookieConsent';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
      <CookieConsent />
    </CartProvider>
  );
}
