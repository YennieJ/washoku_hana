import Footer from '@/components/footer';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/home/hero-section';
import ChefSection from '@/components/home/chef-section';
import AboutMenuSection from '@/components/home/about-menu-section';
import ServiceSection from '@/components/home/service-section';

export default function HomePage() {
  const Divider = () => {
    return (
      <div className="relative py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </div>
      </div>
    );
  };
  return (
    <div className="min-h-screen text-white">
      <Navigation />

      <HeroSection />
      <Divider />

      <ChefSection />

      <Divider />

      <AboutMenuSection />

      <Divider />

      <ServiceSection />

      <Footer />
    </div>
  );
}
