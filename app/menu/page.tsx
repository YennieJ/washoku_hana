import Navigation from '@/components/navigation';
import Image from 'next/image';
import Footer from '@/components/footer';

export default function MenuPage() {
  return (
    <div className="min-h-screen text-white">
      <Navigation />

      {/* Hero Section */}
      <section className="relative pt-28 md:pt-40 md:pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <h1 className="text-5xl lg:text-6xl font-light text-center tracking-wider">
            MENU
          </h1>
        </div>
      </section>

      {/* Menu Items Section */}
      <section className="relative py-20 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="space-y-10 lg:space-y-12">
            {/* Premium Omakase */}
            <div className="group bg-white/5 border border-primary/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row">
                {/* Image - Left Side on Desktop */}
                <div className="w-full lg:w-2/5 aspect-square overflow-hidden flex items-center justify-center">
                  <div className="relative w-11/12 h-3/5 ">
                    <Image
                      src="/Premium Omakase.jpeg.jpeg"
                      alt="Premium Omakase"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* Content - Right Side on Desktop */}
                <div className="flex-1 pb-8 px-8 lg:p-10 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-light text-primary tracking-wide mb-2">
                      Premium Omakase
                    </h2>
                    <p className="text-sm lg:text-base italic text-gray-400 mb-4 lg:mb-6">
                      The True Essence of Sushi.
                    </p>
                    <p className="text-base lg:text-lg font-light text-gray-300 leading-relaxed">
                      Experience an authentic Kyoto-style omakase restaurant in
                      the comfort of your home. A 17-course journey begins with
                      refined appetizers and sashimi, followed by perfectly
                      balanced nigiri sushi and a delicate dessert. Every moment
                      is crafted by the hands of a master, bringing the full
                      spirit of traditional Japanese omakase sushi to your
                      table.
                    </p>
                  </div>
                  <div className="text-xl lg:text-2xl font-light text-gray-400 text-right mt-6">
                    가격 산정 중
                  </div>
                </div>
              </div>
            </div>

            {/* Kaiseki Kappo Cuisine */}
            <div className="group bg-white/5 border border-primary/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row">
                {/* Image - Left Side on Desktop */}
                <div className="w-full lg:w-2/5 aspect-square overflow-hidden flex items-center justify-center">
                  <div className="relative w-11/12 h-3/5 ">
                    <Image
                      src="/Kaiseki Kappo Cuisine.jpeg"
                      alt="Kaiseki Kappo Cuisine"
                      fill
                      className="object-contain object-center"
                    />
                  </div>
                </div>

                {/* Content - Right Side on Desktop */}
                <div className="flex-1 pb-8 px-8 lg:p-10 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-light text-primary tracking-wide mb-2">
                      Kaiseki Kappo Cuisine
                    </h2>
                    <p className="text-sm lg:text-base italic text-gray-400 mb-4 lg:mb-6">
                      A Journey Through the Seasons.
                    </p>
                    <p className="text-base lg:text-lg font-light text-gray-300 leading-relaxed">
                      Discover the elegance of Kaiseki Kappo, crafted with
                      traditional Japanese techniques. Each course reflects the
                      beauty of the season—ingredients, colors, tableware, and
                      even the cups are chosen to express harmony with nature.
                      From the opening zensai to the highlight of the Kaiseki
                      course, hassun, every dish celebrates the spirit of the
                      season. Sashimi, grilled, fried, simmered, and steamed
                      dishes are prepared with precision to bring out the most
                      delicate flavors and presentation. And the best part—you
                      can experience this exquisite Kaiseki journey in the
                      comfort of your own home.
                    </p>
                  </div>
                  <div className="text-xl lg:text-2xl font-light text-gray-400 text-right mt-6">
                    가격 산정 중
                  </div>
                </div>
              </div>
            </div>

            {/* Winter Special Catering Service */}
            <div className="group bg-white/5 border border-primary/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 backdrop-blur-sm">
              <div className="flex flex-col lg:flex-row">
                {/* Image - Left Side on Desktop */}
                <div className="w-full lg:w-2/5 aspect-square overflow-hidden flex items-center justify-center">
                  <div className="relative w-11/12 h-3/5 ">
                    <Image
                      src="/Catering Service.jpeg"
                      alt="Winter Special Catering Service"
                      fill
                      className="object-cover object-center"
                    />
                  </div>
                </div>

                {/* Content - Right Side on Desktop */}
                <div className="flex-1 pb-8 px-8 lg:p-10 flex flex-col">
                  <div className="flex-1">
                    <h2 className="text-3xl lg:text-4xl font-light text-primary tracking-wide mb-2">
                      Winter Special Catering Service
                    </h2>
                    <p className="text-sm lg:text-base italic text-gray-400 mb-4 lg:mb-6">
                      Elevate Your Event to Pure Luxury.
                    </p>
                    <p className="text-base lg:text-lg font-light text-gray-300 leading-relaxed">
                      This is the ultimate way to take your party to the next
                      level. On-site catering with professional Japanese chefs,
                      delivering artistry made exclusively for you. Enjoy a live
                      oyster bar with 200 freshly shucked oysters, an authentic
                      Japanese oden station, and 10 pieces of premium nigiri
                      sushi per guest—all in one extraordinary catering
                      experience.
                    </p>
                  </div>
                  <div className="text-xl lg:text-2xl font-light text-gray-400 text-right mt-6">
                    가격 산정 중
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="relative py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="relative py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <h3 className="text-3xl lg:text-4xl font-light mb-12 lg:mb-16">
            FAQ
          </h3>
          <div className="mx-auto space-y-8 lg:space-y-12">
            <div>
              <h4 className="text-primary text-lg lg:text-xl mb-3">
                Q. 예약은 언제 가능한가요?
              </h4>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                주말(토요일, 일요일) 저녁 7시에만 서비스를 제공합니다.
              </p>
            </div>
            <div>
              <h4 className="text-primary text-lg lg:text-xl mb-3">
                Q. 서비스 지역은 어디까지인가요?
              </h4>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                서울 전 지역에서 서비스를 제공하며, 교통비는 별도로 산정됩니다.
              </p>
            </div>
            <div>
              <h4 className="text-primary text-lg lg:text-xl mb-3">
                Q. 최소 인원은 몇 명인가요?
              </h4>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                최소 2명부터 최대 15명까지 서비스 가능합니다.
              </p>
            </div>
            <div>
              <h4 className="text-primary text-lg lg:text-xl mb-3">
                Q. 취소나 변경은 언제까지 가능한가요?
              </h4>
              <p className="text-gray-300 text-base lg:text-lg leading-relaxed">
                예약일 3일 전까지 취소 및 변경이 가능합니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
