import Image from 'next/image';

export default function ServiceSection() {
  return (
    <section className="relative pb-16 lg:pb-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Mobile: Elegant Vertical Layout */}
        <div className="lg:hidden space-y-16">
          {/* Text Content First */}
          <div>
            <p className="text-lg sm:text-xl font-light text-gray-200 leading-relaxed text-center px-4">
              Whether for birthdays, milestones, corporate galas, or intimate
              gatherings, Washoku Hana delivers an unforgettable dining journey
              that lingers long after the last bite.
            </p>
          </div>

          {/* Large Hero Image */}
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src="/guest-dining-experience.jpeg"
              alt="Guest enjoying omakase experience"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
          </div>

          {/* Supporting Images Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/chef-precision-cutting.jpeg"
                alt="Chef's precise craftsmanship"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/premium-uni-plating.jpeg"
                alt="Premium uni presentation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10"></div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="text-center space-y-4 px-4">
            <p className="text-base sm:text-lg font-light text-gray-200 tracking-wide">
              Not just sushi.
              <br />
              Not just dinner.
            </p>
            <p className="text-xl sm:text-2xl font-playfair font-light text-primary italic tracking-wide">
              An experience your guests will remember forever.
            </p>
          </div>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-2 gap-20 items-center">
          {/* Left: Large Featured Image */}
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src="/guest-dining-experience.jpeg"
              alt="Guest enjoying omakase experience"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          {/* Right: Content */}
          <div className="space-y-12">
            {/* Text Content */}
            <div className="space-y-8">
              <p className="text-lg sm:text-xl xl:text-2xl font-light text-gray-200 leading-relaxed">
                Whether for birthdays, milestones, corporate galas, or intimate
                gatherings, Washoku Hana delivers an unforgettable dining
                journey that lingers long after the last bite.
              </p>

              <div className="space-y-4 pt-4 border-t border-gray-800">
                <p className="text-base sm:text-lg font-light text-gray-200">
                  Not just sushi.
                  <br />
                  Not just dinner.
                </p>
                <p className="text-xl sm:text-2xl font-playfair font-light text-primary italic">
                  An experience your guests will remember forever.
                </p>
              </div>
            </div>

            {/* Small Supporting Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/chef-precision-cutting.jpeg"
                  alt="Chef's precise craftsmanship"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src="/premium-uni-plating.jpeg"
                  alt="Premium uni presentation"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
