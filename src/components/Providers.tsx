'use client';

import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { FavoritesProvider } from '@/lib/favorites-context';
import CartDrawer from './CartDrawer';
import MontajUpsellModal from './MontajUpsellModal';
import StockToast from './StockToast';
import WhatsAppFloat from './WhatsAppFloat';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
          <CartDrawer />
          <MontajUpsellModal />
          <StockToast />
          <WhatsAppFloat />
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
