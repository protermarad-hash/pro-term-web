'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import { AI_VIDEO_NOTICE, pickHeroVideo, type HeroVideo, type ImageAsset, type VideoAsset } from '@/lib/vaillant-experience';

interface NetworkInformationLike {
  saveData?: boolean;
  effectiveType?: string;
}

function prefersStaticMedia(): boolean {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return true;
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return Boolean(connection?.saveData || (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)));
}

/**
 * Hero background. The official key visual is always rendered first (LCP image,
 * and the static fallback). When a hero film exists it is chosen per viewport
 * (portrait on phones, landscape otherwise), plays muted in a loop and fades in
 * only once it is actually playing — except for reduced-motion users and slow /
 * data-saver connections, who keep the static image. The pause control stops
 * both the film and the slow zoom.
 */
export default function HeroBackdrop({ poster, video }: { poster: ImageAsset; video: HeroVideo | null }) {
  const [paused, setPaused] = useState(false);
  const [source, setSource] = useState<VideoAsset | null>(null);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!video || prefersStaticMedia()) return;
    const portrait = window.matchMedia('(max-width: 767px), (orientation: portrait)').matches;
    setSource(pickHeroVideo(video, portrait));
  }, [video]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (paused) element.pause();
    else void element.play().catch(() => setPaused(true));
  }, [paused, source]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${paused ? 'vx-paused' : ''}`}>
      <div className="vx-kenburns absolute inset-0">
        <Image src={poster.src} alt={poster.alt} fill priority sizes="100vw" className="object-cover object-[70%_50%]" />
      </div>
      {source && (
        <video
          ref={videoRef}
          key={source.mp4}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${playing ? 'opacity-100' : 'opacity-0'}`}
          poster={source.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
          onPlaying={() => setPlaying(true)}
        >
          {source.webm && <source src={source.webm} type="video/webm" />}
          <source src={source.mp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06131f]/90 via-[#06131f]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06131f]/70 to-transparent" />
      {source && playing && video?.aiGenerated && (
        <p className="absolute bottom-6 left-4 right-20 z-10 text-[11px] text-white/70 md:left-auto md:right-20 md:max-w-sm md:text-right" data-testid="ai-video-notice">
          {AI_VIDEO_NOTICE}
        </p>
      )}
      <button
        type="button"
        onClick={() => setPaused((value) => !value)}
        aria-pressed={paused}
        aria-label={paused ? 'Pornește animația de fundal' : 'Oprește animația de fundal'}
        className="absolute bottom-5 right-5 z-10 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur transition hover:bg-black/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {paused ? <Play size={18} /> : <Pause size={18} />}
      </button>
    </div>
  );
}
