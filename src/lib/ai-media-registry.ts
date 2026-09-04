/**
 * Central registry of media assets PRO TERM has reviewed for AI-generation status.
 *
 * Legal framing (do not restate this as a universal obligation elsewhere in the app):
 * EU AI Act (Regulation (EU) 2024/1689), Article 50, separates the transparency
 * duties of AI *providers* (who build generative systems) from those of *deployers*
 * (who merely use AI-generated output, e.g. a marketing image supplied by a
 * manufacturer). PRO TERM is a deployer here, not a provider. This registry does not
 * assert that Article 50 mandates a visible badge on every AI-touched image in every
 * circumstance — it documents PRO TERM's own, stricter, voluntary internal policy:
 * any image PRO TERM publishes that is *confirmed* as substantially AI-generated
 * gets a visible "AI" indicator, regardless of whether a specific legal duty applies
 * to this exact image. Minor AI-assisted retouching (denoising, upscaling, background
 * cleanup on an otherwise real photograph) does not by itself qualify an image as
 * "generated" under this registry — see `aiStatus`. Images of unknown or undocumented
 * origin are never marked as AI-generated without evidence; they are simply not
 * listed here (see `evidenceStandard: 'none'` for how that case is represented if a
 * future entry needs to record "reviewed, inconclusive").
 */

export type AiStatus = 'confirmed-generated' | 'confirmed-assisted' | 'unconfirmed';

export type SourceType = 'official-manufacturer' | 'official-importer' | 'pro-term' | 'third-party';

export type EvidenceStandard = 'c2pa' | 'provider-confirmation' | 'documented-workflow' | 'none';

export interface AiMediaEntry {
  /** Stable identifier, referenced by <AIImage mediaId="..."> — never reused across entries. */
  id: string;
  /** Path under /public, exactly as served — the only src <AIImage> is allowed to render. */
  src: string;
  /** Short internal/display title for this asset. */
  title: string;
  /** Public-facing sentence shown on /transparenta-ai and used as the badge's aria-label/title. */
  publicDisclosure: string;
  /** Who actually produced the asset (not who published it on pro-term.ro). */
  sourceOrganisation: string;
  /** Relationship of that organisation to PRO TERM / the product line. */
  sourceType: SourceType;
  /** PRO TERM's own classification of how much of the image is AI output. */
  aiStatus: AiStatus;
  /** Human-readable description of the concrete evidence reviewed — not a legal conclusion. */
  evidence: string;
  /** Which kind of evidence backs `evidence`. */
  evidenceStandard: EvidenceStandard;
  /** Why PRO TERM is entitled to publish this specific file. */
  rightsBasis: string;
  /** Where/how this asset is used on the site (plain description, not a route list). */
  usageContext: string;
  /** True only if the image depicts an actual PRO TERM job site/installation. */
  representsRealProject: boolean;
  /** True only if the image is an exact, accurate depiction of the specific product sold. */
  representsExactProduct: boolean;
  /** ISO date this entry was last reviewed by a human — not regenerated per request. */
  reviewedAt: string;
  /** Internal reviewer notes — never rendered on the public transparency page. */
  notes: string;
}

export const AI_MEDIA_REGISTRY: readonly AiMediaEntry[] = [
  {
    id: 'midea-aer-proaspat-ai',
    src: '/images/banners/midea/aer-proaspat.jpg',
    title: 'Material promoțional Midea',
    publicDisclosure:
      'Imagine promoțională oficială Midea, generată cu ajutorul inteligenței artificiale.',
    sourceOrganisation: 'Midea / importatorul oficial din România',
    sourceType: 'official-importer',
    aiStatus: 'confirmed-generated',
    evidence:
      'Manifest C2PA (Content Credentials) încorporat în fișier, cu digitalSourceType ' +
      '"trainedAlgorithmicMedia" și descrierea "Created by Google Generative AI".',
    evidenceStandard: 'c2pa',
    rightsBasis:
      'Material oficial utilizat de PRO TERM în baza relației comerciale cu importatorul.',
    usageContext: 'Banner promoțional Midea (carusel de produs)',
    representsRealProject: false,
    representsExactProduct: false,
    reviewedAt: '2026-09-04',
    notes: 'Caracteristicile produsului sunt prezentate separat, pe baza documentației oficiale.',
  },
] as const;

/**
 * Looks up a registry entry by id. Throws rather than silently returning undefined —
 * an <AIImage> pointing at an unknown id is a programming error, not a runtime
 * condition to degrade gracefully from (it would otherwise render with no src/no
 * disclosure text, which is exactly the failure mode this registry exists to prevent).
 */
export function getAiMediaById(id: string): AiMediaEntry {
  const entry = AI_MEDIA_REGISTRY.find((e) => e.id === id);
  if (!entry) {
    throw new Error(`ai-media-registry: no entry registered for id "${id}"`);
  }
  return entry;
}
