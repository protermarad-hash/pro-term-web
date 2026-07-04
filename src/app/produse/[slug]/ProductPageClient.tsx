'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Star,
  CheckCircle2,
  Zap,
  ExternalLink,
  MessageCircle,
  Phone,
  ShieldCheck,
  Truck,
  Wrench,
  Heart,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { buildWhatsAppUrl } from '@/components/WhatsAppFloat';
import { useCart } from '@/lib/cart-context';
import { useFavorites } from '@/lib/favorites-context';
import {
  BRAND_GRADIENT,
  CATEGORY_LABEL,
  getProductAvailability,
  type Product,
} from '@/lib/products';
import { VAT_RATE, vatAmount } from '@/lib/constants';
import { getMontajForBtu } from '@/lib/montaj';
import BannerSlider from '@/components/BannerSlider';

const GREE_OFFICIAL_URLS = {
  clivia: 'https://www.gree.ro/gama-produse/rezidentiale/clivia/',
  fairy: 'https://www.gree.ro/gama-produse/rezidentiale/gama-fairy-lclh/',
  pulsar: 'https://www.gree.ro/gama-produse/rezidentiale/pulsar/',
  bora: 'https://www.gree.ro/gama-produse/rezidentiale/gama-bora-a4-silver/',
  soyal: 'https://www.gree.ro/gama-produse/rezidentiale/soyal/',
  cosmo: 'https://www.gree.ro/gama-produse/rezidentiale/cosmo/',
};

const phoneHref = 'tel:+40749025610';

function cleanCustomerText(text: string): string {
  return text
    .replace(/\s*Preț calculat[^.]*\./gi, '')
    .replace(/\s*Pret calculat[^.]*\./gi, '')
    .replace(/\s*Lista furnizorului este fără TVA\.?/gi, '')
    .trim();
}

function isPublicSpec(label: string, value: string): boolean {
  const internalText = `${label} ${value}`.toLowerCase();
  return ![
    'preț calculat',
    'pret calculat',
    'coloana albă',
    'coloana alba',
    'adaos',
    'furnizorului',
    'timbru verde',
  ].some((term) => internalText.includes(term));
}

function getOfficialUrl(product: Product): string | null {
  if (product.brand !== 'Gree') return null;
  const text = `${product.name} ${product.slug} ${product.smartbillCode ?? ''}`.toLowerCase();

  if (text.includes('clivia')) return GREE_OFFICIAL_URLS.clivia;
  if (text.includes('fairy')) return GREE_OFFICIAL_URLS.fairy;
  if (text.includes('pulsar')) return GREE_OFFICIAL_URLS.pulsar;
  if (text.includes('bora')) return GREE_OFFICIAL_URLS.bora;
  if (text.includes('soyal')) return GREE_OFFICIAL_URLS.soyal;
  if (text.includes('cosmo')) return GREE_OFFICIAL_URLS.cosmo;

  return null;
}

function getDiscountPercent(product: Product) {
  if (!product.originalPrice || product.originalPrice <= product.price || product.price <= 0) return null;
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
}

interface Props {
  product: Product;
  related: Product[];
}

