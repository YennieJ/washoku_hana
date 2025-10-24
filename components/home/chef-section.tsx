import Image from 'next/image';

export default function ChefSection() {
  return (
    <section className="relative">
      <div className="max-w-7xl mx-auto">
        {/* Mobile: Vertical Stack */}
        <div className="lg:hidden space-y-12">
          {/* Text First on Mobile */}
          <div className="px-6">
            <div className="max-w-xl mx-auto space-y-6">
              <p className="text-lg sm:text-xl font-light text-gray-200 leading-relaxed">
                Washoku Hana transforms your home, office, or private venue into
                a world-class sushi bar. Led by{' '}
                <span className="text-primary italic font-medium">
                  Chef Minho
                </span>
                , whose decade of expertise in Japanese haute cuisine inspires
                every detail, each event becomes a captivating performance of
                taste and artistry.
              </p>
            </div>
          </div>
          {/* Chef Image */}
          <div className="px-6">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/minho.jpg"
                alt="Chef Minho"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Desktop: 50/50 Split */}
        <div className="hidden lg:grid lg:grid-cols-2 lg:min-h-screen lg:gap-12 xl:gap-16">
          {/* Left: Chef Image */}
          <div className="relative overflow-hidden lg:pl-12 xl:pl-16">
            <div className="relative h-full">
              <Image
                src="/minho.jpg"
                alt="Chef Minho"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
            </div>
          </div>

          {/* Right: Text Content */}
          <div className="flex items-center pl-12 xl:pl-16 pr-12 xl:pr-16">
            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <div className="h-px w-16 bg-primary"></div>
                <h2 className="text-3xl xl:text-4xl font-light text-white tracking-wide">
                  Chef Minho
                </h2>
              </div>

              <p className="text-xl xl:text-2xl font-light text-gray-200 leading-relaxed">
                Washoku Hana transforms your home, office, or private venue into
                a world-class sushi bar. Led by{' '}
                <span className="text-primary italic font-medium">
                  Chef Minho
                </span>
                , whose decade of expertise in Japanese haute cuisine inspires
                every detail, each event becomes a captivating performance of
                taste and artistry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
