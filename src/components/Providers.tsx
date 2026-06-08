'use client';

import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import CartDrawer from './CartDrawer';
import WhatsAppFloat from './WhatsAppFloat';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
          <CartDrawer />
          <WhatsAppFloat />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
