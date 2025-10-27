import MenuItemCard from '@/components/menu/menu-item-card';
import { menuItems } from '@/constants/menu-items';

export default function MenuItemsSection() {
  return (
    <section className="relative py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="space-y-10 lg:space-y-12">
          {menuItems.map((item) => (
            <MenuItemCard
              key={item.title}
              {...item}
              imageFit={item.imageFit as 'contain' | 'cover'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
