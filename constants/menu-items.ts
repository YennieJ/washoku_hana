export interface MenuItem {
  id: number;
  image: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  price: string;
  imageFit?: 'cover' | 'contain';
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    image: '/Premium Omakase.jpeg.jpeg',
    alt: 'Premium Omakase',
    title: 'Premium Omakase',
    subtitle: 'The True Essence of Sushi.',
    description: `Experience an authentic Kyoto-style omakase restaurant in the comfort of your home. A 17-course journey begins with refined appetizers and sashimi, followed by perfectly balanced nigiri sushi and a delicate dessert. Every moment is crafted by the hands of a master, bringing the full spirit of traditional Japanese omakase sushi to your table.`,
    price: '가격 산정 중',
  },
  {
    id: 2,
    image: '/Kaiseki Kappo Cuisine.jpeg',
    alt: 'Kaiseki Kappo Cuisine',
    title: 'Kaiseki Kappo Cuisine',
    subtitle: 'A Journey Through the Seasons.',
    description: `Discover the elegance of Kaiseki Kappo, crafted with traditional Japanese techniques. Each course reflects the beauty of the season—ingredients, colors, tableware, and even the cups are chosen to express harmony with nature. From the opening zensai to the highlight of the Kaiseki course, hassun, every dish celebrates the spirit of the season. Sashimi, grilled, fried, simmered, and steamed dishes are prepared with precision to bring out the most delicate flavors and presentation. And the best part—you can experience this exquisite Kaiseki journey in the comfort of your own home.`,
    price: '가격 산정 중',
    imageFit: 'contain',
  },
  {
    id: 3,
    image: '/Catering Service.jpeg',
    alt: 'Winter Special Catering Service',
    title: 'Winter Special Catering Service',
    subtitle: 'Elevate Your Event to Pure Luxury.',
    description: `This is the ultimate way to take your party to the next level. On-site catering with professional Japanese chefs, delivering artistry made exclusively for you. Enjoy a live oyster bar with 200 freshly shucked oysters, an authentic Japanese oden station, and 10 pieces of premium nigiri sushi per guest—all in one extraordinary catering experience.`,
    price: '가격 산정 중',
  },
];
