import type { Metadata } from 'next';
import Header from '@/components/Header';
import HomepageHero from '@/components/HomepageHero';
import TrustBar from '@/components/TrustBar';
import ProductCategories from '@/components/ProductCategories';
import ConsultationSection from '@/components/ConsultationSection';
import InstallationServiceSection from '@/components/InstallationServiceSection';
import HeatPumpSection from '@/components/HeatPumpSection';
import CommercialIndustrialSection from '@/components/CommercialIndustrialSection';
import WorkProcess from '@/components/WorkProcess';
import WhyProTerm from '@/components/WhyProTerm';
import HomepageFinalCTA from '@/components/HomepageFinalCTA';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Climatizare, Încălzire și Ventilație HVAC | PRO TERM SRL Arad',
  description:
    'PRO TERM SRL — magazin, consultanță, montaj și service HVAC: aer condiționat, pompe de căldură și ventilație. Dealer autorizat Midea, Gree, Yamato. Arad și Timiș, proiecte comerciale în România. Sună: 0749 025 610.',
  alternates: { canonical: 'https://pro-term.ro' },
  openGraph: {
    title: 'Climatizare, Încălzire și Ventilație HVAC | PRO TERM SRL',
    description:
      'Magazin, consultanță, montaj și service HVAC: aer condiționat, pompe de căldură, ventilație. Dealer autorizat Midea, Gree, Yamato. Proiecte comerciale și industriale în România.',
    url: 'https://pro-term.ro',
    images: [{ url: '/logo-proterm.jpg', width: 930, height: 640, alt: 'PRO TERM' }],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HomepageHero />
        <TrustBar />
        <ProductCategories />
        <ConsultationSection />
        <InstallationServiceSection />
        <HeatPumpSection />
        <CommercialIndustrialSection />
        <WorkProcess />
        <WhyProTerm />
        <HomepageFinalCTA />
      </main>
      <Footer />
    </>
  );
}
