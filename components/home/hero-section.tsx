import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0">
        <Image
          src="/main.jpeg"
          alt="프리미엄 스시 박스"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 to-black/80"></div>
      </div>
      <div className="relative z-10 text-center max-w-4xl px-8 font-playfair">
        <div
          className="text-sm md:text-base tracking-[0.3em] uppercase text-primary mb-8 font-light animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Luxury Omakase
        </div>
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight mb-8 tracking-wider animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          Anywhere You Desire
        </h1>
        <div
          className="text-lg md:text-xl lg:text-2xl text-gray-300 font-light italic animate-fade-in-up opacity-0"
          style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          The Art of Omakase, Delivered to You.
        </div>
      </div>
    </section>
  );
}
