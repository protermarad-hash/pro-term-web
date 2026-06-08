import type { Metadata } from 'next';
import CheckoutClient from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Finalizează Comanda | PRO TERM SRL',
  description: 'Finalizează comanda ta de echipamente HVAC la PRO TERM SRL.',
  alternates: { canonical: 'https://pro-term.ro/checkout' },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
