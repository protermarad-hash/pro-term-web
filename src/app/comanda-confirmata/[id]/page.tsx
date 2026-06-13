import type { Metadata } from 'next';
import ComandaConfirmataClient from './ComandaConfirmataClient';

export const metadata: Metadata = {
  title: 'Comandă confirmată',
  robots: { index: false, follow: false },
};

export default function ComandaConfirmataPage() {
  return <ComandaConfirmataClient />;
}