export default function ProductPageClient({ product, related }: Props) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedImage, setSelectedImage] = useState<string | null>(
    product.imageUrl ?? product.galleryImages?.[0] ?? null
  );
  const [imgTransitioning, setImgTransitioning] = useState(false);

  function changeImage(url: string) {
    if (url === selectedImage) return;
    setImgTransitioning(true);
    setTimeout(() => {
      setSelectedImage(url);
      setImgTransitioning(false);
    }, 200);
  }

  const hasPrice = product.price > 0;
  const capacity = product.capacityLabel ?? (product.btu ? `${product.btu.toLocaleString('ro-RO')} BTU` : CATEGORY_LABEL[product.category]);
  const availability = getProductAvailability(product);
  const customerDescription = cleanCustomerText(product.description);
  const publicSpecs = product.specs.filter((spec) => isPublicSpec(spec.label, spec.value));
  const officialUrl = getOfficialUrl(product);
  const discountPercent = getDiscountPercent(product);
  const galleryImages = Array.from(new Set([product.imageUrl, ...(product.galleryImages ?? [])].filter(Boolean))) as string[];
  const serviceProduct = availability.isService;
  const whatsappMessage = `Bună ziua, sunt interesat de ${product.name}. Vă rog să îmi trimiteți detalii/ofertă.`;
  const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

  return (
    <>
      <Header />
      <main className="bg-light-200 pb-20 pt-24">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center gap-2 text-sm text-dark-300">
            <Link href="/" className="transition-colors hover:text-primary">Acasă</Link>
            <span>/</span>
            <Link href="/produse" className="transition-colors hover:text-primary">Produse</Link>
            <span>/</span>
            <span className="truncate font-medium text-dark">{product.name}</span>
          </div>

          <div className="mb-14 grid gap-10 lg:grid-cols-2">
            <div>
              <div className={`relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${BRAND_GRADIENT[product.brand]}`}>
                {selectedImage ? (
                  <Image
                    src={selectedImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="bg-white object-contain p-8"
                    style={{ opacity: imgTransitioning ? 0 : 1, transition: 'opacity 200ms ease-in-out' }}
                  />
                ) : (
                  <>
                    <span className="absolute px-6 text-center font-heading text-8xl font-bold text-white/10 select-none">
                      {product.brand}
                    </span>
                    <div className="relative z-10 text-center text-white">
                      <div className="mb-2 font-heading text-4xl font-bold opacity-70 md:text-5xl">
                        {capacity}
                      </div>
                      <div className="text-lg text-white/80">{CATEGORY_LABEL[product.category]}</div>
                    </div>
                  </>
                )}

                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {discountPercent && (
                    <span className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-extrabold uppercase text-white shadow-sm">
                      -{discountPercent}% reducere
                    </span>
                  )}
                  {product.isNew && <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold uppercase text-white">Nou</span>}
                  {product.isBestseller && <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase text-white">Bestseller</span>}
                </div>

                <span className="absolute right-4 top-4 rounded-lg bg-white/20 px-3 py-1 font-bold text-white backdrop-blur-sm">
                  {product.energyClass}
                </span>
              </div>

              {galleryImages.length > 1 && (
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-5 md:overflow-visible">
                  {galleryImages.map((image) => (
                    <button
                      key={image}
                      onClick={() => changeImage(image)}
                      className={`relative aspect-square flex-shrink-0 w-16 md:w-auto overflow-hidden rounded-xl border bg-white transition-all ${selectedImage === image ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200 hover:border-primary/50'}`}
                    >
                      <Image src={image} alt={product.name} fill sizes="120px" className="object-contain p-1.5" />
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                <span>Imaginile produsului au caracter informativ și pot diferi de produsul real. Designul, culoarea sau accesoriile pot varia în funcție de lot sau actualizările producătorului.</span>
              </div>
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-bold text-primary">{product.brand}</span>
                {['Midea', 'Gree', 'Yamato'].includes(product.brand) && (
                  <span title={`PRO TERM SRL este dealer autorizat ${product.brand} pentru România`} className="flex cursor-help items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700">
                    <ShieldCheck size={11} />
                    Dealer Autorizat
                  </span>
                )}
                <span className="text-sm text-dark-300">{CATEGORY_LABEL[product.category]}</span>
              </div>

              <h1 className="mb-3 font-heading text-3xl font-bold text-dark">{product.name}</h1>

              <div className="mb-4 flex items-center gap-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={16}
                      className={star <= Math.round(product.rating) ? 'fill-accent text-accent' : 'fill-gray-300 text-gray-300'}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-dark">{product.rating}</span>
                <span className="text-sm text-dark-300">({product.reviews} recenzii)</span>
              </div>

              <p className="mb-6 leading-relaxed text-dark-300">{customerDescription || 'Pentru detalii, disponibilitate și recomandarea potrivită spațiului tău, contactează echipa PRO TERM.'}</p>

              <div className="mb-6 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-bold text-dark">{availability.title}</p>
                {availability.detail && (
                  <p className="mt-1 text-sm text-dark-300">{availability.detail}</p>
                )}
              </div>

              <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-white p-4 shadow-card">
                  <ShieldCheck className="mb-2 text-primary" size={22} />
                  <p className="text-sm font-bold text-dark">Garanție & suport</p>
                  <p className="mt-1 text-xs text-dark-300">Asistență după vânzare / instalare</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-card">
                  <Wrench className="mb-2 text-primary" size={22} />
                  <p className="text-sm font-bold text-dark">Montaj disponibil</p>
                  <p className="mt-1 text-xs text-dark-300">Echipă locală în Arad</p>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-card">
                  <Truck className="mb-2 text-primary" size={22} />
                  <p className="text-sm font-bold text-dark">Livrare / ofertă</p>
                  <p className="mt-1 text-xs text-dark-300">Confirmare rapidă telefonic</p>
                </div>
              </div>

              {product.features.length > 0 && (
                <ul className="mb-6 space-y-2">
                  {product.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-primary" />
                      <span className="text-sm text-dark-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              {product.category === 'aer-conditionat' && product.btu && !serviceProduct && (
                <div className="mb-5 overflow-hidden rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 bg-orange-500 px-4 py-2">
                    <span className="text-sm leading-none">⚠️</span>
                    <p className="text-xs font-bold text-white">Montaj disponibil DOAR în Arad și Timiș</p>
                  </div>
                  <div className="flex items-start gap-3 bg-blue-50 p-4">
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
                      <Wrench size={17} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-sm font-bold text-dark">
                        Montaj standard — {getMontajForBtu(product.btu).price.toLocaleString('ro-RO')} RON (cu TVA)
                      </p>
                      <p className="mt-0.5 text-xs text-dark-300">
                        Echipă F-Gas autorizată, garanție 12 luni.{' '}
                        <Link href="/servicii/montaj" className="font-semibold text-primary hover:underline">
                          Vezi ce include →
                        </Link>
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-blue-700">
                        Se propune automat la adăugarea în coș.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-card">
                {discountPercent && product.originalPrice && (
                  <div className="mb-3 inline-flex rounded-full bg-red-50 px-4 py-2 text-sm font-extrabold text-red-700">
                    Ofertă specială: -{discountPercent}% · Economisești {(product.originalPrice - product.price).toLocaleString('ro-RO')} RON
                  </div>
                )}
                <div className="mb-1 flex items-baseline gap-3">
                  <span className="font-heading text-4xl font-bold text-dark">
                    {hasPrice ? `${product.price.toLocaleString('ro-RO')} RON` : product.priceLabel ?? 'Cere ofertă'}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-dark-300 line-through">
                      {product.originalPrice.toLocaleString('ro-RO')} RON
                    </span>
                  )}
                </div>
                {hasPrice && (
                  <div className="mb-4 space-y-0.5 text-xs text-dark-300">
                    <p>Preț cu TVA {Math.round(VAT_RATE * 100)}% inclus</p>
                    <p>din care TVA: <span className="font-semibold">{vatAmount(product.price).toLocaleString('ro-RO')} RON</span></p>
                  </div>
                )}
                {!hasPrice && <div className="mb-4" />}

                <div className="grid gap-3 sm:grid-cols-2">
                  {hasPrice ? (
                    <button onClick={() => addToCart(product)} className="btn-primary justify-center py-4">
                      <ShoppingCart size={20} />
                      Adaugă în coș
                    </button>
                  ) : (
                    <Link href="/#contact" className="btn-primary justify-center py-4">
                      <Zap size={20} />
                      Cere ofertă
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(product)}
                    className={`flex items-center justify-center gap-2 rounded-lg border-2 px-5 py-4 font-semibold transition-all ${
                      isFavorite(product.slug)
                        ? 'border-red-400 bg-red-50 text-red-500 hover:bg-red-100'
                        : 'border-slate-200 text-dark-300 hover:border-red-300 hover:text-red-400'
                    }`}
                  >
                    <Heart size={18} className={isFavorite(product.slug) ? 'fill-red-500' : ''} />
                    {isFavorite(product.slug) ? 'Șterge din favorite' : 'Adaugă la favorite'}
                  </button>
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-5 py-4 font-semibold text-white transition-all hover:bg-green-600">
                    <MessageCircle size={18} />
                    Întreabă pe WhatsApp
                  </a>
                  <a href={phoneHref} className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary px-5 py-4 font-semibold text-primary transition-all hover:bg-primary hover:text-white sm:col-span-2">
                    <Phone size={18} />
                    Sună pentru confirmare: 0749 025 610
                  </a>
                </div>

                <p className="mt-3 flex items-center gap-1 text-xs text-dark-300">
                  <CheckCircle2 size={13} className="text-green-500" />
                  Prețul, stocul și disponibilitatea montajului se confirmă înainte de livrare/intervenție.
                </p>
              </div>
            </div>
          </div>

          {product.slug.includes('breezeless') && (
            <div className="mb-14">
              <h2 className="mb-4 font-heading text-xl font-bold text-dark">De ce să alegi Midea Breezeless E?</h2>
              <BannerSlider />
            </div>
          )}

          <div className="mb-14 grid gap-8 lg:grid-cols-3">
            <div className="card lg:col-span-2">
              <h2 className="mb-5 font-heading text-xl font-bold text-dark">Specificații tehnice</h2>
              {publicSpecs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {publicSpecs.map((spec, index) => (
                        <tr key={`${spec.label}-${index}`} className={index % 2 === 0 ? 'bg-light-200' : 'bg-white'}>
                          <td className="w-1/2 rounded-l-lg px-4 py-3 font-medium text-dark-300">{spec.label}</td>
                          <td className="rounded-r-lg px-4 py-3 font-semibold text-dark">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-sm text-dark-300">Specificațiile se confirmă în funcție de model și ofertă.</p>
              )}
            </div>

            <div className="card">
              <h2 className="mb-4 font-heading text-xl font-bold text-dark">Documentație & consultanță</h2>
              <div className="space-y-3">
                {officialUrl ? (
                  <a href={officialUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-primary px-4 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-white">
                    <ExternalLink size={18} />
                    Pagina oficială producător
                  </a>
                ) : (
                  <p className="text-sm text-dark-300">Documentația produsului se oferă la cerere.</p>
                )}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-3 font-semibold text-white transition-all hover:bg-green-600">
                  <MessageCircle size={18} />
                  Cere detalii pe WhatsApp
                </a>
                <p className="text-xs text-dark-300">PRO TERM oferă consultanță pentru alegerea corectă a echipamentului și pentru condițiile de montaj.</p>
              </div>
            </div>
          </div>

          {serviceProduct && (
            <div className="mb-14 grid gap-6 lg:grid-cols-3">
              <div className="card">
                <h2 className="mb-3 font-heading text-xl font-bold text-dark">Ce include serviciul</h2>
                <p className="text-sm leading-relaxed text-dark-300">
                  Serviciul include lucrările standard prezentate în descriere și materialele menționate la produs, în limita condițiilor normale de montaj.
                </p>
              </div>
              <div className="card">
                <h2 className="mb-3 font-heading text-xl font-bold text-dark">Ce poate costa suplimentar</h2>
                <p className="text-sm leading-relaxed text-dark-300">
                  Traseele suplimentare, străpungerile extra, mascarea traseului, modificările electrice sau lucrările speciale se tarifează separat, după caz.
                </p>
              </div>
              <div className="card">
                <h2 className="mb-3 font-heading text-xl font-bold text-dark">Condiții de lucru</h2>
                <p className="text-sm leading-relaxed text-dark-300">
                  Clientul trebuie să asigure accesul la zona de montaj și să comunice eventuale trasee ascunse de apă, gaz, canalizare sau electricitate.
                </p>
              </div>
            </div>
          )}

          {related.length > 0 && (
            <div>
              <h2 className="mb-6 font-heading text-2xl font-bold text-dark">Produse similare</h2>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((item) => <ProductCard key={item.id} product={item} />)}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
