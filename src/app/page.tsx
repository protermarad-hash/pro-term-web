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
import WhyUs from '@/components/WhyUs';
import Contact from '@/components/Contact';
import ConsumerProtectionNotice from '@/components/ConsumerProtectionNotice';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Dealer Autorizat Midea, Gree, Yamato | Montaj Aer Condiționat Arad | PRO TERM SRL',
  description:
    'PRO TERM SRL — dealer autorizat Midea, Gree și Yamato în România. Montaj și service aer condiționat în Arad și Timiș. Livrare în toată România. Proiecte VRV comerciale. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro' },
  openGraph: {
    title: 'Dealer Autorizat Midea, Gree, Yamato | PRO TERM SRL Arad',
    description:
      'Dealer autorizat Midea, Gree și Yamato. Montaj și service HVAC în Arad și Timiș. Livrare echipamente în toată România. Sisteme VRV comerciale național.',
    url: 'https://pro-term.ro',
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <MideaBanner />
        <section className="container mx-auto px-4 py-8">
          <h2 className="mb-4 font-heading text-2xl font-bold text-dark md:text-3xl">
            De ce să alegi Midea Breezeless E?
          </h2>
          <BannerSlider />
        </section>
        <FeaturedProducts />
        <PartnerBanners />
        <Services />
        <About />
        <ProiecteRealizate />
        <WhyUs />
        <ConsumerProtectionNotice />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
