'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

export default function FooterAccountLink() {
  const { user } = useAuth();
  return (
    <li>
      <Link
        href={user ? '/cont/profil' : '/cont/autentificare'}
        className="text-white/60 hover:text-white text-sm transition-colors"
      >
        {user ? 'Contul meu' : 'Intră în cont'}
      </Link>
    </li>
  );
}
