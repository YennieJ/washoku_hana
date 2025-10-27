import Navigation from '@/components/navigation';
import Footer from '@/components/footer';
import MenuHeroSection from '@/components/menu/hero-section';
import MenuItemsSection from '@/components/menu/menu-item-section';
import FAQSection from '@/components/menu/faq-section';

export default function MenuPage() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />

      {/* Hero Section */}
      <MenuHeroSection />
      <MenuItemsSection />

      <div className="relative py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQSection />

      <Footer />
    </div>
  );
}
