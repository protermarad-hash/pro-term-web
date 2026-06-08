import type { Metadata } from 'next';
import ProfilClient from './ProfilClient';

export const metadata: Metadata = {
  title: 'Profilul meu',
  robots: { index: false, follow: false },
};

export default function ProfilPage() {
  return <ProfilClient />;
}
