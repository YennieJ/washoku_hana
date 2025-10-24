import Image from 'next/image';

export default function AboutMenuSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Flowing Images Background - 640px and above */}
      <div className="hidden sm:block absolute top-4 left-0 right-0 flex flex-col justify-start gap-3 px-4">
        {/* First row */}
        <div className="flex gap-4 justify-center opacity-60">
          <div className="relative w-64 h-40">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-40">
            <Image
              src="/Wagyu.jpeg"
              alt="Wagyu"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-40">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-40">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-40">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* Mobile Images - Infinite Slider for screens 640px and below */}
      <div className="sm:hidden absolute top-4 left-0 right-0 overflow-hidden">
        <div className="flex gap-4 opacity-50 animate-infinite-scroll">
          {/* First set of images */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Wagyu.jpeg"
              alt="Wagyu"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
          {/* Duplicate set for seamless loop */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Wagyu.jpeg"
              alt="Wagyu"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/Honmaguro.jpeg"
              alt="Honmaguro"
              fill
              className="object-cover rounded"
            />
          </div>
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src="/uni.jpeg"
              alt="Uni"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-48 sm:pt-40 md:pt-40 lg:pt-40">
        <div className="space-y-8 sm:space-y-12 text-gray-300 leading-relaxed">
          {/* Premium Ingredients */}
          <div className="max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto">
            <div className="bg-black/50 backdrop-blur-sm border border-gray-800/50 rounded-lg p-4 sm:p-6">
              <div className="flex flex-wrap gap-2 sm:gap-4 justify-center max-[460px]:flex-col max-[460px]:items-center">
                <div className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-300 hover:text-primary transition-colors duration-300 relative group max-[460px]:w-full max-[460px]:text-center">
                  <span>Honmaguro</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
                </div>
                <div className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-300 hover:text-primary transition-colors duration-300 relative group max-[460px]:w-full max-[460px]:text-center">
                  <span>Miyazaki Wagyu</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
                </div>
                <div className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-300 hover:text-primary transition-colors duration-300 relative group max-[460px]:w-full max-[460px]:text-center">
                  <span>Uni</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
                </div>
                <div className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-300 hover:text-primary transition-colors duration-300 relative group max-[460px]:w-full max-[460px]:text-center">
                  <span>Truffle</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
                </div>
                <div className="text-sm sm:text-base tracking-[0.2em] uppercase text-gray-300 hover:text-primary transition-colors duration-300 relative group max-[460px]:w-full max-[460px]:text-center">
                  <span>Caviar</span>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full"></div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-lg sm:text-xl xl:text-2xl font-light text-gray-200 text-center max-w-xs sm:max-w-2xl lg:max-w-4xl mx-auto px-4 leading-relaxed">
            From Honmaguro and Miyazaki Wagyu to uni, truffle, and caviar, only
            the most coveted ingredients make their way to your table. Every
            piece is prepared before your eyes—a live showcase of{' '}
            <span className="text-primary italic">
              precision, passion, and craft
            </span>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
