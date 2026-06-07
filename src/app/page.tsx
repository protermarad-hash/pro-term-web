import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import PartnerBanners from '@/components/PartnerBanners';
import Services from '@/components/Services';
import About from '@/components/About';
import WhyUs from '@/components/WhyUs';
import Contact from '@/components/Contact';
import ConsumerProtectionNotice from '@/components/ConsumerProtectionNotice';
import Footer from '@/components/Footer';

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
        <WhyUs />
        <ConsumerProtectionNotice />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
