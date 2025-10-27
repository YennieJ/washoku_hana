import Image from 'next/image';

interface MenuItemCardProps {
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  imageFit?: 'cover' | 'contain';
}

export default function MenuItemCard({
  image,
  alt,
  title,
  subtitle,
  description,
  price,
  imageFit = 'cover',
}: MenuItemCardProps) {
  return (
    <div className="group bg-white/5 border border-primary/20 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/40 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row">
        {/* Image */}
        <div className="w-full lg:w-2/5 aspect-square overflow-hidden flex items-center justify-center">
          <div className="relative w-11/12 h-3/5">
            <Image
              src={image}
              alt={alt}
              fill
              className={`object-${imageFit} object-center`}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 pb-8 px-8 lg:p-10 flex flex-col">
          <div className="flex-1">
            <h2 className="text-3xl lg:text-4xl font-light text-primary tracking-wide mb-2">
              {title}
            </h2>
            <p className="text-sm lg:text-base italic text-gray-400 mb-4 lg:mb-6">
              {subtitle}
            </p>
            <p className="text-base lg:text-lg font-light text-gray-300 leading-relaxed">
              {description}
            </p>
          </div>
          <div className="text-xl lg:text-2xl font-light text-gray-400 text-right mt-6">
            {price}
          </div>
        </div>
      </div>
    </div>
  );
}
