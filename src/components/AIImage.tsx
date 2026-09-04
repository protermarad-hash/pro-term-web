import Image from 'next/image';
import Link from 'next/link';
import { getAiMediaById } from '@/lib/ai-media-registry';

type BaseProps = {
  mediaId: string;
  alt: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
  onError?: () => void;
};

type FillProps = BaseProps & {
  fill: true;
  sizes: string;
  width?: never;
  height?: never;
};

type SizedProps = BaseProps & {
  fill?: false;
  width: number;
  height: number;
  sizes?: string;
};

export type AIImageProps = FillProps | SizedProps;

/**
 * next/image wrapper for assets registered in ai-media-registry.ts. The `src` is never
 * a prop — it is always resolved from the registry by `mediaId`, so a caller cannot
 * point this component at an unregistered/arbitrary file and accidentally carry the
 * "AI" badge and disclosure text somewhere they don't apply. Unknown mediaId throws
 * (via getAiMediaById), which is deliberate: this should fail a build/render, not
 * silently render an unmarked image.
 */
export default function AIImage(props: AIImageProps) {
  const { mediaId, alt, className, priority, quality, unoptimized, onError } = props;
  const entry = getAiMediaById(mediaId);

  return (
    <div
      className={props.fill ? 'relative h-full w-full' : 'relative inline-block'}
      data-ai-generated="true"
      data-ai-media-id={entry.id}
    >
      {props.fill ? (
        <Image
          src={entry.src}
          alt={alt}
          fill
          sizes={props.sizes}
          className={className}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          onError={onError}
          data-ai-generated="true"
        />
      ) : (
        <Image
          src={entry.src}
          alt={alt}
          width={props.width}
          height={props.height}
          sizes={props.sizes}
          className={className}
          priority={priority}
          quality={quality}
          unoptimized={unoptimized}
          onError={onError}
          data-ai-generated="true"
        />
      )}

      <Link
        href="/transparenta-ai"
        aria-label={entry.publicDisclosure}
        title={entry.publicDisclosure}
        className="absolute bottom-2 right-2 z-10 flex h-11 w-11 items-center justify-center rounded-lg bg-primary text-xs font-bold tracking-wide text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        AI
      </Link>
    </div>
  );
}
