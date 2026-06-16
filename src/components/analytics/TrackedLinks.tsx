'use client';

import { AnchorHTMLAttributes } from 'react';
import Link, { type LinkProps } from 'next/link';
import { trackPhoneClick, trackWhatsAppClick, trackContactClick } from '@/lib/analytics';

type TrackedAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  ctaLocation: string;
  serviceType?: string;
  city?: string;
};

export function TrackedPhoneLink({ ctaLocation, serviceType, city, onClick, ...rest }: TrackedAnchorProps) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...rest}
      onClick={(e) => {
        trackPhoneClick({ cta_location: ctaLocation, service_type: serviceType, city });
        onClick?.(e);
      }}
    />
  );
}

export function TrackedWhatsAppLink({ ctaLocation, serviceType, city, onClick, ...rest }: TrackedAnchorProps) {
  return (
    // eslint-disable-next-line jsx-a11y/anchor-has-content
    <a
      {...rest}
      onClick={(e) => {
        trackWhatsAppClick({ cta_location: ctaLocation, service_type: serviceType, city });
        onClick?.(e);
      }}
    />
  );
}

type TrackedContactLinkProps = LinkProps & {
  ctaLocation: string;
  serviceType?: string;
  city?: string;
  className?: string;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
};

export function TrackedContactLink({ ctaLocation, serviceType, city, onClick, ...rest }: TrackedContactLinkProps) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackContactClick({ cta_location: ctaLocation, service_type: serviceType, city });
        onClick?.(e);
      }}
    />
  );
}
