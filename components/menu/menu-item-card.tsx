import Image from 'next/image';
import Link from 'next/link';
import { getPriceTierNotice } from '@/utils/price-calculator';

interface MenuItemCardProps {
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  imageFit?: 'cover' | 'contain';
  minGuests: number;
  maxGuests: number;
  inquiryRequired?: number;
}

export default function MenuItemCard({
  image,
  alt,
  title,
  subtitle,
  description,
  price,
  imageFit = 'cover',
  minGuests,
  maxGuests,
  inquiryRequired,
}: MenuItemCardProps) {
  const priceTierNotice = getPriceTierNotice(title);
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
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-4 flex-wrap sm:justify-between">
              <div className="text-sm text-gray-400">
                <span className="whitespace-nowrap">
                  {minGuests}-{maxGuests} guests
                </span>
                {priceTierNotice && (
                  <span className="text-xs ml-1 block sm:inline">
                    ({priceTierNotice})
                  </span>
                )}
                {inquiryRequired && (
                  <span className="text-xs ml-1">(Larger groups welcome - inquire)</span>
                )}
              </div>
              <div className="text-xl lg:text-2xl font-light text-gray-400 whitespace-nowrap">
                {price}
              </div>
            </div>
            <Link
              href={`/reservation?menu=${encodeURIComponent(title)}`}
              className="block w-full py-3 bg-primary text-white hover:bg-primary/90 transition-colors font-light text-center tracking-wide"
            >
              Make a Reservation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
