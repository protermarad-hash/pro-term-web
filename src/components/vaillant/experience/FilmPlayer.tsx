'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Play } from 'lucide-react';
import type { VideoAsset } from '@/lib/vaillant-experience';

/**
 * Main film: nothing is downloaded until the visitor presses play (no autoplay,
 * no preload), so it never competes with the hero for bandwidth. Captions are
 * attached when the asset provides them.
 */
export default function FilmPlayer({ film, title, playLabel }: { film: VideoAsset; title: string; playLabel: string }) {
  const [started, setStarted] = useState(false);

  if (started) {
    return (
      <video className="aspect-video w-full rounded-3xl bg-black" controls autoPlay playsInline preload="auto" poster={film.poster}>
        {film.webm && <source src={film.webm} type="video/webm" />}
        <source src={film.mp4} type="video/mp4" />
        {film.captions && <track kind="captions" src={film.captions} srcLang="ro" label="Română" default />}
      </video>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setStarted(true)}
      className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-primary-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
      aria-label={`${playLabel}: ${title}`}
    >
      <Image src={film.poster} alt="" fill sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" loading="lazy" />
      <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition group-hover:bg-black/35">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-primary shadow-xl transition group-hover:scale-105">
          <Play size={30} className="ml-1" />
        </span>
      </span>
    </button>
  );
}
