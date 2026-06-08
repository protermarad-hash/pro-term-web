import type { Metadata } from 'next';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import PartnerBanners from '@/components/PartnerBanners';
import Services from '@/components/Services';
import About from '@/components/About';
import ProiecteRealizate from '@/components/ProiecteRealizate';
import WhyUs from '@/components/WhyUs';
import Contact from '@/components/Contact';
import ConsumerProtectionNotice from '@/components/ConsumerProtectionNotice';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Montaj & Service Aer Condiționat Arad și Timiș | PRO TERM SRL',
  description:
    'PRO TERM SRL — montaj și service aer condiționat în județele Arad și Timiș. Dealer Gree, Midea, Yamato cu livrare în toată România. Proiecte VRV comerciale la nivel național. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro' },
  openGraph: {
    title: 'Montaj & Service Aer Condiționat Arad și Timiș | PRO TERM SRL',
    description:
      'Montaj și service HVAC în Arad și Timiș. Dealer autorizat Gree, Midea, Yamato. Livrare echipamente în toată România. Sisteme VRV comerciale național.',
    url: 'https://pro-term.ro',
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
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
