import type { Metadata } from 'next';
import AutentificareClient from './AutentificareClient';

export const metadata: Metadata = {
  title: 'Autentificare',
  robots: { index: false, follow: false },
};

export default function AutentificarePage() {
  return <AutentificareClient />;
}
