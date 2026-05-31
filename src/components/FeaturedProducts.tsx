import Link from 'next/link';
import { ArrowRight, CheckCircle2, PackageCheck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products } from '@/lib/products';

const featuredProducts = products
  .filter((product) => product.isBestseller || product.isNew)
  .slice(0, 3);

const shopBenefits = [
  'Produse selectate pentru locuințe, birouri și spații comerciale',
  'Poți comanda online sau poți cere ofertă cu montaj',
  'Consultanță pentru alegerea capacității potrivite',
];

export default function FeaturedProducts() {
  return (
    <section id="magazin" className="py-20 bg-light-200">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 items-start">
          <div className="lg:sticky lg:top-28">
            <span className="text-accent font-semibold text-sm uppercase tracking-widest">
              Magazin online
            </span>
            <h2 className="section-title mt-2">
              Produse HVAC pregătite pentru comandă sau ofertă cu montaj
            </h2>
            <p className="section-subtitle text-left mt-4">
              Începe cu cele mai căutate echipamente, compară prețurile și cere rapid
              recomandare tehnică înainte de achiziție.
            </p>

            <div className="space-y-3 mt-6">
              {shopBenefits.map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-dark-300 text-sm leading-relaxed">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produse" className="btn-primary">
                Vezi toate produsele
                <ArrowRight size={18} />
              </Link>
              <Link href="/#contact" className="btn-outline border-primary text-primary hover:bg-primary hover:text-white">
                Cere ofertă rapidă
              </Link>
            </div>

            <div className="mt-8 rounded-2xl bg-white border border-primary/10 p-5 shadow-card">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <PackageCheck size={20} className="text-primary" />
                </div>
                <h3 className="font-bold font-heading text-dark">Magazin + service local</h3>
              </div>
              <p className="text-sm text-dark-300 leading-relaxed">
                Pentru echipamentele tehnice, poți adăuga produsul în coș sau poți solicita
                verificare pentru montaj, dimensionare și disponibilitate.
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
