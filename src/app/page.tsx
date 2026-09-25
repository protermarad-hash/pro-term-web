import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import PartnerBanners from '@/components/PartnerBanners';
import MideaBanner from '@/components/MideaBanner';
import BannerSlider from '@/components/BannerSlider';
import Services from '@/components/Services';
import About from '@/components/About';
import ProiecteRealizate from '@/components/ProiecteRealizate';
import Contact from '@/components/Contact';
import ConsumerProtectionNotice from '@/components/ConsumerProtectionNotice';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'PRO TERM | Climatizare, Încălzire și Proiecte HVAC',
  description:
    'PRO TERM SRL — echipamente HVAC cu livrare națională, montaj și service în Arad și zona apropiată, proiecte comerciale și industriale de climatizare la nivel național. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro' },
  openGraph: {
    title: 'PRO TERM | Climatizare, Încălzire și Proiecte HVAC',
    description:
      'Echipamente HVAC cu livrare națională, montaj și service în Arad și zona apropiată, proiecte comerciale și industriale de climatizare la nivel național.',
    url: 'https://pro-term.ro',
    images: [{ url: '/logo-proterm.jpg', width: 930, height: 640, alt: 'PRO TERM' }],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <MideaBanner />
        <section className="container mx-auto px-4 py-8">
          <h2 className="mb-4 font-heading text-2xl font-bold text-dark md:text-3xl">
            De ce să alegi Midea Breezeless E?
          </h2>
          <BannerSlider />
        </section>
        <FeaturedProducts />
        <PartnerBanners />
        <About />
        <ProiecteRealizate />
        <Contact />
        <ConsumerProtectionNotice />
      </main>
      <Footer />
    </>
  );
}
