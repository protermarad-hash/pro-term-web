'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Pause, Play } from 'lucide-react';
import type { ImageAsset, VideoAsset } from '@/lib/vaillant-experience';

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
 * Hero background: the official key visual (LCP image, preloaded) with a very
 * slow zoom. When a licensed hero video exists it plays muted in a loop on top,
 * except for reduced-motion users and slow / data-saver connections. The pause
 * control stops both the video and the zoom.
 */
export default function HeroBackdrop({ poster, video }: { poster: ImageAsset; video: VideoAsset | null }) {
  const [paused, setPaused] = useState(false);
  const [playVideo, setPlayVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (video && !prefersStaticMedia()) setPlayVideo(true);
  }, [video]);

  useEffect(() => {
    const element = videoRef.current;
    if (!element) return;
    if (paused) element.pause();
    else void element.play().catch(() => setPaused(true));
  }, [paused, playVideo]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${paused ? 'vx-paused' : ''}`}>
      <div className="vx-kenburns absolute inset-0">
        <Image src={poster.src} alt={poster.alt} fill priority sizes="100vw" className="object-cover object-[70%_50%]" />
      </div>
      {video && playVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={video.poster}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          aria-hidden="true"
        >
          {video.webm && <source src={video.webm} type="video/webm" />}
          <source src={video.mp4} type="video/mp4" />
        </video>
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-[#06131f]/90 via-[#06131f]/55 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06131f]/70 to-transparent" />
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
