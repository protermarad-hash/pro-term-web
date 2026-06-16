'use client';

import { useEffect } from 'react';
import { trackContactPageView } from '@/lib/analytics';

export default function ContactPageViewTracker() {
  useEffect(() => {
    trackContactPageView();
  }, []);

  return null;
}
